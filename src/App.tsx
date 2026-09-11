import React, { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { RoleSelectionScreen } from './components/RoleSelectionScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AddProductScreen } from './components/AddProductScreen';
import { AiListingPreviewScreen } from './components/AiListingPreviewScreen';
import { MyShopScreen } from './components/MyShopScreen';
import { BuyerMarketplaceScreen } from './components/BuyerMarketplaceScreen';
import { ArtisanProfileScreen } from './components/ArtisanProfileScreen';
import { OfflineBanner } from './components/OfflineBanner';
import { BottomNav, ScreenTab } from './components/BottomNav';
import { ChatModal } from './components/ChatModal';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { mockCraftProducts, mockArtisanProfile } from './data/mockData';
import { CraftProduct, ArtisanProfileData, UserRole, AuthUser } from './types';
import { speakAloud } from './utils/audioService';
import { useLanguage, getSpeechLangCode } from './i18n/LanguageContext';
import {
  runFirestoreMigration,
  subscribeToProducts,
  createProductInFirestore,
  saveUserToFirestore,
} from './services/firestoreService';
import { saveUserRoleToFirestore, getActiveUserSession } from './utils/authService';

export default function App() {
  const { language: selectedLanguage, setLanguage: setSelectedLanguage, t } = useLanguage();

  // Requirement 3: Primary Auth State Machine
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<'artisan' | 'buyer' | null>(null);

  const [currentTab, setCurrentTab] = useState<ScreenTab>('onboarding');
  const [userRole, setUserRole] = useState<UserRole>('artisan');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [products, setProducts] = useState<CraftProduct[]>(mockCraftProducts);
  const [isProductsLoading, setIsProductsLoading] = useState<boolean>(true);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getActiveUserSession());

  const [currentArtisan, setCurrentArtisan] = useState<ArtisanProfileData>(() => ({
    ...mockArtisanProfile,
    avatarUrl:
      currentUser?.role === 'artisan' && currentUser?.avatarUrl
        ? currentUser.avatarUrl
        : mockArtisanProfile.avatarUrl,
    name:
      currentUser?.role === 'artisan' && currentUser?.name
        ? currentUser.name
        : mockArtisanProfile.name,
  }));

  // Requirement 3 & 8: Auth listener with Firestore role resolution & console logs
  useEffect(() => {
    console.log('[Auth] Loading auth state...');
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        let userRole: 'artisan' | 'buyer' | null = null;
        let displayName = u.displayName || u.email?.split('@')[0] || 'User';
        let avatarUrl = u.photoURL || '';

        try {
          // Read role from Firestore users/{u.uid}
          const userDoc = await getDoc(doc(db, 'users', u.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data?.role === 'artisan' || data?.role === 'buyer') {
              userRole = data.role;
            }
            if (data?.displayName || data?.name) {
              displayName = data.displayName || data.name;
            }
            if (data?.avatar || data?.avatarUrl) {
              avatarUrl = data.avatar || data.avatarUrl;
            }
          }
        } catch (err) {
          console.warn('[Auth] Firestore user read error:', err);
        }

        // Fallback to active local session if available
        if (!userRole) {
          const localSession = getActiveUserSession();
          if (localSession?.role) {
            userRole = localSession.role;
          }
        }

        setRole(userRole);
        if (userRole) {
          setUserRole(userRole);
          console.log(`[Auth] Session restored: ${u.email || u.uid} role: ${userRole}`);
          setCurrentTab(userRole === 'artisan' ? 'my-shop' : 'marketplace');
        } else {
          console.log(`[Auth] Session restored: ${u.email || u.uid} (no role yet)`);
        }

        const authUserObj: AuthUser = {
          id: u.uid,
          name: displayName,
          email: u.email || '',
          avatarUrl:
            avatarUrl ||
            (userRole === 'buyer'
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'),
          role: userRole || 'artisan',
          authProvider: 'google',
          isVerified: true,
          joinedDate: new Date().toLocaleDateString('en-IN'),
        };
        setCurrentUser(authUserObj);

        if (authUserObj.role === 'artisan') {
          setCurrentArtisan((prev) => ({
            ...prev,
            name: authUserObj.name || prev.name,
            avatarUrl: authUserObj.avatarUrl,
          }));
        }
      } else {
        console.log('[Auth] No session — showing login');
        setRole(null);
        // If local user is not signed in
        const local = getActiveUserSession();
        if (!local) {
          setCurrentUser(null);
        } else {
          // Local demo session active
          setRole(local.role);
          setUserRole(local.role);
          setCurrentTab(local.role === 'artisan' ? 'my-shop' : 'marketplace');
        }
      }

      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update user profile in state and Firestore
  const handleUpdateUser = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('kalasetu_auth_user', JSON.stringify(updatedUser));
    } catch {
      // ignore
    }
    saveUserToFirestore(updatedUser).catch((err) => {
      console.warn('[Firestore] User profile sync warning:', err);
    });

    if (updatedUser.role === 'artisan') {
      setCurrentArtisan((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        avatarUrl: updatedUser.avatarUrl,
      }));
    }
  };

  const handleUpdateArtisanAvatar = (newAvatarUrl: string) => {
    setCurrentArtisan((prev) => ({
      ...prev,
      avatarUrl: newAvatarUrl,
    }));
    if (currentUser) {
      const updated = { ...currentUser, avatarUrl: newAvatarUrl };
      setCurrentUser(updated);
      try {
        localStorage.setItem('kalasetu_auth_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      saveUserToFirestore(updated).catch((err) => {
        console.warn('[Firestore] User avatar sync warning:', err);
      });
    }
  };

  // Requirement 2 & 7: Login Success handler
  const handleLoginSuccess = (authUser: AuthUser) => {
    setCurrentUser(authUser);
    setRole(authUser.role);
    setUserRole(authUser.role);

    try {
      localStorage.setItem('kalasetu_auth_user', JSON.stringify(authUser));
      localStorage.setItem('kalasetu_user_role', authUser.role);
    } catch {
      // ignore
    }

    saveUserToFirestore(authUser).catch((err) => {
      console.warn('[Firestore] Login user sync warning:', err);
    });

    if (authUser.role === 'artisan') {
      setCurrentArtisan((prev) => ({
        ...prev,
        name: authUser.name || prev.name,
        avatarUrl: authUser.avatarUrl,
      }));
      setCurrentTab('my-shop');
    } else {
      setCurrentTab('marketplace');
    }
    setIsAuthModalOpen(false);
  };

  // Requirement 5: Post-Google Role Selection Handler
  const handleRoleSelected = async (selectedRole: UserRole) => {
    const uid = user?.uid || currentUser?.id;
    if (uid) {
      await saveUserRoleToFirestore(uid, selectedRole, user?.email || currentUser?.email);
    }
    setRole(selectedRole);
    setUserRole(selectedRole);

    if (currentUser) {
      const updated = { ...currentUser, role: selectedRole };
      setCurrentUser(updated);
      try {
        localStorage.setItem('kalasetu_auth_user', JSON.stringify(updated));
        localStorage.setItem('kalasetu_user_role', selectedRole);
      } catch {
        // ignore
      }
    }

    if (selectedRole === 'artisan') {
      setCurrentTab('my-shop');
    } else {
      setCurrentTab('marketplace');
    }
  };

  // Requirement 6 & 8: Logout handler with console logging
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('[Auth] Sign out error note:', e);
    }
    console.log('[Auth] Logout');

    setUser(null);
    setRole(null);
    setCurrentUser(null);

    try {
      localStorage.removeItem('kalasetu_auth_user');
      localStorage.removeItem('kalasetu_user_role');
    } catch {
      // ignore
    }

    const speechCode = getSpeechLangCode(selectedLanguage);
    speakAloud('सफलतापूर्वक लॉग आउट हो गया • Logged out successfully', { lang: speechCode });
  };

  // Product Draft for AI preview
  const [previewProductData, setPreviewProductData] = useState<{
    photoUrl: string;
    title: string;
    category: string;
    description: string;
    hours: number;
    materials: string;
    price: number;
    voiceTranscript?: string;
  }>({
    photoUrl:
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    title: 'हस्तनिर्मित नक्काशीदार सुराही',
    category: 'मिट्टी शिल्प',
    description: 'प्राकृतिक दोमट मिट्टी से पारंपरिक चाक पर गढ़ी गई शीतल जल सुराही।',
    hours: 14,
    materials: 'प्राकृतिक दोमट माटी व कबीज रंग',
    price: 850,
    voiceTranscript: '',
  });

  // Chat modal state
  const [chatModal, setChatModal] = useState<{
    isOpen: boolean;
    artisanName: string;
    productTitle: string;
  }>({
    isOpen: false,
    artisanName: 'पार्वती देवी',
    productTitle: 'हस्तनिर्मित सुराही जल पात्र',
  });

  // Checkout modal state
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    product: CraftProduct | null;
    mode: 'buy' | 'support';
  }>({
    isOpen: false,
    product: null,
    mode: 'buy',
  });
  const [artisanProfileTab, setArtisanProfileTab] = useState<'profile' | 'orders'>('profile');

  const handleOpenBuyCheckout = (product: CraftProduct) => {
    setCheckoutModal({
      isOpen: true,
      product,
      mode: 'buy',
    });
  };

  const handleOpenSupportCheckout = (product: CraftProduct) => {
    setCheckoutModal({
      isOpen: true,
      product,
      mode: 'support',
    });
  };

  const handleOpenOrdersView = () => {
    setArtisanProfileTab('orders');
    setCurrentTab('artisan-profile');
  };

  // Real-time Firestore Products Sync
  useEffect(() => {
    runFirestoreMigration();

    const unsubProducts = subscribeToProducts(
      (loadedProducts) => {
        if (loadedProducts.length > 0) {
          setProducts(loadedProducts);
        }
        setIsProductsLoading(false);
      },
      (loadingState) => {
        setIsProductsLoading(loadingState);
      }
    );

    return () => unsubProducts();
  }, []);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      const speechCode = getSpeechLangCode(selectedLanguage);
      speakAloud(next ? t('common.offlineNotice') : t('common.onlineNotice'), { lang: speechCode });
      return next;
    });
  };

  const handleToggleRole = (forcedRole?: UserRole) => {
    const nextRole: UserRole = forcedRole || (userRole === 'artisan' ? 'buyer' : 'artisan');
    setUserRole(nextRole);
    setRole(nextRole);
    try {
      localStorage.setItem('kalasetu_user_role', nextRole);
    } catch {
      // ignore
    }

    if (currentUser) {
      const updatedUser: AuthUser = { ...currentUser, role: nextRole };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('kalasetu_auth_user', JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
      saveUserToFirestore(updatedUser).catch((err) => {
        console.warn('[Firestore] Role toggle sync warning:', err);
      });
    }

    const speechCode = getSpeechLangCode(selectedLanguage);
    if (nextRole === 'artisan') {
      speakAloud(t('screens.auth.artisanRoleTitle'), { lang: speechCode });
      setCurrentTab('my-shop');
    } else {
      speakAloud(t('screens.auth.buyerRoleTitle'), { lang: speechCode });
      setCurrentTab('marketplace');
    }
  };

  const handleSelectLanguage = (langId: string) => {
    setSelectedLanguage(langId);
  };

  const handleCompleteOnboarding = (selectedR: UserRole, language: string) => {
    setSelectedLanguage(language);
    setUserRole(selectedR);
    setRole(selectedR);
    if (selectedR === 'artisan') {
      setCurrentTab('my-shop');
    } else {
      setCurrentTab('marketplace');
    }
  };

  const handleProceedToPreview = (data: {
    photoUrl: string;
    title: string;
    category: string;
    description: string;
    hours: number;
    materials: string;
    price: number;
    voiceTranscript?: string;
  }) => {
    setPreviewProductData(data);
    setCurrentTab('ai-preview');
  };

  const handlePublishToShop = () => {
    const price = previewProductData.price;
    const artisanCut = Math.round(price * 0.85);
    const packagingCut = price - artisanCut;

    const newProduct: CraftProduct = {
      id: `craft-${Date.now()}`,
      title: previewProductData.title,
      titleEnglish: previewProductData.title,
      category: previewProductData.category,
      categoryEnglish: previewProductData.category,
      suggestedPrice: price,
      artisanCut,
      packagingCut,
      status: 'live',
      viewsCount: 1,
      giTag: true,
      giTagName: 'हस्तशिल्प प्रमाणन',
      craftHours: previewProductData.hours,
      materials: previewProductData.materials,
      materialsEnglish: previewProductData.materials,
      images: [previewProductData.photoUrl],
      description: previewProductData.description,
      descriptionEnglish: previewProductData.description,
      voiceTranscript: previewProductData.voiceTranscript || '',
      audioStoryUrl: '',
      audioDuration: '0:35',
      artisanId: currentArtisan.id,
      artisanName: currentArtisan.name,
      artisanAvatar: currentArtisan.avatarUrl,
      artisanRegion: currentArtisan.region,
      artisanExperience: `${currentArtisan.experienceYears} वर्ष`,
      isVerified: true,
      isFairTrade: true,
    };

    setProducts([newProduct, ...products]);
    setCurrentTab('my-shop');

    createProductInFirestore(newProduct).catch((err) => {
      console.warn('[Firestore] Product upload note:', err);
    });
  };

  // =========================================================================
  // REQUIREMENT 3 RENDER LOGIC
  // =========================================================================

  // 1. If loading -> <SplashScreen />
  if (loading) {
    return <SplashScreen />;
  }

  // 2. If !user and !currentUser -> <AuthScreen />
  const activeSessionUser = user || currentUser;
  if (!activeSessionUser) {
    return (
      <>
        <AuthScreen
          onLoginSuccess={handleLoginSuccess}
          language={selectedLanguage}
          onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
          initialRole={userRole}
        />
        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          onClose={() => setIsLanguageModalOpen(false)}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
        />
      </>
    );
  }

  // 3. If user && !role -> <RoleSelectionScreen />
  if (!role && !currentUser?.role) {
    return (
      <RoleSelectionScreen
        displayName={user?.displayName || currentUser?.name || user?.email?.split('@')[0]}
        onSelectRole={handleRoleSelected}
        language={selectedLanguage}
      />
    );
  }

  // 4. Authenticated with role -> Main Application Screens
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] font-sans selection:bg-[#9C3D25]/20 selection:text-[#9C3D25]">
      {/* App-wide Offline Banner */}
      <OfflineBanner
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        language={selectedLanguage}
      />

      {/* Screen Render Switch */}
      {currentTab === 'onboarding' && (
        <OnboardingScreen
          selectedLanguage={selectedLanguage}
          onSelectLanguage={handleSelectLanguage}
          selectedRole={userRole}
          onSelectRole={(r) => setUserRole(r)}
          onComplete={handleCompleteOnboarding}
          isOffline={isOffline}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentTab === 'my-shop' && (
        <MyShopScreen
          products={products}
          isLoading={isProductsLoading}
          onNavigateToAddProduct={() => setCurrentTab('add-product')}
          onOpenProductPreview={(prod) => {
            setPreviewProductData({
              photoUrl: prod.images[0],
              title: prod.title,
              category: prod.category,
              description: prod.description,
              hours: prod.craftHours,
              materials: prod.materials,
              price: prod.suggestedPrice,
            });
            setCurrentTab('ai-preview');
          }}
          onOpenArtisanProfile={() => setCurrentTab('artisan-profile')}
          language={selectedLanguage}
          currentRole={userRole}
          onToggleRole={handleToggleRole}
          onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentTab === 'add-product' && (
        <AddProductScreen
          onBack={() => setCurrentTab('my-shop')}
          onProceedToPreview={handleProceedToPreview}
          isOffline={isOffline}
          language={selectedLanguage}
        />
      )}

      {currentTab === 'ai-preview' && (
        <AiListingPreviewScreen
          productData={previewProductData}
          onBack={() => setCurrentTab('add-product')}
          onPublishToShop={handlePublishToShop}
          onSaveDraft={() => setCurrentTab('my-shop')}
          language={selectedLanguage}
        />
      )}

      {currentTab === 'marketplace' && (
        <BuyerMarketplaceScreen
          products={products}
          isLoading={isProductsLoading}
          onOpenArtisanProfile={() => {
            setArtisanProfileTab('profile');
            setCurrentTab('artisan-profile');
          }}
          onOpenProductDetail={(item) => {
            setPreviewProductData({
              photoUrl: item.images[0],
              title: item.title,
              category: item.category,
              description: item.description,
              hours: item.craftHours,
              materials: item.materials,
              price: item.suggestedPrice,
            });
            setCurrentTab('ai-preview');
          }}
          onOpenChatWithArtisan={(artisanName, productTitle) => {
            setChatModal({
              isOpen: true,
              artisanName,
              productTitle,
            });
          }}
          onWhatsAppOrder={(artisanName, productTitle) => {
            const speechCode = getSpeechLangCode(selectedLanguage);
            speakAloud(`Opening WhatsApp for ${artisanName}`, { lang: speechCode });
            const msg = encodeURIComponent(
              `नमस्ते ${artisanName} जी, मुझे आपकी '${productTitle}' बहुत पसंद आई। मैं इसे खरीदना चाहता/चाहती हूँ।`
            );
            window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
          }}
          onBuyProduct={handleOpenBuyCheckout}
          onSupportArtisan={handleOpenSupportCheckout}
          onOpenOrders={handleOpenOrdersView}
          language={selectedLanguage}
          currentRole={userRole}
          onToggleRole={handleToggleRole}
          onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {currentTab === 'artisan-profile' && (
        <ArtisanProfileScreen
          artisanId={currentArtisan.id}
          onBack={() => setCurrentTab(userRole === 'artisan' ? 'my-shop' : 'marketplace')}
          onSelectProduct={(product) => {
            setPreviewProductData({
              photoUrl: product.images[0],
              title: product.title,
              category: product.category,
              description: product.description,
              hours: product.craftHours,
              materials: product.materials,
              price: product.suggestedPrice,
            });
            setCurrentTab('ai-preview');
          }}
          onBuyProduct={handleOpenBuyCheckout}
          onSupportArtisan={handleOpenSupportCheckout}
          initialTab={artisanProfileTab}
          onDirectCall={(phone) => {
            const speechCode = getSpeechLangCode(selectedLanguage);
            speakAloud(`Calling ${currentArtisan.name}`, { lang: speechCode });
            window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
          }}
          onWhatsAppOrder={(artisanName) => {
            const speechCode = getSpeechLangCode(selectedLanguage);
            speakAloud(`WhatsApp Chat: ${artisanName}`, { lang: speechCode });
            const msg = encodeURIComponent(
              `नमस्ते ${artisanName} जी, मुझे आपकी हस्तनिर्मित कृतियां बहुत पसंद आईं।`
            );
            window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
          }}
          language={selectedLanguage}
          currentUser={currentUser}
          currentRole={userRole}
          onToggleRole={handleToggleRole}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onUpdateAvatar={handleUpdateArtisanAvatar}
        />
      )}

      {/* Global Bottom Navigation (shown on all screens except initial onboarding) */}
      {currentTab !== 'onboarding' && (
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          isOffline={isOffline}
          onToggleOffline={handleToggleOffline}
          language={selectedLanguage}
          userRole={userRole}
          onToggleRole={() => handleToggleRole()}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        currentUser={currentUser}
        language={selectedLanguage}
        currentRole={userRole}
        onUpdateUser={handleUpdateUser}
      />

      {/* Chat with Artisan Modal */}
      <ChatModal
        isOpen={chatModal.isOpen}
        onClose={() => setChatModal((prev) => ({ ...prev, isOpen: false }))}
        artisanName={chatModal.artisanName}
        productTitle={chatModal.productTitle}
        language={selectedLanguage}
        currentUser={currentUser}
      />

      {/* Checkout & Direct Fair Trade Modal */}
      <CheckoutModal
        isOpen={checkoutModal.isOpen}
        onClose={() => setCheckoutModal((prev) => ({ ...prev, isOpen: false }))}
        product={checkoutModal.product}
        mode={checkoutModal.mode}
        currentUser={currentUser}
        language={selectedLanguage}
        onViewOrders={() => {
          setArtisanProfileTab('orders');
          setCurrentTab('artisan-profile');
        }}
        onBackToMarketplace={() => {
          setCurrentTab('marketplace');
        }}
      />

      {/* Global Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </div>
  );
}
