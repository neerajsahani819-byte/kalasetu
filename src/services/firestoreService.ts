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

const MIGRATION_KEY = 'kalasetu_firestore_migrated_v2';
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
    language: 'hi',
    phone: '+91 98123 45678',
    authProvider: 'google',
    isVerified: true,
    joinedDate: '12 जनवरी 2026',
    bio: 'भारतीय पारंपरिक कला और मिट्टी शिल्पों की संरक्षक • Artisan',
  },
  {
    id: 'user-parvati',
    email: 'parvati@kalasetu.org',
    name: 'श्रीमती पार्वती देवी',
    role: 'artisan',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    language: 'hi',
    phone: '+91 98765 43210',
    authProvider: 'email',
    isVerified: true,
    joinedDate: '15 अगस्त 2025',
    bio: 'वरिष्ठ टेराकोटा मूर्तिकार एवं कुम्हार, गोरखपुर, उत्तर प्रदेश (28 वर्ष अनुभव) • Artisan',
  },
  {
    id: 'user-raghav',
    email: 'raghav.sharma@gmail.com',
    name: 'राघवेंद्र शर्मा (Raghav)',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    language: 'hi',
    phone: '+91 94567 89012',
    authProvider: 'email',
    isVerified: true,
    joinedDate: '3 फरवरी 2026',
    bio: 'स्वदेशी हस्तशिल्प और खादी वस्त्रों के नियमित संरक्षक • Buyer',
  },
];

/**
 * Guarantees that the multi-user demo accounts exist in Firestore 'users' collection
 * with their exact required roles:
 * - vaishukalkuda@gmail.com (role: artisan)
 * - parvati@kalasetu.org (role: artisan)
 * - raghav.sharma@gmail.com (role: buyer)
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
 * (groups by title + imageUrl per artisan, keeps the oldest).
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

  console.log(`[Cleanup] Deleted ${deletedCount} duplicate products`);
  return deletedCount;
}

/**
 * Migrates localStorage data (products, users, messages) to Firestore collections
 * with the exact required schema:
 * - users (id, email, name, role, avatar, language)
 * - products (id, artisanId, title, description, price, imageUrl, createdAt)
 * - messages (id, senderId, recipientId, text, timestamp)
 */
export async function runFirestoreMigration(): Promise<void> {
  // Always guarantee demo accounts exist in Firestore
  ensureDemoUsersInFirestore().catch(() => {});
  // Run duplicate cleanup
  cleanupDuplicateProducts().catch(() => {});

  try {
    const alreadyMigrated = localStorage.getItem(MIGRATION_KEY);
    if (alreadyMigrated === 'true') {
      return;
    }

    console.log('[Firestore] Running data migration to Firestore...');

    // 1. Migrate Products
    const productsSnap = await getDocs(collection(db, 'products')).catch(() => null);
    if (!productsSnap || productsSnap.empty) {
      console.log('[Firestore] Seeding products collection with initial catalog...');
      const productBatch = writeBatch(db);
      const existingTitles = new Set<string>();

      for (const p of mockCraftProducts) {
        const artisanId = p.artisanId || 'artisan-demo-01';
        const titleKey = `${artisanId}_${(p.title || '').trim().toLowerCase()}`;

        // Check if product with same title already exists for that artisan
        if (existingTitles.has(titleKey)) {
          continue;
        }
        existingTitles.add(titleKey);

        // Generate deterministic document ID based on hash of title + artisanId
        let hash = 0;
        for (let i = 0; i < titleKey.length; i++) {
          hash = (hash << 5) - hash + titleKey.charCodeAt(i);
          hash |= 0;
        }
        const docId = p.id || `prod_${artisanId.slice(0, 10)}_${Math.abs(hash)}`;

        const productDoc = {
          id: docId,
          artisanId: artisanId,
          title: p.title,
          description: p.description,
          price: p.suggestedPrice || 0,
          imageUrl: p.images?.[0] || '',
          createdAt: p.createdAt || new Date().toISOString(),
          // Retain full properties so existing UI components remain 100% compatible
          suggestedPrice: p.suggestedPrice || 0,
          titleEnglish: p.titleEnglish || p.title,
          category: p.category,
          categoryEnglish: p.categoryEnglish || p.category,
          descriptionEnglish: p.descriptionEnglish || p.description,
          craftHours: p.craftHours || 10,
          materials: p.materials || '',
          materialsEnglish: p.materialsEnglish || '',
          artisanCut: p.artisanCut || Math.round((p.suggestedPrice || 0) * 0.85),
          packagingCut: p.packagingCut || 0,
          status: p.status || 'live',
          images: p.images || [],
          artisanName: p.artisanName || 'पार्वती देवी',
          artisanAvatar: p.artisanAvatar || '',
          artisanRegion: p.artisanRegion || 'उत्तर प्रदेश',
          artisanExperience: p.artisanExperience || '20 वर्ष',
          giTag: p.giTag !== false,
          giTagName: p.giTagName || 'हस्तशिल्प प्रमाणन',
          isVerified: p.isVerified !== false,
          viewsCount: p.viewsCount || 1,
          isFairTrade: p.isFairTrade !== false,
          audioStoryUrl: p.audioStoryUrl || '',
          audioDuration: p.audioDuration || '0:35',
        };
        productBatch.set(doc(db, 'products', docId), productDoc, { merge: true });
      }
      await productBatch.commit();
      console.log(`[Firestore] Seeded ${mockCraftProducts.length} products successfully!`);
    }

    // 2. Migrate Users
    const usersSnap = await getDocs(collection(db, 'users')).catch(() => null);
    if (!usersSnap || usersSnap.empty) {
      console.log('[Firestore] Seeding users collection with default accounts...');
      const userBatch = writeBatch(db);
      const localUsers = getRegisteredUsers();
      for (const u of localUsers) {
        const userDoc: FirestoreUser = {
          id: u.id,
          email: u.email || `${u.id}@kalasetu.org`,
          name: u.name,
          role: u.role,
          avatar: u.avatarUrl || u.avatar || '',
          language: u.language || 'hi',
          phone: u.phone || '',
          authProvider: u.authProvider,
          isVerified: u.isVerified,
          joinedDate: u.joinedDate,
          bio: u.bio,
        };
        userBatch.set(doc(db, 'users', u.id), userDoc, { merge: true });
      }
      await userBatch.commit();
      console.log(`[Firestore] Seeded ${localUsers.length} users successfully!`);
    }

    // 3. Migrate initial Messages
    const messagesSnap = await getDocs(collection(db, 'messages')).catch(() => null);
    if (!messagesSnap || messagesSnap.empty) {
      console.log('[Firestore] Seeding initial messages collection...');
      const msgBatch = writeBatch(db);
      const initialMessages: FirestoreMessage[] = [
        {
          id: 'msg-welcome-1',
          senderId: 'user-parvati',
          recipientId: 'buyer-all',
          text: 'नमस्ते! मैं पार्वती देवी हूँ। क्या आप हमारे पारंपरिक हस्तशिल्प और माटी कला के बारे में कुछ जानना चाहते हैं?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          senderName: 'पार्वती देवी',
          senderRole: 'artisan',
          productTitle: 'हस्तनिर्मित नक्काशीदार सुराही',
          time: '10:14 AM',
        },
      ];
      for (const m of initialMessages) {
        msgBatch.set(doc(db, 'messages', m.id), m, { merge: true });
      }
      await msgBatch.commit();
      console.log('[Firestore] Seeded initial messages successfully!');
    }

    // 4. Seed initial Orders if empty
    const ordersSnap = await getDocs(collection(db, 'orders')).catch(() => null);
    if (!ordersSnap || ordersSnap.empty) {
      console.log('[Firestore] Seeding initial demo orders collection...');
      const orderBatch = writeBatch(db);
      const initialOrders: MarketplaceOrder[] = [
        {
          orderId: 'ORD-9821-KALA',
          buyerId: 'user-rohit',
          buyerName: 'रोहित वर्मा (Buyer)',
          artisanId: 'user-parvati',
          artisanName: 'पार्वती देवी',
          productId: 'craft-1',
          productTitle: 'हस्तनिर्मित नक्काशीदार सुराही',
          productImageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
          amount: 850,
          status: 'paid',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          paymentMethod: 'demo',
          orderType: 'purchase',
          deliveryEstimate: '3-5 business days',
        },
      ];
      for (const ord of initialOrders) {
        orderBatch.set(doc(db, 'orders', ord.orderId), ord, { merge: true });
      }
      await orderBatch.commit();
      console.log('[Firestore] Seeded initial orders successfully!');
    }

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
    giTag: finalProduct.giTag !== false,
    giTagName: finalProduct.giTagName,
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
  status: 'paid' | 'pending' | 'delivered';
  createdAt: string;
  paymentMethod: 'demo';
  productTitle?: string;
  productImageUrl?: string;
  artisanName?: string;
  buyerName?: string;
  orderType?: 'purchase' | 'support';
  deliveryEstimate?: string;
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
    productTitle: orderData.productTitle || 'हस्तशिल्प उत्पाद (Handicraft)',
    productImageUrl: orderData.productImageUrl || '',
    artisanName: orderData.artisanName || 'पार्वती देवी',
    buyerName: orderData.buyerName || 'कला साधक',
    orderType: orderData.orderType || 'purchase',
    deliveryEstimate: orderData.deliveryEstimate || '3-5 business days',
  };

  try {
    // Write order to Firestore 'orders' collection
    await setDoc(doc(db, 'orders', orderRecord.orderId), orderRecord);

    // Send a Firestore message to the artisan
    const notificationText =
      orderRecord.orderType === 'support'
        ? `🎉 New support! ${orderRecord.productTitle} — ₹${orderRecord.amount}`
        : `🎉 New order! ${orderRecord.productTitle} — ₹${orderRecord.amount}`;

    await sendMessageToFirestore({
      senderId: orderRecord.buyerId,
      recipientId: orderRecord.artisanId,
      text: notificationText,
      senderName: orderRecord.buyerName || 'कला साधक (Buyer)',
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


