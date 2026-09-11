import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, uploadProductImage } from './firebase';
import { CraftProduct, AuthUser, FirestoreUser, FirestoreMessage, UserAccountRecord, MarketplaceOrder, UserLocation } from '../types';
import { mockCraftProducts } from '../data/mockData';
import { getRegisteredUsers } from '../utils/authService';

const MIGRATION_KEY = 'kalasetu_firestore_migrated_v7';
const PRODUCTS_CACHE_KEY = 'kalasetu_firestore_products_cache';
const MESSAGES_CACHE_KEY = 'kalasetu_firestore_messages_cache';
const ORDERS_CACHE_KEY = 'kalasetu_firestore_orders_cache';

export const DEMO_SEED_ACCOUNTS: FirestoreUser[] = [
  {
    id: 'user-vaishu',
    email: 'vaishukalkuda@gmail.com',
    name: 'Vaishu Kalkuda',
    role: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    language: 'te',
    phone: '+91 98123 45678',
    authProvider: 'google',
    isVerified: true,
    joinedDate: '12 January 2026',
    bio: 'Rural craft patron & traditional terracotta artisan • Medchal',
    location: {
      lat: 17.6296,
      lng: 78.4822,
      city: 'Medchal',
      state: 'Telangana',
    },
  },
  {
    id: 'user-parvati',
    email: 'parvati@kalasetu.org',
    name: 'Lakshmi Devi (Master Artisan)',
    role: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    language: 'te',
    phone: '+91 98765 43210',
    authProvider: 'email',
    isVerified: true,
    joinedDate: '15 August 2025',
    bio: 'Master Handloom & Terracotta Artisan, Shamirpet, Telangana (21 yrs exp)',
    location: {
      lat: 17.5947,
      lng: 78.5765,
      city: 'Shamirpet',
      state: 'Telangana',
    },
  },
  {
    id: 'user-raghav',
    email: 'raghav.sharma@gmail.com',
    name: 'Raghavendra Sharma',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    language: 'en',
    phone: '+91 94567 89012',
    authProvider: 'email',
    isVerified: true,
    joinedDate: '3 February 2026',
    bio: 'Handloom & authentic Indian craft enthusiast • Buyer',
    location: {
      lat: 17.6296,
      lng: 78.4822,
      city: 'Medchal',
      state: 'Telangana',
    },
  },
];

/**
 * Guarantees that the multi-user demo accounts exist in Firestore 'users' collection
 */
export async function ensureDemoUsersInFirestore(): Promise<void> {
  try {
    for (const demoAccount of DEMO_SEED_ACCOUNTS) {
      await setDoc(doc(db, 'users', demoAccount.id), demoAccount, { merge: true });
    }
    console.log('[Firestore] Multi-user demo seed accounts confirmed in Firestore users collection');
  } catch (err) {
    console.warn('[Firestore] Error verifying demo accounts in Firestore:', err);
  }
}

/**
 * One-time and runtime cleanup that identifies and deletes duplicate product documents in Firestore
 */
export async function cleanupDuplicateProducts(targetArtisanId?: string): Promise<number> {
  let deletedCount = 0;
  try {
    const productsSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (productsSnap && !productsSnap.empty) {
      const seen = new Map<string, { id: string; createdAt: number }>();
      const toDelete: string[] = [];

      productsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const artisanId = (data.artisanId || '').trim();
        if (targetArtisanId && artisanId !== targetArtisanId) {
          return;
        }
        const title = (data.title || '').trim().toLowerCase();
        const img = (data.imageUrl || data.images?.[0] || '').trim();
        const key = `${artisanId}_${title}_${img}`;
        const time = data.createdAt ? new Date(data.createdAt).getTime() : 0;

        if (seen.has(key)) {
          const existing = seen.get(key)!;
          if (time < existing.createdAt) {
            toDelete.push(existing.id);
            seen.set(key, { id: docSnap.id, createdAt: time });
          } else {
            toDelete.push(docSnap.id);
          }
        } else {
          seen.set(key, { id: docSnap.id, createdAt: time });
        }
      });

      if (toDelete.length > 0) {
        const batch = writeBatch(db);
        for (const docId of toDelete) {
          batch.delete(doc(db, 'products', docId));
        }
        await batch.commit();
        deletedCount = toDelete.length;
      }
    }
  } catch (err) {
    console.warn('[Cleanup] Error checking duplicates:', err);
  }

  // Also clean local storage cache
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      const parsed: CraftProduct[] = JSON.parse(cached);
      const unique = Array.from(new Map(parsed.map((p) => [p.id, p])).values());
      localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(unique));
    }
  } catch {
    // ignore
  }

  return deletedCount;
}

/**
 * Complete Migration and Fresh Seed Workflow for Medchal + 20 km local rural artisans.
 */
export async function runFirestoreMigration(): Promise<void> {
  try {
    const alreadyMigrated = localStorage.getItem(MIGRATION_KEY);
    if (alreadyMigrated === 'true') {
      ensureDemoUsersInFirestore().catch(() => {});
      return;
    }

    console.log('[Firestore] Running data migration to Firestore...');

    // === SECTION 1: DELETE ALL EXISTING SEED DATA ===
    // 1. Delete every product in 'products' in batches of 500
    const productsSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (productsSnap && !productsSnap.empty) {
      const docs = productsSnap.docs;
      let totalDeleted = 0;
      for (let i = 0; i < docs.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = docs.slice(i, i + 500);
        chunk.forEach((d) => batch.delete(d.ref));
        await batch.commit();
        totalDeleted += chunk.length;
      }
      console.log(`[Cleanup] Deleted ${totalDeleted} products`);
    }

    // 2. Clear users in 'users' collection EXCEPT current logged in user and seed accounts
    const usersSnap = await getDocs(collection(db, 'users')).catch(() => null);
    if (usersSnap && !usersSnap.empty) {
      const keepIds = new Set(['user-vaishu', 'user-parvati', 'user-raghav']);
      const keepEmails = new Set(['vaishukalkuda@gmail.com', 'parvati@kalasetu.org', 'raghav.sharma@gmail.com']);
      let currentUserId: string | null = null;
      try {
        const stored = localStorage.getItem('kalasetu_auth_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id) currentUserId = parsed.id;
        }
      } catch {}

      const userBatch = writeBatch(db);
      let usersDeleted = 0;
      usersSnap.forEach((uDoc) => {
        const data = uDoc.data();
        const isKeep = keepIds.has(uDoc.id) ||
                       (data.email && keepEmails.has(data.email.toLowerCase())) ||
                       (currentUserId && uDoc.id === currentUserId);
        if (!isKeep) {
          userBatch.delete(uDoc.ref);
          usersDeleted++;
        }
      });
      if (usersDeleted > 0) {
        await userBatch.commit();
        console.log(`[Cleanup] Deleted ${usersDeleted} demo users`);
      }
    }

    // 3. Clear 'messages' collection (old chat threads)
    const messagesSnap = await getDocs(collection(db, 'messages')).catch(() => null);
    if (messagesSnap && !messagesSnap.empty) {
      const msgDocs = messagesSnap.docs;
      for (let i = 0; i < msgDocs.length; i += 500) {
        const batch = writeBatch(db);
        const chunk = msgDocs.slice(i, i + 500);
        chunk.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    }

    // Clear local caches
    try {
      localStorage.removeItem(PRODUCTS_CACHE_KEY);
      localStorage.removeItem(MESSAGES_CACHE_KEY);
      localStorage.removeItem(ORDERS_CACHE_KEY);
    } catch {}

    console.log('[Migration] Cleared old data');
    console.log('[Migration] Seeding fresh local artisan data');

    // === SECTION 2: RESEED ONLY MEDCHAL + 20 KM RADIUS ===
    // 1. Seed Products
    const productBatch = writeBatch(db);
    for (const p of mockCraftProducts) {
      const docId = p.id;
      const productDoc: CraftProduct = {
        ...p,
        id: docId,
        price: p.price || p.suggestedPrice,
        suggestedPrice: p.suggestedPrice || p.price,
        imageUrl: p.imageUrl || p.images?.[0] || '',
        verifiedSeller: true,
        isVerified: true,
        isFairTrade: true,
        status: p.status || 'live',
        district: p.district || 'Medchal-Malkajgiri',
        state: p.state || 'Telangana',
        coordinates: p.coordinates || { lat: p.latitude || 17.6296, lng: p.longitude || 78.4822 },
        createdAt: p.createdAt || new Date().toISOString(),
      };
      productBatch.set(doc(db, 'products', docId), productDoc, { merge: true });
    }
    await productBatch.commit();
    console.log(`[Firestore] Seeded ${mockCraftProducts.length} local Medchal products successfully!`);

    // 2. Ensure Demo Users
    await ensureDemoUsersInFirestore();

    // 3. Seed welcome messages
    const welcomeBatch = writeBatch(db);
    const initialMessages: FirestoreMessage[] = [
      {
        id: 'msg-welcome-medchal',
        senderId: 'artisan-srinivas-medchal',
        recipientId: 'buyer-all',
        text: 'నమస్కారం! మేడ్చల్ చేతివృత్తుల మార్కెట్‌కు స్వాగతం. మీకు ఏవైనా సాంప్రదాయ మట్టి కుండలు లేదా వస్త్రాల వివరాలు కావాలా?',
        timestamp: new Date().toISOString(),
        senderName: 'Srinivas Yadav (Medchal Potter)',
        senderRole: 'artisan',
        productTitle: 'Hand-thrown clay water pot (matka)',
        time: '10:00 AM',
      },
    ];
    for (const m of initialMessages) {
      welcomeBatch.set(doc(db, 'messages', m.id), m, { merge: true });
    }
    await welcomeBatch.commit();

    localStorage.setItem(MIGRATION_KEY, 'true');
    console.log('[Firestore] All data migration completed successfully!');
  } catch (error) {
    console.warn('[Firestore] Migration warning (will retry on next load):', error);
  }
}

/**
 * Subscribes in real-time to Products from Firestore with local caching for offline use.
 */
export function subscribeToProducts(
  onUpdate: (products: CraftProduct[]) => void,
  onLoadingChange?: (loading: boolean) => void
): () => void {
  onLoadingChange?.(true);

  // First load from local storage cache if available for instant offline response
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      }
    }
  } catch {
    // ignore
  }

  const unsubscribe = onSnapshot(
    collection(db, 'products'),
    (snapshot) => {
      const prods: CraftProduct[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CraftProduct;
        // Normalize fields so existing UI components work flawlessly
        const price = data.price ?? data.suggestedPrice ?? 0;
        const images = data.images && data.images.length > 0 
          ? data.images 
          : (data.imageUrl ? [data.imageUrl] : []);
        
        prods.push({
          ...data,
          id: docSnap.id,
          price,
          suggestedPrice: price,
          images,
          imageUrl: images[0] || '',
        });
      });

      if (prods.length > 0) {
        // Deduplicate by ID
        const uniqueProds = Array.from(new Map(prods.map((p) => [p.id, p])).values());

        // Sort by createdAt descending if present
        uniqueProds.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });

        // Save to offline cache
        try {
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(uniqueProds));
        } catch {
          // ignore
        }
        onUpdate(uniqueProds);
      }
      onLoadingChange?.(false);
    },
    (error) => {
      console.warn('[Firestore] Products subscription offline or error:', error);
      onLoadingChange?.(false);
    }
  );

  return unsubscribe;
}

/**
 * Saves a new product to Firestore and uploads photo to Firebase Storage if needed.
 */
export async function createProductInFirestore(product: CraftProduct): Promise<CraftProduct> {
  const imageUrl = product.images?.[0] || product.imageUrl || '';
  let finalImageUrl = imageUrl;

  // If the image is base64, attempt upload to Firebase Storage
  if (imageUrl.startsWith('data:')) {
    try {
      finalImageUrl = await uploadProductImage(imageUrl, 'products');
    } catch (e) {
      console.warn('Storage upload error, using raw image:', e);
    }
  }

  const finalProduct: CraftProduct = {
    ...product,
    imageUrl: finalImageUrl,
    images: [finalImageUrl, ...(product.images?.slice(1) || [])],
    price: product.suggestedPrice,
    createdAt: product.createdAt || new Date().toISOString(),
  };

  // Firestore Document format (exactly fulfilling users, products, messages spec)
  const firestoreDoc = {
    id: finalProduct.id,
    artisanId: finalProduct.artisanId,
    title: finalProduct.title,
    description: finalProduct.description,
    price: finalProduct.suggestedPrice,
    imageUrl: finalImageUrl,
    createdAt: finalProduct.createdAt,
    // Full backward-compatible properties
    titleEnglish: finalProduct.titleEnglish || finalProduct.title,
    category: finalProduct.category,
    categoryEnglish: finalProduct.categoryEnglish || finalProduct.category,
    descriptionEnglish: finalProduct.descriptionEnglish || finalProduct.description,
    craftHours: finalProduct.craftHours,
    materials: finalProduct.materials,
    materialsEnglish: finalProduct.materialsEnglish || finalProduct.materials,
    suggestedPrice: finalProduct.suggestedPrice,
    artisanCut: finalProduct.artisanCut,
    packagingCut: finalProduct.packagingCut,
    status: finalProduct.status || 'live',
    images: finalProduct.images,
    audioStoryUrl: finalProduct.audioStoryUrl || '',
    audioDuration: finalProduct.audioDuration || '0:35',
    artisanName: finalProduct.artisanName,
    artisanAvatar: finalProduct.artisanAvatar,
    artisanRegion: finalProduct.artisanRegion,
    artisanExperience: finalProduct.artisanExperience,
    verifiedSeller: finalProduct.verifiedSeller !== false,
    shippingMode: finalProduct.shippingMode || 'both',
    isVerified: finalProduct.isVerified !== false,
    viewsCount: finalProduct.viewsCount || 1,
    isFairTrade: finalProduct.isFairTrade !== false,
    voiceTranscript: finalProduct.voiceTranscript || '',
  };

  // Persist to Firestore
  await setDoc(doc(db, 'products', finalProduct.id), firestoreDoc, { merge: true });

  // Update local cache
  try {
    const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
    const list: CraftProduct[] = cached ? JSON.parse(cached) : [];
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify([finalProduct, ...list.filter(p => p.id !== finalProduct.id)]));
  } catch {
    // ignore
  }

  return finalProduct;
}

/**
 * Saves or updates a user profile in Firestore collection 'users'
 */
export async function saveUserToFirestore(user: AuthUser | FirestoreUser): Promise<void> {
  const avatar = ('avatarUrl' in user ? user.avatarUrl : (user as FirestoreUser).avatar) || '';
  const userDoc: FirestoreUser = {
    id: user.id,
    email: user.email || '',
    name: user.name,
    role: user.role,
    avatar,
    language: user.language || 'hi',
    phone: user.phone || '',
    authProvider: user.authProvider,
    isVerified: user.isVerified,
    joinedDate: user.joinedDate,
    bio: user.bio,
    hasCompletedOnboarding: user.hasCompletedOnboarding ?? true,
  };

  await setDoc(doc(db, 'users', user.id), userDoc, { merge: true });
}

/**
 * Updates a buyer's saved location in their Firestore user profile
 */
export async function updateUserLocationInFirestore(
  userId: string,
  location: UserLocation
): Promise<void> {
  try {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { location }, { merge: true });
    console.log(`[Firestore] User location updated for ${userId}:`, location.city);
  } catch (error) {
    console.warn('[Firestore] Error saving user location to Firestore:', error);
  }
}

/**
 * Reads a user profile from Firestore collection 'users'
 */
export async function getUserFromFirestore(userId: string): Promise<FirestoreUser | null> {
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as FirestoreUser;
    }
  } catch (error) {
    console.warn('[Firestore] Error getting user doc:', error);
  }
  return null;
}

/**
 * Subscribes to real-time chat messages
 */
export function subscribeToMessages(
  onUpdate: (messages: FirestoreMessage[]) => void,
  onLoadingChange?: (loading: boolean) => void
): () => void {
  onLoadingChange?.(true);

  // Load from local cache first
  try {
    const cached = localStorage.getItem(MESSAGES_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      }
    }
  } catch {
    // ignore
  }

  const unsubscribe = onSnapshot(
    collection(db, 'messages'),
    (snapshot) => {
      const msgs: FirestoreMessage[] = [];
      snapshot.forEach((docSnap) => {
        msgs.push(docSnap.data() as FirestoreMessage);
      });

      // Sort messages chronologically
      msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      if (msgs.length > 0) {
        try {
          localStorage.setItem(MESSAGES_CACHE_KEY, JSON.stringify(msgs));
        } catch {
          // ignore
        }
        onUpdate(msgs);
      }
      onLoadingChange?.(false);
    },
    (err) => {
      console.warn('[Firestore] Messages subscription offline or error:', err);
      onLoadingChange?.(false);
    }
  );

  return unsubscribe;
}

/**
 * Sends a message and stores it in Firestore collection 'messages'
 */
export async function sendMessageToFirestore(message: {
  senderId: string;
  recipientId: string;
  text: string;
  senderName?: string;
  senderRole?: 'artisan' | 'buyer';
  productTitle?: string;
}): Promise<FirestoreMessage> {
  const newId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timeFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const messageDoc: FirestoreMessage = {
    id: newId,
    senderId: message.senderId,
    recipientId: message.recipientId,
    text: message.text,
    timestamp: new Date().toISOString(),
    senderName: message.senderName || 'Anonymous',
    senderRole: message.senderRole || 'buyer',
    productTitle: message.productTitle || '',
    time: timeFormatted,
  };

  await setDoc(doc(db, 'messages', newId), messageDoc);
  return messageDoc;
}

/**
 * Creates an order in Firestore collection 'orders', sends a notification message to the artisan,
 * and logs to console.
 */
export async function createOrderInFirestore(orderData: {
  orderId: string;
  buyerId: string;
  artisanId: string;
  productId: string;
  amount: number;
  status: 'paid' | 'pending' | 'shipped' | 'delivered';
  createdAt: string;
  paymentMethod: 'demo';
  productTitle?: string;
  productImageUrl?: string;
  artisanName?: string;
  buyerName?: string;
  orderType?: 'purchase' | 'support';
  deliveryEstimate?: string;
  deliveryMode?: 'ship' | 'pickup';
  shippingCost?: number;
  shippingType?: 'standard' | 'express' | 'pickup';
  pickupAddress?: {
    artisanName: string;
    village: string;
    district: string;
    state: string;
    lat?: number;
    lng?: number;
    phone?: string;
  };
  deliveryAddress?: {
    name: string;
    phone: string;
    address: string;
    pincode: string;
  };
}): Promise<MarketplaceOrder> {
  console.log(`[Payment] Order created: ${orderData.orderId}`);

  const orderRecord: MarketplaceOrder = {
    orderId: orderData.orderId,
    buyerId: orderData.buyerId,
    artisanId: orderData.artisanId,
    productId: orderData.productId,
    amount: orderData.amount,
    status: orderData.status || 'paid',
    createdAt: orderData.createdAt || new Date().toISOString(),
    paymentMethod: 'demo',
    productTitle: orderData.productTitle || 'హస్తకళా ఉత్పత్తి (Handicraft)',
    productImageUrl: orderData.productImageUrl || '',
    artisanName: orderData.artisanName || 'శ్రీనివాస్ యాదవ్',
    buyerName: orderData.buyerName || 'కళా ప్రేమికుడు',
    orderType: orderData.orderType || 'purchase',
    deliveryEstimate: orderData.deliveryEstimate || '2-3 business days',
    deliveryMode: orderData.deliveryMode || 'ship',
    shippingCost: orderData.shippingCost ?? (orderData.deliveryMode === 'pickup' ? 0 : 40),
    shippingType: orderData.shippingType || (orderData.deliveryMode === 'pickup' ? 'pickup' : 'standard'),
    pickupAddress: orderData.pickupAddress,
    deliveryAddress: orderData.deliveryAddress,
  };

  try {
    // Write order to Firestore 'orders' collection
    await setDoc(doc(db, 'orders', orderRecord.orderId), orderRecord);

    // Send a Firestore message to the artisan (Part 6)
    let notificationText = `🎉 New support! ${orderRecord.productTitle} — ₹${orderRecord.amount}`;
    if (orderRecord.orderType === 'purchase') {
      if (orderRecord.deliveryMode === 'pickup') {
        notificationText = `📍 New pickup order! ₹${orderRecord.amount} — ${orderRecord.productTitle}. Buyer will visit your location at ${orderRecord.pickupAddress?.village || 'Medchal'}.`;
      } else {
        notificationText = `🛍️ New order! ₹${orderRecord.amount} — ${orderRecord.productTitle}. Buyer will provide shipping address after you confirm.`;
      }
    }

    await sendMessageToFirestore({
      senderId: orderRecord.buyerId,
      recipientId: orderRecord.artisanId,
      text: notificationText,
      senderName: orderRecord.buyerName || 'Buyer',
      senderRole: 'buyer',
      productTitle: orderRecord.productTitle,
    });

    console.log('[Payment] Success — Firestore write complete');
  } catch (err) {
    console.warn('[Firestore] Order creation cloud note (persisting locally):', err);
  }

  // Update local cache for instant zero-latency UI
  try {
    const existing = localStorage.getItem(ORDERS_CACHE_KEY);
    const list: MarketplaceOrder[] = existing ? JSON.parse(existing) : [];
    const updated = [orderRecord, ...list.filter((o) => o.orderId !== orderRecord.orderId)];
    localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return orderRecord;
}

/**
 * Subscribes to real-time orders from Firestore
 */
export function subscribeToOrders(
  onUpdate: (orders: MarketplaceOrder[]) => void,
  onLoadingChange?: (loading: boolean) => void
): () => void {
  onLoadingChange?.(true);

  // Load from local cache first
  try {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        onUpdate(parsed);
      }
    }
  } catch {
    // ignore
  }

  const unsubscribe = onSnapshot(
    collection(db, 'orders'),
    (snapshot) => {
      const orders: MarketplaceOrder[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(docSnap.data() as MarketplaceOrder);
      });

      // Sort descending by creation date
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      if (orders.length > 0) {
        try {
          localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(orders));
        } catch {
          // ignore
        }
        onUpdate(orders);
      }
      onLoadingChange?.(false);
    },
    (err) => {
      console.warn('[Firestore] Orders subscription offline or error:', err);
      onLoadingChange?.(false);
    }
  );

  return unsubscribe;
}

/**
 * Updates order status in Firestore (paid -> shipped -> delivered)
 * and updates local cache
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: 'paid' | 'pending' | 'shipped' | 'delivered'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: newStatus,
    });
    console.log(`[Firestore] Order ${orderId} status updated to ${newStatus}`);
  } catch (err) {
    console.warn('[Firestore] Failed to update order status in cloud:', err);
  }

  // Update local cache for immediate feedback
  try {
    const cached = localStorage.getItem(ORDERS_CACHE_KEY);
    if (cached) {
      const orders: MarketplaceOrder[] = JSON.parse(cached);
      const updated = orders.map((o) =>
        o.orderId === orderId ? { ...o, status: newStatus } : o
      );
      localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
}


