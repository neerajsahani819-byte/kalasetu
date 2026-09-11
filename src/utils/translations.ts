// Comprehensive Localization Dictionary for KalaSetu
// Ensures: "When user chooses a language, all the interface displays in that language and English, not any other"

export type SupportedLanguage =
  | 'hi'
  | 'te'
  | 'gondi'
  | 'lambadi'
  | 'bn'
  | 'ta'
  | 'or'
  | 'mr'
  | 'en';

export interface TranslationStrings {
  // Navigation & General
  appName: string;
  artisanMode: string;
  buyerMode: string;
  sellerRoleLabel: string;
  buyerRoleLabel: string;
  switchMode: string;
  listen: string;
  offlineBanner: string;
  offlineRetry: string;
  onlineNotice: string;
  firestoreOnlineNotice: string;
  firestoreSyncSubtext: string;
  stepOf: string;
  back: string;
  continueBtn: string;
  close: string;

  // Bottom Navigation
  navMyShop: string;
  navMarketplace: string;
  navAddProduct: string;
  navProfile: string;
  navOffline: string;
  navOnline: string;

  // Onboarding
  welcome?: string;
  welcomeTitle: string;
  voiceFirstTitle: string;
  voiceFirstSub: string;
  chooseLanguageTitle: string;
  chooseRoleTitle: string;
  roleArtisanTitle: string;
  roleArtisanDesc: string;
  roleBuyerTitle: string;
  roleBuyerDesc: string;
  onboardingContinue: string;

  // Add Product
  addProductTitle: string;
  stepIndicator: string;
  stepSub: string;
  simulateErrorLabel: string;
  simulateErrorSub: string;
  simulateErrorActive: string;
  simulateErrorTrigger: string;
  photosHeading: string;
  photosCount1: string;
  photosCount2: string;
  mainPhotoTag: string;
  secondPhotoTag: string;
  secondPhotoDesc: string;
  addPhotoBtn: string;
  optimizingPhoto: string;
  photoOptimizedBadge: string;
  voiceGuideTitle: string;
  q1Name: string;
  q1Sub: string;
  q2Hours: string;
  q2Sub: string;
  q3Material: string;
  q3Sub: string;
  speakDetailsTitle: string;
  speakDetailsSub: string;
  recordedPill: string;
  retryErrorTitle: string;
  retryErrorDesc: string;
  retryVoiceBtn: string;
  generateListingBtn: string;
  generateListingSub: string;

  // AI Listing Preview
  listingPreviewTitle: string;
  aiCraftedPill: string;
  listenFullDetails: string;
  listenLanguageSub: string;
  giVerified: string;
  anglesVerified: string;
  hoursLabor: string;
  materialsBadge: string;
  suggestedPriceTitle: string;
  marketRateSub: string;
  directArtisanIncome: string;
  packagingCut: string;
  speakToChangeTitle: string;
  speakToChangeSub: string;
  publishToShopBtn: string;
  saveDraftBtn: string;
  shareBtn: string;

  // My Shop
  myShopTitle: string;
  namasteArtisan: string;
  verifiedArtisanBadge: string;
  audioGuideShop: string;
  emptyShopToggle: string;
  activeShopToggle: string;
  activeStats: string;
  totalSalesStats: string;
  queriesStats: string;
  myProductsTitle: string;
  orderPendingBadge: string;
  startPackingBtn: string;
  emptyShopHeading: string;
  emptyShopMessage: string;
  micAddFirstItem: string;
  micJustSpeak: string;
  threeStepsTitle: string;
  step1PhotoTitle: string;
  step1PhotoSub: string;
  step2VoiceTitle: string;
  step2VoiceSub: string;
  step3LiveTitle: string;
  step3LiveSub: string;
  helpCenterTitle: string;
  freeTag: string;
  listenAudioInstructions: string;
  listenAudioInstructionsSub: string;
  callShilpMitra: string;
  callShilpMitraSub: string;
  newProductMicPrompt: string;
  newProductMicSub: string;
  needHelpPrompt: string;
  needHelpSub: string;

  // Buyer Marketplace
  marketplaceTitle: string;
  searchPlaceholder: string;
  filterAll: string;
  filterGi: string;
  filterPottery: string;
  filterMetal: string;
  filterTextile: string;
  fairTradeBannerTitle: string;
  fairTradeBannerSub: string;
  artisanFeedHeading: string;
  resultsCount: string;
  listenCraftStory: string;
  freeShipping: string;
  chatWithArtisan: string;
  whatsAppOrder: string;
  audioTourTitle: string;
  audioTourSub: string;
  audioTourPrompt: string;
  listenFullAudioStory: string;

  // Artisan Profile
  profileHeading: string;
  supportBtn: string;
  supportedBtn: string;
  experienceBadge: string;
  generationBadge: string;
  hearArtisanStoryTitle: string;
  traditionTitle: string;
  handcraftedWorksTitle: string;
  directFromHomeSub: string;
  itemsAvailable: string;
  buyBtn: string;
  directConnectHeading: string;
  zeroMiddlemenGuarantee: string;
  kilnSupportTitle: string;
  kilnSupportSub: string;
  kilnSupportBtn: string;
  kilnSupportDone: string;
  directCallBtn: string;
  whatsAppCraftOrderBtn: string;
  guaranteeText: string;

  // Chat
  chatHeaderTitle: string;
  chatSubText: string;
  chatTrustNotice: string;
  chatInputPlaceholder: string;

  // Additional component aliases for dual-language views
  replacePhoto?: string;
  secondPhotoBadge?: string;
  addPhotoSlot?: string;
  voiceDetailsTitle?: string;
  promptWhatMade?: string;
  promptHowLong?: string;
  promptMaterials?: string;
  recordedVoice?: string;
  rerecordPrompt?: string;
  retryTitle?: string;
  retryMessage?: string;
  retryBtn?: string;
  generateAiListing?: string;
  artisanIncomeLabel?: string;
  craftHoursPrompt?: string;
  voiceEditPrompt?: string;
  aiPreviewTitle?: string;
  aiCraftedBadge?: string;
  listenDialectNotice?: string;
  giTagBadge?: string;
  editTitle?: string;
  suggestedPriceLabel?: string;
  packagingLogisticsLabel?: string;
  voiceEditBtn?: string;
  publishSuccessNotice?: string;
  craftYearsExperience?: string;
  artisanProfileTitle?: string;
  supportReceived?: string;
  listenArtisanStory?: string;
  artisanArtworksTitle?: string;
  productsCountSuffix?: string;
  buyProductBtn?: string;
  directConnectTitle?: string;
  zeroCommissionBadge?: string;
  whatsappOrder?: string;
  craftArtworksTitle?: string;
  listenStoryBtn?: string;
  freeShippingBadge?: string;
  audioTourListen?: string;
  closeModal?: string;
  step1Of2?: string;
  photosLabel?: string;
  compressingImage?: string;
  photoAddedCompressed?: string;
  voiceRecordedNotice?: string;
  simulateErrorBtn?: string;
  photoCompressed?: string;
  mainPhotoBadge?: string;

  // Authentication & Login
  loginTitle?: string;
  loginSubtitle?: string;
  loginWithPhone?: string;
  loginWithEmail?: string;
  loginWithGoogle?: string;
  phoneLabel?: string;
  phonePlaceholder?: string;
  invalidPhoneError?: string;
  sendOtp?: string;
  enterOtp?: string;
  otpPlaceholder?: string;
  resendOtp?: string;
  verifyAndLogin?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  invalidEmailError?: string;
  passwordLabel?: string;
  passwordPlaceholder?: string;
  invalidPasswordError?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  continueWithGoogle?: string;
  logout?: string;
  loggedInAs?: string;
  guestMode?: string;
  switchAccount?: string;
  googleAccountDialogTitle?: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationStrings> = {
  // 1. Hindi
  hi: {
    appName: 'कलासेतु • KalaSetu',
    artisanMode: 'कारीगर (विक्रेता) • Seller',
    buyerMode: 'कला प्रेमी (खरीदार) • Buyer',
    sellerRoleLabel: 'कारीगर • Seller',
    buyerRoleLabel: 'खरीदार • Buyer',
    switchMode: 'भूमिका बदलें • Switch Role',
    listen: 'सुनें • Listen',
    offlineBanner: 'इंटरनेट बंद है • ऑफ़लाइन मोड • फ़ायरस्टोर कैश सक्रिय (पुनः कनेक्ट होने पर स्वतः सिंक)',
    offlineRetry: 'जांचें • Check',
    onlineNotice: 'ऑनलाइन मोड सक्रिय • Online',
    firestoreOnlineNotice: 'क्लाउड फायरस्टोर सक्रिय • डेटा सुरक्षित रूप से सिंक हो रहा है',
    firestoreSyncSubtext: 'फ़ायरस्टोर डेटाबेस: ai-studio-kalasetu • रीयल-टाइम क्लाउड सिंक',
    stepOf: 'चरण • Step',
    back: 'पीछे जाएं • Back',
    continueBtn: 'आगे बढ़ें • Continue',
    close: 'बंद करें • Close',

    navMyShop: 'मेरी दुकान • My Shop',
    navMarketplace: 'बाज़ार • Marketplace',
    navAddProduct: 'सामान जोड़ें • Add Item',
    navProfile: 'कारीगर • Profile',
    navOffline: 'ऑफ़लाइन • Offline',
    navOnline: 'ऑनलाइन • Online',

    welcome: 'कलासेतु में आपका स्वागत है',
    welcomeTitle: 'कलासेतु में आपका स्वागत है',
    voiceFirstTitle: 'बोलकर काम करें • Zero Typing',
    voiceFirstSub: 'आवाज़ और फ़ोटो से अपनी दुकान देश भर में ले जाएं',
    chooseLanguageTitle: 'अपनी भाषा चुनें • Select Language',
    chooseRoleTitle: 'आप कौन हैं? • Select Role',
    roleArtisanTitle: 'मैं कारीगर हूँ • Artisan (Seller)',
    roleArtisanDesc: 'मैं अपने हाथ से बने उत्पाद बेचना चाहता हूँ',
    roleBuyerTitle: 'मैं खरीदार हूँ • Craft Lover (Buyer)',
    roleBuyerDesc: 'सीधे असली कारीगरों से प्रामाणिक कलाकृतियां खरीदें',
    onboardingContinue: 'आगे बढ़ें • Continue',

    addProductTitle: 'नया सामान जोड़ें • Add Product',
    stepIndicator: 'चरण १ का २ • Step 1 of 2',
    stepSub: 'फोटो और आवाज़ • Photo & Voice',
    simulateErrorLabel: 'स्थितिजांच • State Simulator',
    simulateErrorSub: 'खामी की स्थिति जांचें (Simulate Retry)',
    simulateErrorActive: 'त्रुटि सक्रिय • Error Active',
    simulateErrorTrigger: 'खामी दिखाएं • Show Error',
    photosHeading: 'कारीगरी की तस्वीरें • Craft Photos',
    photosCount1: '१ / २ पूर्ण • 1 of 2 Done',
    photosCount2: '२ / २ पूर्ण • 2 of 2 Done',
    mainPhotoTag: '✓ मुख्य फोटो • Main Photo',
    secondPhotoTag: '✓ दूसरी फोटो • Second Photo',
    secondPhotoDesc: 'सामने या पीछे का भाग • Other Angle',
    addPhotoBtn: '[ + जोड़ें ] • Add Photo',
    optimizingPhoto: 'ग्रामीण नेटवर्क हेतु अनुकूलन • Optimizing (<500KB)...',
    photoOptimizedBadge: 'तस्वीर संपीड़ित (<500KB) • Optimized',
    voiceGuideTitle: 'बोलकर जानकारी दें • Voice Guide',
    q1Name: '१. क्या बनाया? • Product Name',
    q1Sub: 'नाम या वस्तु',
    q2Hours: '२. कितने घंटे? • Hours Made',
    q2Sub: 'श्रम का समय',
    q3Material: '३. क्या सामग्री? • Materials',
    q3Sub: 'माटी / धातु / रंग',
    speakDetailsTitle: 'आवाज़ में बताएं • Speak Details',
    speakDetailsSub: 'माइक दबाएं और बेझिझक बोलें (No typing needed)',
    recordedPill: 'रिकॉर्ड हुआ • Clear Voice Saved',
    retryErrorTitle: 'आवाज़ समझ नहीं आई, कृपया दोबारा बोलें • Please Retake',
    retryErrorDesc: 'कृपया शांत वातावरण में माइक के समीप आकर दोबारा 3 बातें बताएं।',
    retryVoiceBtn: 'दोबारा बोलें • Retry Voice',
    generateListingBtn: 'जाँचें और आगे बढ़ें • Next',
    generateListingSub: 'AI विवरण तैयार करें • Generate Listing',

    listingPreviewTitle: 'उत्पाद विवरण • Product Details',
    aiCraftedPill: 'जादू से तैयार सूची • AI Crafted Listing',
    listenFullDetails: 'पूरी जानकारी सुनें • Listen Full Details',
    listenLanguageSub: 'हिंदी में सुनें • Listen in Hindi',
    giVerified: '✓ GI प्रमाणित • GI Tagged',
    anglesVerified: '3 कोण दर्ज • 3 Angles Verified',
    hoursLabor: 'श्रम समय • Crafting Hours',
    materialsBadge: 'सामग्री • Materials',
    suggestedPriceTitle: 'अनुशंसित मूल्य • Suggested Price',
    marketRateSub: 'बाज़ार दर अनुसार • Market Standard',
    directArtisanIncome: 'सीधे आपकी आय • Direct to You',
    packagingCut: 'पैकिंग व सुरक्षा • Packaging',
    speakToChangeTitle: 'बोलकर बदलें • Voice Edit',
    speakToChangeSub: 'सुधार के लिए माइक दबाकर बोलें • Tap to Edit',
    publishToShopBtn: 'बाज़ार में प्रकाशित करें • Publish to Shop',
    saveDraftBtn: 'ड्राफ्ट सहेजें • Save Draft',
    shareBtn: 'साझा करें • Share',

    myShopTitle: 'मेरी दुकान • My Shop',
    namasteArtisan: 'रामदास जी, नमस्ते! 🙏 • Welcome',
    verifiedArtisanBadge: 'कारीगर पहचान: प्रमाणित • Verified',
    audioGuideShop: 'पहला सामान कैसे जोड़ें, सुनें • Audio Guide',
    emptyShopToggle: '⇄ खाली दृश्य • Empty View',
    activeShopToggle: '⇄ सक्रिय दुकान • Active Shop',
    activeStats: 'सक्रिय सामान • Active Items',
    totalSalesStats: 'कुल बिक्री • Total Sales',
    queriesStats: 'संदेश • Queries',
    myProductsTitle: 'मेरे उत्पाद • My Craft Products',
    orderPendingBadge: 'ऑर्डर मिला • 1 Order Pending',
    startPackingBtn: 'पैकिंग शुरू • Start Packing',
    emptyShopHeading: 'अभी दुकान में कोई सामान नहीं है • Shop is Empty',
    emptyShopMessage:
      'अपनी कला देश-विदेश तक पहुँचाएं। सिर्फ २ मिनट में बोलकर और फोटो खींचकर पहला सामान जोड़ें।',
    micAddFirstItem: 'माइक दबाएं और पहला सामान जोड़ें • Add First Item',
    micJustSpeak: 'बस बोलें, बाकी काम कलासेतु करेगा ✨ • Zero Typing',
    threeStepsTitle: '३ आसान कदम (Zero Typing): २ मिनट',
    step1PhotoTitle: '१. फोटो लें • Take Photo',
    step1PhotoSub: '२ साफ तस्वीरें',
    step2VoiceTitle: '२. बोलें • Speak',
    step2VoiceSub: 'अपनी भाषा में',
    step3LiveTitle: '३. दुकान शुरू • Shop Live',
    step3LiveSub: 'सीधे बिक्री',
    helpCenterTitle: 'मदद चाहिए? सहायता केंद्र • Help Center',
    freeTag: 'निःशुल्क • Free',
    listenAudioInstructions: 'ऑडियो निर्देश सुनें • Listen Instructions',
    listenAudioInstructionsSub: 'अपनी भाषा में पूरी प्रक्रिया समझें',
    callShilpMitra: 'शिल्प मित्र से बात करें • Call Shilp Mitra',
    callShilpMitraSub: 'टोल-फ्री फोन पर तुरंत सहायता (1800-000-123)',
    newProductMicPrompt: 'नया सामान बोलना शुरू करें • Add Product by Voice',
    newProductMicSub: 'माइक दबाकर विवरण दें • Tap mic & speak',
    needHelpPrompt: 'मदद चाहिए? बोलें • Need Help?',
    needHelpSub: 'दुकान चलाने में मार्गदर्शन • Shop guidance',

    marketplaceTitle: 'कलासेतु बाज़ार • Marketplace',
    searchPlaceholder: 'शिल्प या कारीगर खोजें • Search craft or artisan...',
    filterAll: 'सभी • All',
    filterGi: 'GI टैग • GI Tagged',
    filterPottery: 'मिट्टी शिल्प • Pottery',
    filterMetal: 'धातु शिल्प • Metal Craft',
    filterTextile: 'हथकरघा • Handloom',
    fairTradeBannerTitle: '100% सीधा कारीगर से • 0% बिचौलिया',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'कारीगरों की कलाकृतियां • Artisan Creations',
    resultsCount: 'कलाकृतियां उपलब्ध • items available',
    listenCraftStory: 'शिल्प कथा सुनें • Craft Story',
    freeShipping: 'निःशुल्क शिपिंग • Free Shipping',
    chatWithArtisan: 'कारीगर से बात करें • Chat',
    whatsAppOrder: 'WhatsApp ऑर्डर',
    audioTourTitle: 'कला सेतु ऑडियो यात्रा • Audio Tour',
    audioTourSub: 'सुनिए बस्तर व गोरखपुर के शिल्पकारों की लोक परंपरा',
    audioTourPrompt: 'बस्तर के जंगलों में मधुमक्खियों के मोम से ढाला शिल्प...',
    listenFullAudioStory: 'पूरी कथा सुनें • Listen Tour',

    profileHeading: 'कारीगर प्रोफाइल • Artisan Profile',
    supportBtn: 'सहयोग करें • Support',
    supportedBtn: 'सहयोग किया ✓ • Supported',
    experienceBadge: 'वर्षों का अनुभव • Years Experience',
    generationBadge: 'पीढ़ी की विरासत • Generation Heritage',
    hearArtisanStoryTitle: 'कारीगर की जुबानी सुनें • Hear Story',
    traditionTitle: 'परंपरा और पवित्र माटी • Tradition & Earth',
    handcraftedWorksTitle: 'हस्तनिर्मित कृतियां • Handcrafted Creations',
    directFromHomeSub: 'सीधे कारीगर के घर से • Direct from Artisan',
    itemsAvailable: 'उपलब्ध • Available',
    buyBtn: 'खरीदें • Buy Now',
    directConnectHeading: 'सीधा संवाद व समर्थन • Direct Connection',
    zeroMiddlemenGuarantee: 'शून्य बिचौलिया गारंटी • 100% Direct to Artisan',
    kilnSupportTitle: 'शिल्प पोषण सहयोग • Kiln Heritage Support',
    kilnSupportSub: 'नई भट्टी निर्माण हेतु सहयोग राशि',
    kilnSupportBtn: '₹100 भेंट • Gift ₹100',
    kilnSupportDone: '✓ प्रेषित • Sent',
    directCallBtn: 'सीधी बात करें • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ऑर्डर • Order on WhatsApp',
    guaranteeText:
      'कलासेतु वचनबद्धता: आपके द्वारा दिए गए प्रत्येक मूल्य का पूरा 100% सीधा कारीगर के जन-धन खाते में जाता है।',

    chatHeaderTitle: 'कारीगर से सीधा संवाद • Direct Chat',
    chatSubText: 'सीधा संपर्क • Zero Middlemen',
    chatTrustNotice: '🔒 100% राशि सीधे असली शिल्पकार को जाती है।',
    chatInputPlaceholder: 'कारीगर को संदेश लिखें या बोलें • Type or speak...',
  },

  // 2. Telugu
  te: {
    appName: 'కళాసేతు • KalaSetu',
    artisanMode: 'చేతివృత్తిదారుడు (విక్రేత) • Seller',
    buyerMode: 'కళాభిమాని (కొనుగోలుదారు) • Buyer',
    sellerRoleLabel: 'కళాకారుడు • Seller',
    buyerRoleLabel: 'కొనుగోలుదారు • Buyer',
    switchMode: 'పాత్ర మార్చుకోండి • Switch Role',
    listen: 'వినండి • Listen',
    offlineBanner: 'ఇంటర్నెట్ ఆఫ్‌లైన్‌లో ఉంది • Firestore కాష్ యాక్టివ్ (ఆటో-సింక్ అవుతుంది)',
    offlineRetry: 'తనిఖీ చేయండి • Check',
    onlineNotice: 'ఆన్‌లైన్ మోడ్ సక్రియంగా ఉంది • Online',
    firestoreOnlineNotice: 'క్లౌడ్ ఫైర్‌స్టోర్ యాక్టివ్ • డేటా రియల్-టైమ్‌లో సింక్ అవుతోంది',
    firestoreSyncSubtext: 'Firestore డేటాబేస్: ai-studio-kalasetu • రియల్-టైమ్ క్లౌడ్ సింక్',
    stepOf: 'దశ • Step',
    back: 'వెనుకకు • Back',
    continueBtn: 'ముందుకు సాగండి • Continue',
    close: 'మూసివేయండి • Close',

    navMyShop: 'నా దుకాణం • My Shop',
    navMarketplace: 'సంత • Marketplace',
    navAddProduct: 'వస్తువు జోడించు • Add Item',
    navProfile: 'కళాకారుడు • Profile',
    navOffline: 'ఆఫ్‌లైన్ • Offline',
    navOnline: 'ఆన్‌లైన్ • Online',

    welcome: 'కళాసేతుకు స్వాగతం',
    welcomeTitle: 'కళాసేతుకు స్వాగతం',
    voiceFirstTitle: 'మాటలతో నడిచే వేదిక • Zero Typing',
    voiceFirstSub: 'మీ స్వరం మరియు ఫోటోలతో దేశవ్యాప్తంగా విక్రయించండి',
    chooseLanguageTitle: 'భాషను ఎంచుకోండి • Select Language',
    chooseRoleTitle: 'మీరు ఎవరు? • Select Role',
    roleArtisanTitle: 'నేను కళాకారుడిని • Artisan (Seller)',
    roleArtisanDesc: 'నా చేతివృత్తుల వస్తువులను అమ్మాలనుకుంటున్నాను',
    roleBuyerTitle: 'నేను కొనుగోలుదారుని • Craft Lover (Buyer)',
    roleBuyerDesc: 'నేరుగా గ్రామీణ కళాకారుల నుండి కళాఖండాలు కొనండి',
    onboardingContinue: 'ముందుకు సాగండి • Continue',

    addProductTitle: 'కొత్త వస్తువు జోడించండి • Add Product',
    stepIndicator: 'దశ 1/2 • Step 1 of 2',
    stepSub: 'ఫోటో & స్వరం • Photo & Voice',
    simulateErrorLabel: 'లోపం అనుకరణ • State Simulator',
    simulateErrorSub: 'స్వరం స్పష్టత లోపం తనిఖీ (Retry State)',
    simulateErrorActive: 'లోపం సక్రియం • Error Active',
    simulateErrorTrigger: 'లోపం చూపించు • Show Error',
    photosHeading: 'కళాఖండం ఫోటోలు • Craft Photos',
    photosCount1: '1 / 2 పూర్తయింది • 1 of 2 Done',
    photosCount2: '2 / 2 పూర్తయింది • 2 of 2 Done',
    mainPhotoTag: '✓ ప్రధాన ఫోటో • Main Photo',
    secondPhotoTag: '✓ రెండవ ఫోటో • Second Photo',
    secondPhotoDesc: 'ముందు లేదా వెనుక భాగం • Other Angle',
    addPhotoBtn: '[ + జోడించు ] • Add Photo',
    optimizingPhoto: 'గ్రామీణ నెట్‌వర్క్ కోసం కుదింపు (<500KB)...',
    photoOptimizedBadge: 'ఫోటో కుదించబడింది (<500KB) • Optimized',
    voiceGuideTitle: 'నోటితో చెప్పండి • Voice Guide',
    q1Name: '1. ఏమి తయారు చేశారు? • Product Name',
    q1Sub: 'పేరు లేదా వస్తువు',
    q2Hours: '2. ఎన్ని గంటలు పట్టింది? • Hours Made',
    q2Sub: 'శ్రమ సమయం',
    q3Material: '3. వాడిన పదార్థాలు ఏమిటి? • Materials',
    q3Sub: 'మట్టి / లోహం / రంగులు',
    speakDetailsTitle: 'స్వరంలో వివరించండి • Speak Details',
    speakDetailsSub: 'మైక్ నొక్కి మాట్లాడండి (టైపింగ్ అవసరం లేదు)',
    recordedPill: 'రికార్డ్ అయ్యింది • Clear Voice Saved',
    retryErrorTitle: 'వాయిస్ స్పష్టంగా లేదు, మళ్ళీ చెప్పండి • Please Retake',
    retryErrorDesc: 'నిశ్శబ్ద వాతావరణంలో మైక్ దగ్గరగా మాట్లాడండి.',
    retryVoiceBtn: 'మళ్ళీ రికార్డ్ చేయండి • Retry Voice',
    generateListingBtn: 'పరిశీలించి కొనసాగండి • Next',
    generateListingSub: 'AI వివరాలు రూపొందించు • Generate Listing',

    listingPreviewTitle: 'వస్తువు వివరాలు • Product Details',
    aiCraftedPill: 'AI ద్వారా సిద్ధమైన జాబితా • AI Crafted Listing',
    listenFullDetails: 'పూర్తి వివరాలు వినండి • Listen Full Details',
    listenLanguageSub: 'తెలుగులో వినండి • Listen in Telugu',
    giVerified: '✓ GI ధృవీకరించబడింది • GI Tagged',
    anglesVerified: '3 కోణాలు నమోదయ్యాయి • 3 Angles Verified',
    hoursLabor: 'చేతిపని గంటలు • Crafting Hours',
    materialsBadge: 'పదార్థాలు • Materials',
    suggestedPriceTitle: 'సిఫార్సు చేసిన ధర • Suggested Price',
    marketRateSub: 'మార్కెట్ రేటు ప్రకారం • Market Standard',
    directArtisanIncome: 'మీకు నేరుగా వచ్చే ఆదాయం • Direct to You',
    packagingCut: 'ప్యాకింగ్ & రవాణా • Packaging',
    speakToChangeTitle: 'మాటలతో మార్చండి • Voice Edit',
    speakToChangeSub: 'ధర మార్చడానికి మైక్ నొక్కండి • Tap to Edit',
    publishToShopBtn: 'సంతలో ప్రచురించండి • Publish to Shop',
    saveDraftBtn: 'డ్రాఫ్ట్ భద్రపరచండి • Save Draft',
    shareBtn: 'పంచుకోండి • Share',

    myShopTitle: 'నా దుకాణం • My Shop',
    namasteArtisan: 'రాందాస్ గారూ, నమస్కారం! 🙏 • Welcome',
    verifiedArtisanBadge: 'కళాకారుడి గుర్తింపు: ధృవీకరించబడింది • Verified',
    audioGuideShop: 'మొదటి వస్తువు ఎలా జోడించాలో వినండి • Audio Guide',
    emptyShopToggle: '⇄ ఖాళీ దృశ్యం • Empty View',
    activeShopToggle: '⇄ క్రియాశీల దుకాణం • Active Shop',
    activeStats: 'క్రియాశీల వస్తువులు • Active Items',
    totalSalesStats: 'మొత్తం అమ్మకాలు • Total Sales',
    queriesStats: 'విచారణలు • Queries',
    myProductsTitle: 'నా ఉత్పత్తులు • My Craft Products',
    orderPendingBadge: 'ఆర్డర్ వచ్చింది • 1 Order Pending',
    startPackingBtn: 'ప్యాకింగ్ ప్రారంభించండి • Start Packing',
    emptyShopHeading: 'దుకాణంలో ఇంకా ఏ వస్తువులూ లేవు • Shop is Empty',
    emptyShopMessage:
      'మీ కళను ప్రపంచానికి చేర్చండి. కేవలం 2 నిమిషాల్లో ఫోటో మరియు వాయిస్‌తో వస్తువును జోడించండి.',
    micAddFirstItem: 'మైక్ నొక్కి మొదటి వస్తువు జోడించండి • Add First Item',
    micJustSpeak: 'మీరు మాట్లాడండి, మిగతాది కళాసేతు చూసుకుంటుంది ✨',
    threeStepsTitle: '3 సులభ దశలు (Zero Typing): 2 నిమిషాలు',
    step1PhotoTitle: '1. ఫోటో తీయండి • Take Photo',
    step1PhotoSub: '2 స్పష్టమైన ఫోటోలు',
    step2VoiceTitle: '2. మాట్లాడండి • Speak',
    step2VoiceSub: 'మీ మాతృభాషలో',
    step3LiveTitle: '3. విక్రయం ప్రారంభం • Shop Live',
    step3LiveSub: 'నేరుగా అమ్మకాలు',
    helpCenterTitle: 'సహాయం కావాలా? సహాయ కేంద్రం • Help Center',
    freeTag: 'ఉచితం • Free',
    listenAudioInstructions: 'ఆడియో సూచనలు వినండి • Listen Instructions',
    listenAudioInstructionsSub: 'మీ భాషలో మొత్తం ప్రక్రియను అర్థం చేసుకోండి',
    callShilpMitra: 'శిల్ప మిత్రతో మాట్లాడండి • Call Shilp Mitra',
    callShilpMitraSub: 'టోల్-ఫ్రీ ఫోన్ సహాయం (1800-000-123)',
    newProductMicPrompt: 'కొత్త వస్తువును స్వరంతో జోడించండి • Add by Voice',
    newProductMicSub: 'మైక్ నొక్కి వివరాలు చెప్పండి • Tap & speak',
    needHelpPrompt: 'సహాయం కావాలా? • Need Help?',
    needHelpSub: 'దుకాణ నిర్వహణ సలహా • Guidance',

    marketplaceTitle: 'కళాసేతు సంత • Marketplace',
    searchPlaceholder: 'శిల్పం లేదా కళాకారుడిని వెతకండి • Search...',
    filterAll: 'అన్నీ • All',
    filterGi: 'GI గుర్తింపు • GI Tagged',
    filterPottery: 'మట్టి శిల్పం • Pottery',
    filterMetal: 'లోహ శిల్పం • Metal Craft',
    filterTextile: 'చేనేత వస్త్రాలు • Handloom',
    fairTradeBannerTitle: '100% నేరుగా కళాకారుడి నుండి • 0% దళారులు',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'కళాకారుల సృష్టి • Artisan Creations',
    resultsCount: 'వస్తువులు అందుబాటులో ఉన్నాయి • items available',
    listenCraftStory: 'శిల్ప కథ వినండి • Craft Story',
    freeShipping: 'ఉచిత షిప్పింగ్ • Free Shipping',
    chatWithArtisan: 'కళాకారుడితో మాట్లాడండి • Chat',
    whatsAppOrder: 'WhatsApp ఆర్డర్',
    audioTourTitle: 'కళాసేతు ఆడియో యాత్ర • Audio Tour',
    audioTourSub: 'బస్తర్ మరియు సాంప్రదాయ చేతివృత్తుల కథలు వినండి',
    audioTourPrompt: 'బస్తర్ అడవులలో సహజమైన తేనెటీగల మైనంతో తయారయ్యే లోహ శిల్పం...',
    listenFullAudioStory: 'పూర్తి కథ వినండి • Listen Tour',

    profileHeading: 'కళాకారుడి ప్రొఫైల్ • Artisan Profile',
    supportBtn: 'సహాయం చేయండి • Support',
    supportedBtn: 'సహాయం పూర్తయింది ✓ • Supported',
    experienceBadge: 'సంవత్సరాల అనుభవం • Years Experience',
    generationBadge: 'తరాల వారసత్వం • Generation Lineage',
    hearArtisanStoryTitle: 'కళాకారుడి మాటల్లో వినండి • Hear Story',
    traditionTitle: 'సంప్రదాయం & పవిత్ర మట్టి • Tradition & Earth',
    handcraftedWorksTitle: 'చేతితో చేసిన కళాఖండాలు • Handcrafted Works',
    directFromHomeSub: 'నేరుగా కళాకారుడి ఇల్లు నుండి • Direct from Home',
    itemsAvailable: 'అందుబాటులో ఉన్నాయి • Available',
    buyBtn: 'కొనండి • Buy Now',
    directConnectHeading: 'నేరుగా సంభాషణ & మద్దతు • Direct Connect',
    zeroMiddlemenGuarantee: 'దళారులు లేని హామీ • 100% Direct to Artisan',
    kilnSupportTitle: 'కొలిమి నిర్మాణ సహకారం • Kiln Heritage Support',
    kilnSupportSub: 'కొత్త కొలిమి కోసం చేదోడు',
    kilnSupportBtn: '₹100 కానుక • Gift ₹100',
    kilnSupportDone: '✓ పంపబడింది • Sent',
    directCallBtn: 'నేరుగా కాల్ చేయండి • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ఆర్డర్ • Order on WhatsApp',
    guaranteeText:
      'కళాసేతు హామీ: మీ చెల్లింపులోని 100% నగదు నేరుగా కళాకారుడి జన్-ధన్ బ్యాంకు ఖాతాలో జమ అవుతుంది.',

    chatHeaderTitle: 'కళాకారుడితో నేరుగా చాట్ • Direct Chat',
    chatSubText: 'దళారులు లేరు • Zero Middlemen',
    chatTrustNotice: '🔒 చెల్లించే సొమ్ము నేరుగా కళాకారుడికి చేరుతుంది.',
    chatInputPlaceholder: 'సందేశం టైప్ చేయండి లేదా మాట్లాడండి...',
  },

  // 3. Gondi
  gondi: {
    appName: 'కళాసేతు • KalaSetu (గోండీ)',
    artisanMode: 'శిల్పకారుడు (అమ్మకందారుడు) • Seller',
    buyerMode: 'కొనుగోలుదారు • Buyer',
    sellerRoleLabel: 'శిల్పి • Seller',
    buyerRoleLabel: 'కొనుగోలుదారు • Buyer',
    switchMode: 'పాత్ర మార్చు • Switch Role',
    listen: 'కేంజల్ • Listen',
    offlineBanner: 'నెట్‌వర్క్ బంద్ ఆంతూరు • Firestore Offline Mode',
    offlineRetry: 'చూడు • Check',
    onlineNotice: 'నెట్‌వర్క్ ఆంతా • Online',
    firestoreOnlineNotice: 'Cloud Firestore Active • Real-time Data Synced',
    firestoreSyncSubtext: 'Firestore Database: ai-studio-kalasetu',
    stepOf: 'మెట్టు • Step',
    back: 'వెనక్కి • Back',
    continueBtn: 'ముందుకు • Continue',
    close: 'మూయి • Close',

    navMyShop: 'నవా దుకాన్ • My Shop',
    navMarketplace: 'బజార్ • Marketplace',
    navAddProduct: 'వస్తువు కలుపు • Add Item',
    navProfile: 'శిల్పి • Profile',
    navOffline: 'ఆఫ్‌లైన్ • Offline',
    navOnline: 'ఆన్‌లైన్ • Online',

    welcome: 'कलासेतु ते मीकु सुस्वागतम',
    welcomeTitle: 'కళాసేతులోకి స్వాగతం • Welcome to KalaSetu',
    voiceFirstTitle: 'మాటలతో పని • Zero Typing (Voice-First)',
    voiceFirstSub: 'నోటితో చెప్పి మీ శిల్పాలు దేశమంతా అమ్మండి',
    chooseLanguageTitle: 'మీ భాష ఎంచుకోండి • Select Language',
    chooseRoleTitle: 'మీరు ఎవరు? • Select Role',
    roleArtisanTitle: 'నన్నా శిల్పిని • I am an Artisan',
    roleArtisanDesc: 'చేతితో చేసిన వస్తువులు అమ్మడానికి',
    roleBuyerTitle: 'నన్నా కొనుగోలుదారుని • I am a Buyer',
    roleBuyerDesc: 'గోండీ, బస్తర్ అసలైన శిల్పాలు కొనడానికి',
    onboardingContinue: 'ముందుకు సాగు • Continue',

    addProductTitle: 'కొత్త వస్తువు కలుపు • Add Product',
    stepIndicator: 'మెట్టు 1/2 • Step 1 of 2',
    stepSub: 'ఫోటో & గొంతు • Photo & Voice',
    simulateErrorLabel: 'లోపం చూడు • State Simulator',
    simulateErrorSub: 'మాట అర్థం కాకపోతే పరీక్ష (Retry State)',
    simulateErrorActive: 'లోపం ఉంది • Error Active',
    simulateErrorTrigger: 'లోపం చూపు • Show Error',
    photosHeading: 'శిల్పం ఫోటోలు • Craft Photos',
    photosCount1: '1 / 2 ఆయె • 1 of 2 Done',
    photosCount2: '2 / 2 ఆయె • 2 of 2 Done',
    mainPhotoTag: '✓ ముఖ్య ఫోటో • Main Photo',
    secondPhotoTag: '✓ రెండో ఫోటో • Second Photo',
    secondPhotoDesc: 'వెనుక లేదా పక్క భాగం • Other Angle',
    addPhotoBtn: '[ + కలుపు ] • Add Photo',
    optimizingPhoto: 'నెట్‌వర్క్ కోసం సైజు తగ్గింపు (<500KB)...',
    photoOptimizedBadge: 'ఫోటో సిద్ధం (<500KB) • Optimized',
    voiceGuideTitle: 'నోటితో చెప్పు • Voice Guide',
    q1Name: '1. ఏమి చేసినావ్? • Product Name',
    q1Sub: 'పేరు',
    q2Hours: '2. ఎన్ని గంటలు పట్టింది? • Hours Made',
    q2Sub: 'శ్రమ సమయం',
    q3Material: '3. ఏ వస్తువు వాడినావ్? • Materials',
    q3Sub: 'మట్టి / పిత్తల / మైనం',
    speakDetailsTitle: 'మాటల్లో చెప్పు • Speak Details',
    speakDetailsSub: 'మైక్ నొక్కి ధైర్యంగా చెప్పు (No typing needed)',
    recordedPill: 'మాట రికార్డ్ ఆయె • Clear Voice Saved',
    retryErrorTitle: 'మాట అర్థం కాలేదు, మళ్ళీ చెప్పు • Please Retake',
    retryErrorDesc: 'మైక్ దగ్గరికి వచ్చి మళ్ళీ నిదానంగా చెప్పు.',
    retryVoiceBtn: 'మళ్ళీ రికార్డ్ చేయి • Retry Voice',
    generateListingBtn: 'ముందుకు సాగు • Next',
    generateListingSub: 'AI వివరాలు తయారు చేయి • Generate Listing',

    listingPreviewTitle: 'వస్తువు వివరాలు • Product Details',
    aiCraftedPill: 'AI తో తయారైన వివరాలు • AI Crafted',
    listenFullDetails: 'పూర్తి మాటలు విను • Listen Full Details',
    listenLanguageSub: 'గోండీ మాండలికంలో విను • Listen in Gondi',
    giVerified: '✓ GI ధృవీకరణ • GI Tagged',
    anglesVerified: '3 కోణాలు నమోదయ్యాయి • 3 Angles',
    hoursLabor: 'పని గంటలు • Crafting Hours',
    materialsBadge: 'సామాను • Materials',
    suggestedPriceTitle: 'అమ్మకం ధర • Suggested Price',
    marketRateSub: 'మార్కెట్ రేటు • Market Rate',
    directArtisanIncome: 'మీకు వచ్చే సొమ్ము • Direct to You',
    packagingCut: 'ప్యాకింగ్ ఖర్చు • Packaging',
    speakToChangeTitle: 'నోటితో మార్చు • Voice Edit',
    speakToChangeSub: 'ధర మార్చడానికి మైక్ నొక్కు • Tap to Edit',
    publishToShopBtn: 'బజారులో పెట్టు • Publish to Shop',
    saveDraftBtn: 'దాచుకో • Save Draft',
    shareBtn: 'పంపు • Share',

    myShopTitle: 'నవా దుకాన్ • My Shop',
    namasteArtisan: 'రాందాస్ దాదా, జోహార్! 🙏 • Welcome',
    verifiedArtisanBadge: 'అసలైన శిల్పి ధృవీకరణ • Verified',
    audioGuideShop: 'మొదటి సామాను ఎట్లా పెట్టాలో విను • Audio Guide',
    emptyShopToggle: '⇄ ఖాళీ దుకాణం • Empty View',
    activeShopToggle: '⇄ నడిచే దుకాణం • Active Shop',
    activeStats: 'ఉన్న సామాను • Active Items',
    totalSalesStats: 'మొత్తం అమ్మకం • Total Sales',
    queriesStats: 'మాటలు • Queries',
    myProductsTitle: 'నవా శిల్పాలు • My Craft Products',
    orderPendingBadge: 'ఆర్డర్ వచ్చింది • 1 Order Pending',
    startPackingBtn: 'ప్యాకింగ్ చేయి • Start Packing',
    emptyShopHeading: 'దుకాణంలో ఇంకా ఏమీ లేదు • Shop is Empty',
    emptyShopMessage: 'కేవలం 2 నిమిషాల్లో ఫోటో తీసి మాట్లాడి మీ సామాను అమ్మండి.',
    micAddFirstItem: 'మైక్ నొక్కి సామాను కలుపు • Add First Item',
    micJustSpeak: 'మీరు మాట్లాడండి, మిగతాది కళాసేతు చేస్తుంది ✨',
    threeStepsTitle: '3 సులభ పద్ధతులు: 2 నిమిషాలు',
    step1PhotoTitle: '1. ఫోటో తీయి • Take Photo',
    step1PhotoSub: '2 మంచి ఫోటోలు',
    step2VoiceTitle: '2. మాట్లాడు • Speak',
    step2VoiceSub: 'మీ గోండీ భాషలో',
    step3LiveTitle: '3. దుకాణం మొదలు • Shop Live',
    step3LiveSub: 'నేరుగా అమ్మకం',
    helpCenterTitle: 'సహాయం కావాలా? • Help Center',
    freeTag: 'పైసలు లేవు • Free',
    listenAudioInstructions: 'వివరాలు విను • Listen Instructions',
    listenAudioInstructionsSub: 'మీ భాషలో మొత్తం తెలుసుకో',
    callShilpMitra: 'శిల్ప మిత్రకు ఫోన్ చేయి • Call Shilp Mitra',
    callShilpMitraSub: 'ఉచిత ఫోన్ సహాయం (1800-000-123)',
    newProductMicPrompt: 'కొత్త సామాను గురించి చెప్పు • Add by Voice',
    newProductMicSub: 'మైక్ నొక్కు • Tap mic',
    needHelpPrompt: 'మద్దతు కావాలా? • Need Help?',
    needHelpSub: 'దుకాణం సలహా • Guidance',

    marketplaceTitle: 'కళాసేతు బజార్ • Marketplace',
    searchPlaceholder: 'శిల్పం వెతుకు • Search craft...',
    filterAll: 'అన్నీ • All',
    filterGi: 'GI శిల్పం • GI Tagged',
    filterPottery: 'మట్టి పని • Pottery',
    filterMetal: 'లోహ పని • Dokra Metal',
    filterTextile: 'బట్టల పని • Textiles',
    fairTradeBannerTitle: '100% నేరుగా శిల్పి నుంచే • 0% దళారులు',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'శిల్పకారుల కళ • Artisan Creations',
    resultsCount: 'వస్తువులు ఉన్నాయి • items found',
    listenCraftStory: 'శిల్పం కథ విను • Craft Story',
    freeShipping: 'ఉచిత డెలివరీ • Free Shipping',
    chatWithArtisan: 'శిల్పితో మాట్లాడు • Chat',
    whatsAppOrder: 'WhatsApp ఆర్డర్',
    audioTourTitle: 'కళాసేతు ఆడియో కథ • Audio Tour',
    audioTourSub: 'బస్తర్ అడవుల ప్రాచీన డోక్రా శిల్ప కథలు వినండి',
    audioTourPrompt: 'తేనెటీగల మైనంతో తయారయ్యే 4000 ఏళ్ళ నాటి శిల్పం...',
    listenFullAudioStory: 'కథ విను • Listen Tour',

    profileHeading: 'శిల్పి వివరాలు • Artisan Profile',
    supportBtn: 'చేదోడు • Support',
    supportedBtn: 'చేదోడు అందింది ✓ • Supported',
    experienceBadge: 'ఏళ్ళ అనుభవం • Years Experience',
    generationBadge: 'తరాల విద్య • Generation Heritage',
    hearArtisanStoryTitle: 'శిల్పి గొంతులో విను • Hear Story',
    traditionTitle: 'సంప్రదాయం & నేల తల్లి • Tradition & Earth',
    handcraftedWorksTitle: 'చేతితో చేసినవి • Handcrafted Works',
    directFromHomeSub: 'శిల్పి గుడిసె నుంచే • Direct from Home',
    itemsAvailable: 'ఉన్నవి • Available',
    buyBtn: 'కొనుక్కో • Buy Now',
    directConnectHeading: 'నేరుగా మాటలు • Direct Connect',
    zeroMiddlemenGuarantee: 'దళారులు లేరు • 100% Direct to Artisan',
    kilnSupportTitle: 'కొలిమి సహకారం • Kiln Heritage Support',
    kilnSupportSub: 'కొత్త కొలిమి కోసం కానుక',
    kilnSupportBtn: '₹100 కానుక • Gift ₹100',
    kilnSupportDone: '✓ అందింది • Sent',
    directCallBtn: 'ఫోన్ చేయి • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ఆర్డర్ • Order on WhatsApp',
    guaranteeText:
      'కళాసేతు మాట: మీరు ఇచ్చే 100% పైసలు నేరుగా శిల్పి బ్యాంకు ఖాతాకే వెళ్తాయి.',

    chatHeaderTitle: 'శిల్పితో నేరుగా మాటలు • Direct Chat',
    chatSubText: 'దళారులు లేరు • Zero Middlemen',
    chatTrustNotice: '🔒 మొత్తం సొమ్ము శిల్పికే చేరుతుంది.',
    chatInputPlaceholder: 'సందేశం చెప్పు లేదా రాయి...',
  },

  // 4. Lambadi (Banjara)
  lambadi: {
    appName: 'కళాసేతు • KalaSetu (లంబాడీ)',
    artisanMode: 'కళాకారుడు (అమ్మేవారు) • Seller',
    buyerMode: 'కొనేవారు • Buyer',
    sellerRoleLabel: 'కళాకారుడు • Seller',
    buyerRoleLabel: 'కొనేవారు • Buyer',
    switchMode: 'పాత్ర బదలాయించు • Switch Role',
    listen: 'సాంభళో • Listen',
    offlineBanner: 'నెట్ బంద్ ఛే • Firestore Offline Mode',
    offlineRetry: 'జోవో • Check',
    onlineNotice: 'నెట్ చాలు ఛే • Online',
    firestoreOnlineNotice: 'Cloud Firestore Active • Real-time Data Synced',
    firestoreSyncSubtext: 'Firestore Database: ai-studio-kalasetu',
    stepOf: 'పాయో • Step',
    back: 'పాచే • Back',
    continueBtn: 'ఆగల్ చలో • Continue',
    close: 'బంద్ కరో • Close',

    navMyShop: 'మారీ దుకాన్ • My Shop',
    navMarketplace: 'హాట్ • Marketplace',
    navAddProduct: 'సామాన్ జోడో • Add Item',
    navProfile: 'కళాకారుడు • Profile',
    navOffline: 'ఆఫ్‌లైన్ • Offline',
    navOnline: 'ఆన్‌లైన్ • Online',

    welcome: 'कलासेतु मा थारो स्वागत छ',
    welcomeTitle: 'కళాసేతుమే రామరామ్! • Welcome to KalaSetu',
    voiceFirstTitle: 'బోలేతి కామ్ • Zero Typing',
    voiceFirstSub: 'ఆవాజ్ ఆర్ ఫోటోతి పూరే దేశ్‌మే బేచో',
    chooseLanguageTitle: 'భాష చూన్ లేవో • Select Language',
    chooseRoleTitle: 'తమే కోన్ ఛో? • Select Role',
    roleArtisanTitle: 'మే కళాకారుడ్ ఛూ • Artisan (Seller)',
    roleArtisanDesc: 'హాత్‌తి బనాయెద్ సామాన్ బేచేరు ఛే',
    roleBuyerTitle: 'మే ఖరీదేవాల్ ఛూ • Buyer',
    roleBuyerDesc: 'కళాకారున్ కనేతి సీదా సామాన్ లేరు ఛే',
    onboardingContinue: 'ఆగల్ చలో • Continue',

    addProductTitle: 'నవో సామాన్ జోడో • Add Product',
    stepIndicator: 'పాయో 1/2 • Step 1 of 2',
    stepSub: 'ఫోటో ఆర్ బోలో • Photo & Voice',
    simulateErrorLabel: 'తపాసో • State Simulator',
    simulateErrorSub: 'ఖామతి తపాసో (Simulate Retry)',
    simulateErrorActive: 'లోపం ఛే • Error Active',
    simulateErrorTrigger: 'ఖామతి దేకావో • Show Error',
    photosHeading: 'కళాకరారీ ఫోటో • Craft Photos',
    photosCount1: '1 / 2 హుయో • 1 of 2 Done',
    photosCount2: '2 / 2 హుయో • 2 of 2 Done',
    mainPhotoTag: '✓ ముఖ్య ఫోటో • Main Photo',
    secondPhotoTag: '✓ దూస్రీ ఫోటో • Second Photo',
    secondPhotoDesc: 'సామ్నే యా పాచేరో భాగో • Other Angle',
    addPhotoBtn: '[ + జోడో ] • Add Photo',
    optimizingPhoto: 'ఫోటో సైజ్ ఛోటీ కరేర్యే (<500KB)...',
    photoOptimizedBadge: 'ఫోటో తయార్ (<500KB) • Optimized',
    voiceGuideTitle: 'ముడాతో బోలో • Voice Guide',
    q1Name: '1. కాయి బనాయా? • Product Name',
    q1Sub: 'నామ్',
    q2Hours: '2. కత్రో టేమ్ లాగో? • Hours Made',
    q2Sub: 'ఘంటా',
    q3Material: '3. కాయి వాప్రియా? • Materials',
    q3Sub: 'మాటీ / లోహా / సూత్',
    speakDetailsTitle: 'బోలేర్ సాంగో • Speak Details',
    speakDetailsSub: 'మైక్ దబావో ఆర్ బోలో (నో టైపింగ్)',
    recordedPill: 'బోలేద్ రికార్డ్ హుయో • Clear Voice Saved',
    retryErrorTitle: 'ఆవాజ్ సమజ్ నై ఆయీ, పచో బోలో • Please Retake',
    retryErrorDesc: 'మైక్ కనే ఆయిన్ నిదాన్తి బోలో.',
    retryVoiceBtn: 'పచో రికార్డ్ కరో • Retry Voice',
    generateListingBtn: 'ఆగల్ చలో • Next',
    generateListingSub: 'AI తో తయార్ కరో • Generate Listing',

    listingPreviewTitle: 'సామాన్రో వివరం • Product Details',
    aiCraftedPill: 'AI తో బనాయోద్ • AI Crafted Listing',
    listenFullDetails: 'పూరో సాంభళో • Listen Full Details',
    listenLanguageSub: 'లంబాడీమే సాంభళో • Listen in Lambadi',
    giVerified: '✓ GI ప్రమాణం • GI Tagged',
    anglesVerified: '3 కోణ్ నమోదు • 3 Angles Verified',
    hoursLabor: 'మహనత్ సమయ్ • Crafting Hours',
    materialsBadge: 'సామాగ్రి • Materials',
    suggestedPriceTitle: 'భావో • Suggested Price',
    marketRateSub: 'బజారో భావో • Market Standard',
    directArtisanIncome: 'సీదా తమనే మలేద్ • Direct to You',
    packagingCut: 'ప్యాకింగ్రో ఖర్చు • Packaging',
    speakToChangeTitle: 'బోలిన్ బద్లో • Voice Edit',
    speakToChangeSub: 'మైక్ దబావో ఆర్ సుధారో • Tap to Edit',
    publishToShopBtn: 'హాట్‌మే మేలో • Publish to Shop',
    saveDraftBtn: 'దాచి మేలో • Save Draft',
    shareBtn: 'భేజో • Share',

    myShopTitle: 'మారీ దుకాన్ • My Shop',
    namasteArtisan: 'రాందాస్ జీ, రామరామ్! 🙏 • Welcome',
    verifiedArtisanBadge: 'కళాకారుడ్ ప్రమాణీకృత్ • Verified',
    audioGuideShop: 'సామాన్ కసో జోడనో సాంభళో • Audio Guide',
    emptyShopToggle: '⇄ ఖాలీ దృశ్య • Empty View',
    activeShopToggle: '⇄ చాలు దుకాన్ • Active Shop',
    activeStats: 'మౌజూద్ సామాన్ • Active Items',
    totalSalesStats: 'పూరా బిక్వాల్ • Total Sales',
    queriesStats: 'సందేశ్ • Queries',
    myProductsTitle: 'మారో సామాన్ • My Craft Products',
    orderPendingBadge: 'ఆర్డర్ ఆయో • 1 Order Pending',
    startPackingBtn: 'ప్యాకింగ్ కరో • Start Packing',
    emptyShopHeading: 'దుకాన్‌మే హజీ కాయీ నై ఛే • Shop is Empty',
    emptyShopMessage: 'సిర్ఫ్ 2 మినిట్‌మే ఫోటో తీసి బోలిన్ తమారో పెహలో సామాన్ జోడో.',
    micAddFirstItem: 'మైక్ దబావో పెహలో సామాన్ జోడో • Add First Item',
    micJustSpeak: 'తమే బోలో, బాకీ కామ్ కళాసేతు కరేగా ✨',
    threeStepsTitle: '3 ఆసాన్ పద్ధతి: 2 మినిట్',
    step1PhotoTitle: '1. ఫోటో కాడో • Take Photo',
    step1PhotoSub: '2 సాఫ్ ఫోటో',
    step2VoiceTitle: '2. బోలో • Speak',
    step2VoiceSub: 'తమారీ భాషామే',
    step3LiveTitle: '3. దుకాన్ చాలు • Shop Live',
    step3LiveSub: 'సీదా బిక్రీ',
    helpCenterTitle: 'మదద్ ఛాయే? సహాయ కేంద్రం • Help Center',
    freeTag: 'ముఫ్త్ • Free',
    listenAudioInstructions: 'ఆడియో సాంభళో • Listen Instructions',
    listenAudioInstructionsSub: 'తమారీ భాషామే పూరీ జాన్‌కారీ',
    callShilpMitra: 'శిల్ప మిత్రతో వాత కరో • Call Shilp Mitra',
    callShilpMitraSub: 'టోల్-ఫ్రీ ఫోన్ మదద్ (1800-000-123)',
    newProductMicPrompt: 'నవో సామాన్ బోలిన్ జోడో • Add by Voice',
    newProductMicSub: 'మైక్ దబావో • Tap mic',
    needHelpPrompt: 'మదద్ ఛాయే? • Need Help?',
    needHelpSub: 'దుకాన్ బాబత్ సలహా • Guidance',

    marketplaceTitle: 'కళాసేతు హాట్ • Marketplace',
    searchPlaceholder: 'శిల్పం యా కళాకారుడ్ డూండో • Search...',
    filterAll: 'సగ్ళా • All',
    filterGi: 'GI గుర్తింపు • GI Tagged',
    filterPottery: 'మాటీ శిల్పం • Pottery',
    filterMetal: 'లోహా శిల్పం • Metal',
    filterTextile: 'బంజారా కుట్టు పని • Textile',
    fairTradeBannerTitle: '100% సీదా కళాకారుడ్ కనేతి • 0% దళారీ',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'కళాకారున్ రీ కలా • Artisan Creations',
    resultsCount: 'సామాన్ మౌజూద్ • items available',
    listenCraftStory: 'కథ సాంభళో • Craft Story',
    freeShipping: 'ముఫ్త్ షిప్పింగ్ • Free Shipping',
    chatWithArtisan: 'కళాకారుడ్ కనే వాత కరో • Chat',
    whatsAppOrder: 'WhatsApp ఆర్డర్',
    audioTourTitle: 'కళాసేతు ఆడియో సఫర్ • Audio Tour',
    audioTourSub: 'బంజారా ఆర్ బస్తర్ శిల్ప రీ పురాణీ కహానీ సాంభళో',
    audioTourPrompt: 'జంగల్‌మే తేనెటీగల మైనంతో తయారయ్యే శిల్పం...',
    listenFullAudioStory: 'పూరీ కథ సాంభళో • Listen Tour',

    profileHeading: 'కళాకారుడ్ ప్రొఫైల్ • Artisan Profile',
    supportBtn: 'మదద్ • Support',
    supportedBtn: 'మదద్ హుయీ ✓ • Supported',
    experienceBadge: 'వరహీరో అనుభవ్ • Years Experience',
    generationBadge: 'పీఢీరో వారసత్వ • Generation Lineage',
    hearArtisanStoryTitle: 'కళాకారుడ్ ముడాతో సాంభళో • Hear Story',
    traditionTitle: 'సంప్రదాయం ఆర్ పవిత్ర మాటీ • Tradition',
    handcraftedWorksTitle: 'హాత్‌తో బనాయోద్ • Handcrafted Works',
    directFromHomeSub: 'సీదా కళాకారుడ్రో ఘర్‌తి • Direct from Home',
    itemsAvailable: 'మౌజూద్ • Available',
    buyBtn: 'మోల్ లేవో • Buy Now',
    directConnectHeading: 'సీదా సంపర్క్ • Direct Connect',
    zeroMiddlemenGuarantee: 'దళారీ నై ఛే • 100% Direct to Artisan',
    kilnSupportTitle: 'భట్టీ సహాయం • Kiln Heritage Support',
    kilnSupportSub: 'నవీ భట్టీ బనావేరు మదద్',
    kilnSupportBtn: '₹100 భేట్ • Gift ₹100',
    kilnSupportDone: '✓ పూగీ • Sent',
    directCallBtn: 'సీదా ఫోన్ కరో • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ఆర్డర్ • Order on WhatsApp',
    guaranteeText:
      'కళాసేతు వాచన్: తమారో 100% రూప్య సీదా కళాకారుడ్రో బ్యాంక్ ఖాతామే జమా హోతా ఛే.',

    chatHeaderTitle: 'కళాకారుడ్ కనే వాత కరో • Direct Chat',
    chatSubText: 'సీదా సంపర్క్ • Zero Middlemen',
    chatTrustNotice: '🔒 పూరో రూప్య సీదా కళాకారుడ్ కనే జాతా ఛే.',
    chatInputPlaceholder: 'సందేశ్ లికో యా బోలో...',
  },

  // 5. Bengali
  bn: {
    appName: 'কলাসেতু • KalaSetu',
    artisanMode: 'কারিগর (বিক্রেতা) • Seller',
    buyerMode: 'শিল্পপ্রেমী (ক্রেতা) • Buyer',
    sellerRoleLabel: 'কারিগর • Seller',
    buyerRoleLabel: 'ক্রেতা • Buyer',
    switchMode: 'ভূমিকা পরিবর্তন করুন • Switch Role',
    listen: 'শুনুন • Listen',
    offlineBanner: 'ইন্টারনেট সংযোগ নেই • ফায়ারস্টোর অফলাইন ক্যাশে সক্রিয় (পুনরায় সংযোগে অটো-সিঙ্ক)',
    offlineRetry: 'যাচাই করুন • Check',
    onlineNotice: 'অনলাইন মোড সক্রিয় • Online',
    firestoreOnlineNotice: 'ক্লাউড ফায়ারস্টোর সক্রিয় • রিয়েল-টাইমে ডেটা সিঙ্ক হচ্ছে',
    firestoreSyncSubtext: 'ফায়ারস্টোর ডাটাবেস: ai-studio-kalasetu • রিয়েল-টাইম ক্লাউড সিঙ্ক',
    stepOf: 'ধাপ • Step',
    back: 'পেছনে যান • Back',
    continueBtn: 'এগিয়ে যান • Continue',
    close: 'বন্ধ করুন • Close',

    navMyShop: 'আমার দোকান • My Shop',
    navMarketplace: 'বাজার • Marketplace',
    navAddProduct: 'পণ্য যোগ করুন • Add Item',
    navProfile: 'কারিগর • Profile',
    navOffline: 'অফলাইন • Offline',
    navOnline: 'অনলাইন • Online',

    welcome: 'কলাসেতুতে আপনাকে স্বাগতম',
    welcomeTitle: 'কলাসেতুতে স্বাগতম • Welcome to KalaSetu',
    voiceFirstTitle: 'কণ্ঠস্বরে পরিচালিত • Zero Typing',
    voiceFirstSub: 'মুখের কথায় এবং ছবিতে নিজের শিল্প সারা দেশে পৌঁছে দিন',
    chooseLanguageTitle: 'ভাষা নির্বাচন করুন • Select Language',
    chooseRoleTitle: 'আপনি কে? • Select Role',
    roleArtisanTitle: 'আমি একজন কারিগর • Artisan (Seller)',
    roleArtisanDesc: 'আমি আমার হাতে তৈরি শিল্পকর্ম বিক্রি করতে চাই',
    roleBuyerTitle: 'আমি একজন ক্রেতা • Craft Lover (Buyer)',
    roleBuyerDesc: 'সরাসরি গ্রামীণ কারিগরদের থেকে প্রামাণ্য শিল্পকর্ম কিনুন',
    onboardingContinue: 'এগিয়ে যান • Continue',

    addProductTitle: 'নতুন পণ্য যোগ করুন • Add Product',
    stepIndicator: 'ধাপ ১ / ২ • Step 1 of 2',
    stepSub: 'ছবি এবং কণ্ঠস্বর • Photo & Voice',
    simulateErrorLabel: 'ত্রুটি পরীক্ষা • State Simulator',
    simulateErrorSub: 'কণ্ঠস্বর অস্পষ্ট হলে পরীক্ষা (Simulate Retry)',
    simulateErrorActive: 'ত্রুটি সক্রিয় • Error Active',
    simulateErrorTrigger: 'ত্রুটি দেখান • Show Error',
    photosHeading: 'শিল্পকর্মের ছবি • Craft Photos',
    photosCount1: '১ / ২ সম্পূর্ণ • 1 of 2 Done',
    photosCount2: '২ / ২ সম্পূর্ণ • 2 of 2 Done',
    mainPhotoTag: '✓ প্রধান ছবি • Main Photo',
    secondPhotoTag: '✓ দ্বিতীয় ছবি • Second Photo',
    secondPhotoDesc: 'সামনে বা পেছনের অংশ • Other Angle',
    addPhotoBtn: '[ + যোগ করুন ] • Add Photo',
    optimizingPhoto: 'গ্রামীণ নেটওয়ার্কের জন্য সংকোচন (<500KB)...',
    photoOptimizedBadge: 'ছবি অপ্টিমাইজড (<500KB) • Optimized',
    voiceGuideTitle: 'মুখে বলে জানান • Voice Guide',
    q1Name: '১. কি তৈরি করেছেন? • Product Name',
    q1Sub: 'পণ্যের নাম',
    q2Hours: '২. কত সময় লেগেছে? • Hours Made',
    q2Sub: 'পরিশ্রমের সময়',
    q3Material: '৩. কি উপকরণ ব্যবহার করেছেন? • Materials',
    q3Sub: 'মাটি / ধাতু / সুতো',
    speakDetailsTitle: 'কণ্ঠস্বরে বিবরণ দিন • Speak Details',
    speakDetailsSub: 'মাইক টিপে নির্ভয়ে কথা বলুন (টাইপ করার দরকার নেই)',
    recordedPill: 'রেকর্ড হয়েছে • Clear Voice Saved',
    retryErrorTitle: 'কণ্ঠস্বর বোঝা যায়নি, আবার বলুন • Please Retake',
    retryErrorDesc: 'শান্ত পরিবেশে মাইকের কাছে এসে স্পষ্ট করে বলুন।',
    retryVoiceBtn: 'আবার রেকর্ড করুন • Retry Voice',
    generateListingBtn: 'যাচাই করে এগিয়ে যান • Next',
    generateListingSub: 'AI তালিকা তৈরি করুন • Generate Listing',

    listingPreviewTitle: 'পণ্যের বিবরণ • Product Details',
    aiCraftedPill: 'AI প্রস্তুতকৃত বিবরণ • AI Crafted Listing',
    listenFullDetails: 'সম্পূর্ণ বিবরণ শুনুন • Listen Full Details',
    listenLanguageSub: 'বাংলায় শুনুন • Listen in Bengali',
    giVerified: '✓ GI সার্টিফাইড • GI Tagged',
    anglesVerified: '৩ কোণ যাচাইকৃত • 3 Angles Verified',
    hoursLabor: 'হাতের কাজের সময় • Crafting Hours',
    materialsBadge: 'উপকরণ • Materials',
    suggestedPriceTitle: 'প্রস্তাবিত মূল্য • Suggested Price',
    marketRateSub: 'বাজার দর অনুযায়ী • Market Standard',
    directArtisanIncome: 'সরাসরি আপনার আয় • Direct to You',
    packagingCut: 'প্যাকিং ও নিরাপত্তা • Packaging',
    speakToChangeTitle: 'বলে পরিবর্তন করুন • Voice Edit',
    speakToChangeSub: 'সংশোধনের জন্য মাইক টিপুন • Tap to Edit',
    publishToShopBtn: 'দোকানে প্রকাশ করুন • Publish to Shop',
    saveDraftBtn: 'খসড়া সংরক্ষণ • Save Draft',
    shareBtn: 'শেয়ার করুন • Share',

    myShopTitle: 'আমার দোকান • My Shop',
    namasteArtisan: 'রামদাস বাবু, নমস্কার! 🙏 • Welcome',
    verifiedArtisanBadge: 'কারিগর পরিচয়: যাচাইকৃত • Verified',
    audioGuideShop: 'প্রথম পণ্য কীভাবে যোগ করবেন শুনুন • Audio Guide',
    emptyShopToggle: '⇄ খালি দোকান • Empty View',
    activeShopToggle: '⇄ সক্রিয় দোকান • Active Shop',
    activeStats: 'সক্রিয় পণ্য • Active Items',
    totalSalesStats: 'মোট বিক্রি • Total Sales',
    queriesStats: 'বার্তা • Queries',
    myProductsTitle: 'আমার তৈরি পণ্য • My Craft Products',
    orderPendingBadge: 'অর্ডার এসেছে • 1 Order Pending',
    startPackingBtn: 'প্যাকিং শুরু করুন • Start Packing',
    emptyShopHeading: 'দোকানে এখনও কোনো পণ্য নেই • Shop is Empty',
    emptyShopMessage:
      'আপনার শিল্প দেশ-বিদেশে পৌঁছে দিন। মাত্র ২ মিনিটে ছবি ও কণ্ঠস্বর দিয়ে প্রথম পণ্য যোগ করুন।',
    micAddFirstItem: 'মাইক টিপে প্রথম পণ্য যোগ করুন • Add First Item',
    micJustSpeak: 'শুধু বলুন, বাকি কাজ কলাসেতু করবে ✨',
    threeStepsTitle: '৩টি সহজ ধাপ (Zero Typing): ২ মিনিট',
    step1PhotoTitle: '১. ছবি তুলুন • Take Photo',
    step1PhotoSub: '২টি স্পষ্ট ছবি',
    step2VoiceTitle: '২. কথা বলুন • Speak',
    step2VoiceSub: 'নিজের ভাষায়',
    step3LiveTitle: '৩. দোকান শুরু • Shop Live',
    step3LiveSub: 'সরাসরি বিক্রি',
    helpCenterTitle: 'সাহায্য দরকার? সহায়তা কেন্দ্র • Help Center',
    freeTag: 'বিনামূল্যে • Free',
    listenAudioInstructions: 'অডিও নির্দেশ শুনুন • Listen Instructions',
    listenAudioInstructionsSub: 'নিজের ভাষায় পুরো পদ্ধতিটি বুঝে নিন',
    callShilpMitra: 'শিল্প মিত্রের সাথে কথা বলুন • Call Shilp Mitra',
    callShilpMitraSub: 'টোল-ফ্রি ফোন সহায়তা (1800-000-123)',
    newProductMicPrompt: 'নতুন পণ্যের বিবরণ বলুন • Add by Voice',
    newProductMicSub: 'মাইক টিপুন • Tap mic',
    needHelpPrompt: 'সাহায্য চান? • Need Help?',
    needHelpSub: 'দোকান পরিচালনা পরামর্শ • Guidance',

    marketplaceTitle: 'কলাসেতু বাজার • Marketplace',
    searchPlaceholder: 'শিল্পকর্ম বা কারিগর খুঁজুন • Search...',
    filterAll: 'সব • All',
    filterGi: 'GI ট্যাগ • GI Tagged',
    filterPottery: 'মাটির শিল্প • Pottery',
    filterMetal: 'ধাতু শিল্প • Metal Craft',
    filterTextile: 'তাঁত বস্ত্র • Handloom',
    fairTradeBannerTitle: '১০০% সরাসরি কারিগরের থেকে • ০% মধ্যস্বত্বভোগী',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'কারিগরদের শ্রেষ্ঠ সৃষ্টি • Artisan Creations',
    resultsCount: 'পণ্য উপলব্ধ • items available',
    listenCraftStory: 'শিল্পের গল্প শুনুন • Craft Story',
    freeShipping: 'বিনামূল্যে ডেলিভারি • Free Shipping',
    chatWithArtisan: 'কারিগরের সাথে চ্যাট • Chat',
    whatsAppOrder: 'WhatsApp অর্ডার',
    audioTourTitle: 'কলাসেতু অডিও যাত্রা • Audio Tour',
    audioTourSub: 'শুনুন বাস্তার ও টেরাকোটা কারিগরদের প্রাচীন লোকগাঁথা',
    audioTourPrompt: 'জঙ্গলে মোমের ছাঁচে তৈরি চার হাজার বছরের ধাতব শিল্প...',
    listenFullAudioStory: 'সম্পূর্ণ গল্প শুনুন • Listen Tour',

    profileHeading: 'কারিগরের পরিচয় • Artisan Profile',
    supportBtn: 'সহায়তা করুন • Support',
    supportedBtn: 'সহায়তা সম্পন্ন ✓ • Supported',
    experienceBadge: 'বছরের অভিজ্ঞতা • Years Experience',
    generationBadge: 'প্রজন্মের ঐতিহ্য • Generation Lineage',
    hearArtisanStoryTitle: 'কারিগরের মুখে শুনুন • Hear Story',
    traditionTitle: 'ঐতিহ্য ও পবিত্র মাটি • Tradition & Earth',
    handcraftedWorksTitle: 'হাতে তৈরি শিল্পকর্ম • Handcrafted Works',
    directFromHomeSub: 'সরাসরি কারিগরের বাড়ি থেকে • Direct from Home',
    itemsAvailable: 'উপলব্ধ • Available',
    buyBtn: 'কিনুন • Buy Now',
    directConnectHeading: 'সরাসরি যোগাযোগ ও সমর্থন • Direct Connect',
    zeroMiddlemenGuarantee: 'মধ্যস্থতাহীন গ্যারান্টি • 100% Direct to Artisan',
    kilnSupportTitle: 'ভাটি নির্মাণ সহায়তা • Kiln Heritage Support',
    kilnSupportSub: 'নতুন ভাটি তৈরির অনুদান',
    kilnSupportBtn: '₹১০০ উপহার • Gift ₹100',
    kilnSupportDone: '✓ পাঠানো হয়েছে • Sent',
    directCallBtn: 'সরাসরি কল করুন • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp অর্ডার • Order on WhatsApp',
    guaranteeText:
      'কলাসেতু অঙ্গীকার: আপনার প্রদত্ত মূল্যের ১০০% সরাসরি কারিগরের জন-ধন ব্যাংক অ্যাকাউন্টে জমা হয়।',

    chatHeaderTitle: 'কারিগরের সাথে সরাসরি কথা • Direct Chat',
    chatSubText: 'সরাসরি যোগাযোগ • Zero Middlemen',
    chatTrustNotice: '🔒 ১০০% অর্থ সরাসরি আসল কারিগরের কাছে পৌঁছায়।',
    chatInputPlaceholder: 'বার্তা লিখুন বা বলুন...',
  },

  // 6. Tamil
  ta: {
    appName: 'கலாசேது • KalaSetu',
    artisanMode: 'கைவினைஞர் (விற்பனையாளர்) • Seller',
    buyerMode: 'கலை ஆர்வலர் (வாங்குபவர்) • Buyer',
    sellerRoleLabel: 'கைவினைஞர் • Seller',
    buyerRoleLabel: 'வாங்குபவர் • Buyer',
    switchMode: 'பங்கை மாற்றுக • Switch Role',
    listen: 'கேளுங்கள் • Listen',
    offlineBanner: 'இணையம் இல்லை • Firestore ஆஃப்லைன் கேச் இயக்கத்தில் உள்ளது (மீண்டும் இணைக்கும்போது தானியங்கி ஒத்திசைவு)',
    offlineRetry: 'சரிபார் • Check',
    onlineNotice: 'ஆன்லைன் முறை செயலில் உள்ளது • Online',
    firestoreOnlineNotice: 'கிளவுட் ஃபயர்ஸ்டோர் செயலில் உள்ளது • நிகழ்நேர தரவு ஒத்திசைவு',
    firestoreSyncSubtext: 'Firestore தரவுத்தளம்: ai-studio-kalasetu • நிகழ்நேர கிளவுட் ஒத்திசைவு',
    stepOf: 'படி • Step',
    back: 'பின்செல்ல • Back',
    continueBtn: 'தொடரவும் • Continue',
    close: 'மூடுக • Close',

    navMyShop: 'என் கடை • My Shop',
    navMarketplace: 'சந்தை • Marketplace',
    navAddProduct: 'பொருள் சேர்க்க • Add Item',
    navProfile: 'சுயவிவரம் • Profile',
    navOffline: 'ஆஃப்லைன் • Offline',
    navOnline: 'ஆன்லைன் • Online',

    welcome: 'கலைசேதுவுக்கு வரவேற்கிறோம்',
    welcomeTitle: 'கலாசேதுவுக்கு நல்வரவு • Welcome to KalaSetu',
    voiceFirstTitle: 'குரல் வழி பயன்பாடு • Zero Typing',
    voiceFirstSub: 'குரல் மற்றும் புகைப்படங்கள் மூலம் நாடு முழுவதும் விற்கவும்',
    chooseLanguageTitle: 'மொழியைத் தேர்ந்தெடுக்கவும் • Select Language',
    chooseRoleTitle: 'நீங்கள் யார்? • Select Role',
    roleArtisanTitle: 'நான் ஒரு கைவினைஞர் • Artisan (Seller)',
    roleArtisanDesc: 'எனது கைவினைப் பொருட்களை விற்க விரும்புகிறேன்',
    roleBuyerTitle: 'நான் ஒரு வாங்குபவர் • Buyer',
    roleBuyerDesc: 'கைவினைஞர்களிடமிருந்து நேரடியாக கலைப்பொருட்களை வாங்க',
    onboardingContinue: 'தொடரவும் • Continue',

    addProductTitle: 'புதிய பொருள் சேர்க்க • Add Product',
    stepIndicator: 'படி 1/2 • Step 1 of 2',
    stepSub: 'புகைப்படம் & குரல் • Photo & Voice',
    simulateErrorLabel: 'பிழை சோதனை • State Simulator',
    simulateErrorSub: 'குரல் தெளிவின்மை சோதனை (Simulate Retry)',
    simulateErrorActive: 'பிழை செயலில் உள்ளது • Error Active',
    simulateErrorTrigger: 'பிழையைக் காட்டு • Show Error',
    photosHeading: 'கைவினைப் படங்கள் • Craft Photos',
    photosCount1: '1 / 2 முடிந்தது • 1 of 2 Done',
    photosCount2: '2 / 2 முடிந்தது • 2 of 2 Done',
    mainPhotoTag: '✓ முதன்மை படம் • Main Photo',
    secondPhotoTag: '✓ இரண்டாம் படம் • Second Photo',
    secondPhotoDesc: 'முன் அல்லது பின் தோற்றம் • Other Angle',
    addPhotoBtn: '[ + சேர்க்க ] • Add Photo',
    optimizingPhoto: 'கிராமப்புற நெட்வொர்க்கிற்கான சுருக்கம் (<500KB)...',
    photoOptimizedBadge: 'படம் சுருக்கப்பட்டது (<500KB) • Optimized',
    voiceGuideTitle: 'குரல் மூலம் கூறவும் • Voice Guide',
    q1Name: '1. என்ன செய்தீர்கள்? • Product Name',
    q1Sub: 'பொருளின் பெயர்',
    q2Hours: '2. எத்தனை மணி நேரம் ஆனது? • Hours Made',
    q2Sub: 'உழைத்த நேரம்',
    q3Material: '3. பயன்படுத்திய பொருட்கள் என்ன? • Materials',
    q3Sub: 'மண் / உலோகம் / நூல்',
    speakDetailsTitle: 'குரலில் விவரிக்கவும் • Speak Details',
    speakDetailsSub: 'மைக் அழுத்தி தாராளமாகப் பேசுங்கள் (தட்டச்சு தேவையில்லை)',
    recordedPill: 'பதிவானது • Clear Voice Saved',
    retryErrorTitle: 'குரல் புரியவில்லை, மீண்டும் பேசுங்கள் • Please Retake',
    retryErrorDesc: 'அமைதியான சூழலில் மைக் அருகில் வந்து தெளிவாகப் பேசுங்கள்.',
    retryVoiceBtn: 'மீண்டும் பதிவு செய் • Retry Voice',
    generateListingBtn: 'சரிபார்த்து தொடரவும் • Next',
    generateListingSub: 'AI பட்டியல் உருவாக்கு • Generate Listing',

    listingPreviewTitle: 'பொருள் விவரங்கள் • Product Details',
    aiCraftedPill: 'AI மூலம் உருவான பட்டியல் • AI Crafted Listing',
    listenFullDetails: 'முழு விவரம் கேளுங்கள் • Listen Full Details',
    listenLanguageSub: 'தமிழில் கேளுங்கள் • Listen in Tamil',
    giVerified: '✓ GI சான்றளிக்கப்பட்டது • GI Tagged',
    anglesVerified: '3 கோணங்கள் பதிவு • 3 Angles Verified',
    hoursLabor: 'கைவேலை நேரம் • Crafting Hours',
    materialsBadge: 'பொருட்கள் • Materials',
    suggestedPriceTitle: 'பரிந்துரைக்கப்பட்ட விலை • Suggested Price',
    marketRateSub: 'சந்தை நிலவரப்படி • Market Standard',
    directArtisanIncome: 'நேரடியாக உங்கள் வருவாய் • Direct to You',
    packagingCut: 'பேக்கிங் & பாதுகாப்பு • Packaging',
    speakToChangeTitle: 'பேசி மாற்றவும் • Voice Edit',
    speakToChangeSub: 'மாற்ற மைக் அழுத்தவும் • Tap to Edit',
    publishToShopBtn: 'சந்தையில் வெளியிடவும் • Publish to Shop',
    saveDraftBtn: 'வரைவைச் சேமிக்க • Save Draft',
    shareBtn: 'பகிர் • Share',

    myShopTitle: 'என் கடை • My Shop',
    namasteArtisan: 'ராம்தாஸ் ஐயா, வணக்கம்! 🙏 • Welcome',
    verifiedArtisanBadge: 'கைவினைஞர் அடையாளம்: சரிபார்க்கப்பட்டது • Verified',
    audioGuideShop: 'முதல் பொருளைச் சேர்ப்பது எப்படி? • Audio Guide',
    emptyShopToggle: '⇄ வெற்று காட்சி • Empty View',
    activeShopToggle: '⇄ நேரடி கடை • Active Shop',
    activeStats: 'செயலில் உள்ளவை • Active Items',
    totalSalesStats: 'மொத்த விற்பனை • Total Sales',
    queriesStats: 'செய்திகள் • Queries',
    myProductsTitle: 'என் கைவினைப் பொருட்கள் • My Craft Products',
    orderPendingBadge: 'ஆர்டர் வந்துள்ளது • 1 Order Pending',
    startPackingBtn: 'பேக்கிங் தொடங்கவும் • Start Packing',
    emptyShopHeading: 'கடையில் இன்னும் பொருட்கள் இல்லை • Shop is Empty',
    emptyShopMessage:
      'உங்கள் கலையை உலகம் முழுவதும் கொண்டு செல்லுங்கள். 2 நிமிடங்களில் குரல் மற்றும் புகைப்படத்துடன் முதல் பொருளைச் சேர்க்கவும்.',
    micAddFirstItem: 'மைக் அழுத்தி முதல் பொருளைச் சேர்க்கவும் • Add First Item',
    micJustSpeak: 'நீங்கள் பேசுங்கள், மீதியை கலாசேது கவனிக்கும் ✨',
    threeStepsTitle: '3 எளிய படிகள்: 2 நிமிடங்கள்',
    step1PhotoTitle: '1. படம் எடுங்கள் • Take Photo',
    step1PhotoSub: '2 தெளிவான படங்கள்',
    step2VoiceTitle: '2. பேசுங்கள் • Speak',
    step2VoiceSub: 'உங்கள் தாய்மொழியில்',
    step3LiveTitle: '3. கடை தயார் • Shop Live',
    step3LiveSub: 'நேரடி விற்பனை',
    helpCenterTitle: 'உதவி தேவையா? உதவி மையம் • Help Center',
    freeTag: 'இலவசம் • Free',
    listenAudioInstructions: 'ஆடியோ வழிமுறைகள் • Listen Instructions',
    listenAudioInstructionsSub: 'உங்கள் மொழியில் முழு செயல்முறையையும் கேளுங்கள்',
    callShilpMitra: 'சில்ப மித்ராவுடன் பேசுங்கள் • Call Shilp Mitra',
    callShilpMitraSub: 'இலவச தொலைபேசி உதவி (1800-000-123)',
    newProductMicPrompt: 'குரல் மூலம் புதிய பொருளைச் சேர்க்க • Add by Voice',
    newProductMicSub: 'மைக் அழுத்தவும் • Tap mic',
    needHelpPrompt: 'உதவி தேவையா? • Need Help?',
    needHelpSub: 'கடை நிர்வாக ஆலோசனை • Guidance',

    marketplaceTitle: 'கலாசேது சந்தை • Marketplace',
    searchPlaceholder: 'கைவினைப்பொருள் அல்லது கலைஞரைத் தேடுங்கள்...',
    filterAll: 'அனைத்தும் • All',
    filterGi: 'GI குறிச்சொல் • GI Tagged',
    filterPottery: 'மண்பாண்டம் • Pottery',
    filterMetal: 'உலோகக் கைவினை • Metal Craft',
    filterTextile: 'கைத்தறி நெசவு • Handloom',
    fairTradeBannerTitle: '100% நேரடியாக கைவினைஞரிடமிருந்து • 0% இடைத்தரகர்கள்',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'கைவினைஞர்களின் படைப்புகள் • Artisan Creations',
    resultsCount: 'பொருட்கள் உள்ளன • items available',
    listenCraftStory: 'கைவினைக் கதை கேளுங்கள் • Craft Story',
    freeShipping: 'இலவச டெலிவரி • Free Shipping',
    chatWithArtisan: 'கைவினைஞருடன் அரட்டையடிக்க • Chat',
    whatsAppOrder: 'WhatsApp ஆர்டர்',
    audioTourTitle: 'கலாசேது ஆடியோ பயணம் • Audio Tour',
    audioTourSub: 'பாரம்பரிய கைவினைஞர்களின் கதைகளைக் கேளுங்கள்',
    audioTourPrompt: 'காட்டில் தேன் மெழுகால் வார்க்கப்படும் பாரம்பரிய கலை...',
    listenFullAudioStory: 'முழு கதை கேளுங்கள் • Listen Tour',

    profileHeading: 'கைவினைஞர் சுயவிவரம் • Artisan Profile',
    supportBtn: 'ஆதரவு அளி • Support',
    supportedBtn: 'ஆதரவு அளிக்கப்பட்டது ✓ • Supported',
    experienceBadge: 'வருட அனுபவம் • Years Experience',
    generationBadge: 'தலைமுறை பாரம்பரியம் • Generation Lineage',
    hearArtisanStoryTitle: 'கைவினைஞர் குரலில் கேளுங்கள் • Hear Story',
    traditionTitle: 'பாரம்பரியமும் புனித மண்ணும் • Tradition',
    handcraftedWorksTitle: 'கைவினைப் படைப்புகள் • Handcrafted Works',
    directFromHomeSub: 'நேரடியாக கைவினைஞர் இல்லத்திலிருந்து • Direct from Home',
    itemsAvailable: 'கிடைக்கின்றன • Available',
    buyBtn: 'வாங்க • Buy Now',
    directConnectHeading: 'நேரடி தொடர்பு & ஆதரவு • Direct Connect',
    zeroMiddlemenGuarantee: 'இடைத்தரகர் இல்லை • 100% Direct to Artisan',
    kilnSupportTitle: 'சூளை அமைப்பு உதவி • Kiln Heritage Support',
    kilnSupportSub: 'புதிய சூளை அமைக்க நன்கொடை',
    kilnSupportBtn: '₹100 பரிசு • Gift ₹100',
    kilnSupportDone: '✓ அனுப்பப்பட்டது • Sent',
    directCallBtn: 'நேரடி அழைப்பு • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ஆர்டர் • Order on WhatsApp',
    guaranteeText:
      'கலாசேது உறுதிமொழி: நீங்கள் செலுத்தும் தொகையில் 100% நேரடியாக கைவினைஞரின் வங்கி கணக்கில் சேர்கிறது.',

    chatHeaderTitle: 'நேரடி உரையாடல் • Direct Chat',
    chatSubText: 'இடைத்தரகர் இல்லை • Zero Middlemen',
    chatTrustNotice: '🔒 முழுத் தொகையும் உண்மையான கைவினைஞருக்குச் செல்கிறது.',
    chatInputPlaceholder: 'செய்தி எழுதவும் அல்லது பேசவும்...',
  },

  // 7. Odia
  or: {
    appName: 'କଳାସେତୁ • KalaSetu',
    artisanMode: 'କାରିଗର (ବିକ୍ରେତା) • Seller',
    buyerMode: 'କଳାପ୍ରେମୀ (ଗ୍ରାହକ) • Buyer',
    sellerRoleLabel: 'କାରିଗର • Seller',
    buyerRoleLabel: 'ଗ୍ରାହକ • Buyer',
    switchMode: 'ଭୂମିକା ବଦଳାନ୍ତୁ • Switch Role',
    listen: 'ଶୁଣନ୍ତୁ • Listen',
    offlineBanner: 'ଇଣ୍ଟରନେଟ୍ ବନ୍ଦ ଅଛି • Firestore ଅଫଲାଇନ୍ କ୍ୟାଚ୍ ସକ୍ରିୟ (ପୁନଃସଂଯୋଗରେ ଅଟୋ-ସିଙ୍କ୍)',
    offlineRetry: 'ଯାଞ୍ଚ କରନ୍ତୁ • Check',
    onlineNotice: 'ଅନଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ • Online',
    firestoreOnlineNotice: 'କ୍ଲାଉଡ୍ ଫାୟାରଷ୍ଟୋର୍ ସକ୍ରିୟ • ଡାଟା ରିଅଲ୍-ଟାଇମ୍ ସିଙ୍କ୍ ହେଉଛି',
    firestoreSyncSubtext: 'Firestore ଡାଟାବେସ୍: ai-studio-kalasetu • ରିଅଲ୍-ଟାଇମ୍ କ୍ଲାଉଡ୍ ସିଙ୍କ୍',
    stepOf: 'ପଦକ୍ଷେପ • Step',
    back: 'ପଛକୁ ଯାଆନ୍ତୁ • Back',
    continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ • Continue',
    close: 'ବନ୍ଦ କରନ୍ତୁ • Close',

    navMyShop: 'ମୋ ଦୋକାନ • My Shop',
    navMarketplace: 'ହାଟ • Marketplace',
    navAddProduct: 'ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ • Add Item',
    navProfile: 'କାରିଗର • Profile',
    navOffline: 'ଅଫଲାଇନ୍ • Offline',
    navOnline: 'ଅନଲାଇନ୍ • Online',

    welcome: 'କଳାସେତୁକୁ ସ୍ୱାଗତ',
    welcomeTitle: 'କଳାସେତୁରେ ଆପଣଙ୍କୁ ସ୍ୱାଗତ • Welcome to KalaSetu',
    voiceFirstTitle: 'କଥା କହି ସହଜରେ କାମ • Zero Typing',
    voiceFirstSub: 'କଥା ଏବଂ ଫଟୋ ସାହାଯ୍ୟରେ ସାରା ଦେଶରେ ବିକ୍ରୟ କରନ୍ତୁ',
    chooseLanguageTitle: 'ନିଜ ଭାଷା ବାଛନ୍ତୁ • Select Language',
    chooseRoleTitle: 'ଆପଣ କିଏ? • Select Role',
    roleArtisanTitle: 'ମୁଁ ଜଣେ କାରିଗର • Artisan (Seller)',
    roleArtisanDesc: 'ମୋର ହସ୍ତତନ୍ତ ସାମଗ୍ରୀ ବିକ୍ରି କରିବାକୁ ଚାହୁଁଛି',
    roleBuyerTitle: 'ମୁଁ ଜଣେ ଗ୍ରାହକ • Buyer',
    roleBuyerDesc: 'ସିଧାସଳଖ ଗ୍ରାମୀଣ କାରିଗରଙ୍କଠାରୁ ପ୍ରାମାଣିକ କଳା କିଣନ୍ତୁ',
    onboardingContinue: 'ଆଗକୁ ବଢ଼ନ୍ତୁ • Continue',

    addProductTitle: 'ନୂଆ ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ • Add Product',
    stepIndicator: 'ପଦକ୍ଷେପ ୧ / ୨ • Step 1 of 2',
    stepSub: 'ଫଟୋ ଏବଂ କଥା • Photo & Voice',
    simulateErrorLabel: 'ତ୍ରୁଟି ଅନୁକରଣ • State Simulator',
    simulateErrorSub: 'ସ୍ୱର ଅସ୍ପଷ୍ଟ ହେଲେ ପରୀକ୍ଷା (Simulate Retry)',
    simulateErrorActive: 'ତ୍ରୁଟି ସକ୍ରିୟ • Error Active',
    simulateErrorTrigger: 'ତ୍ରୁଟି ଦେଖାନ୍ତୁ • Show Error',
    photosHeading: 'ହସ୍ତଶିଳ୍ପର ଫଟୋ • Craft Photos',
    photosCount1: '୧ / ୨ ସମ୍ପୂର୍ଣ୍ଣ • 1 of 2 Done',
    photosCount2: '୨ / ୨ ସମ୍ପୂର୍ଣ୍ଣ • 2 of 2 Done',
    mainPhotoTag: '✓ ମୁଖ୍ୟ ଫଟୋ • Main Photo',
    secondPhotoTag: '✓ ଦ୍ୱିତୀୟ ଫଟୋ • Second Photo',
    secondPhotoDesc: 'ଆଗ କିମ୍ବା ପଛ ଭାଗ • Other Angle',
    addPhotoBtn: '[ + ଯୋଡ଼ନ୍ତୁ ] • Add Photo',
    optimizingPhoto: 'ଗ୍ରାମୀଣ ନେଟୱାର୍କ ପାଇଁ ଫଟୋ ସଂକୋଚନ (<500KB)...',
    photoOptimizedBadge: 'ଫଟୋ ପ୍ରସ୍ତୁତ (<500KB) • Optimized',
    voiceGuideTitle: 'କହିକରି ଜଣାନ୍ତୁ • Voice Guide',
    q1Name: '୧. କଣ ତିଆରି କରିଛନ୍ତି? • Product Name',
    q1Sub: 'ନାମ',
    q2Hours: '୨. କେତେ ସମୟ ଲାଗିଲା? • Hours Made',
    q2Sub: 'କାର୍ଯ୍ୟ ସମୟ',
    q3Material: '୩. କେଉଁ ଉପାଦାନ ବ୍ୟବହାର ହୋଇଛି? • Materials',
    q3Sub: 'ମାଟି / ଧାତୁ / ସୂତା',
    speakDetailsTitle: 'କଥା କହି ବର୍ଣ୍ଣନା କରନ୍ତୁ • Speak Details',
    speakDetailsSub: 'ମାଇକ୍ ଚିପି କୁହନ୍ତୁ (ଟାଇପ୍ କରିବା ଦରକାର ନାହିଁ)',
    recordedPill: 'ରେକର୍ଡ ହୋଇଗଲା • Clear Voice Saved',
    retryErrorTitle: 'ସ୍ୱର ବୁଝାପଡ଼ିଲା ନାହିଁ, ପୁଣି କୁହନ୍ତୁ • Please Retake',
    retryErrorDesc: 'ନିରବ ସ୍ଥାନରେ ମାଇକ୍ ପାଖରେ ଆସି ସ୍ପଷ୍ଟ ଭାବେ କୁହନ୍ତୁ।',
    retryVoiceBtn: 'ପୁନର୍ବାର ରେକର୍ଡ କରନ୍ତୁ • Retry Voice',
    generateListingBtn: 'ଯାଞ୍ଚ କରି ଆଗକୁ ବଢ଼ନ୍ତୁ • Next',
    generateListingSub: 'AI ତାଲିକା ପ୍ରସ୍ତୁତ କରନ୍ତୁ • Generate Listing',

    listingPreviewTitle: 'ସାମଗ୍ରୀ ବିବରଣୀ • Product Details',
    aiCraftedPill: 'AI ଦ୍ୱାରା ପ୍ରସ୍ତୁତ ତାଲିକା • AI Crafted Listing',
    listenFullDetails: 'ପୂରା ବିବରଣୀ ଶୁଣନ୍ତୁ • Listen Full Details',
    listenLanguageSub: 'ଓଡ଼ିଆରେ ଶୁଣନ୍ତୁ • Listen in Odia',
    giVerified: '✓ GI ପ୍ରମାଣିତ • GI Tagged',
    anglesVerified: '୩ଟି କୋଣ ଯାଞ୍ଚ • 3 Angles Verified',
    hoursLabor: 'ଶ୍ରମ ସମୟ • Crafting Hours',
    materialsBadge: 'ଉପାଦାନ • Materials',
    suggestedPriceTitle: 'ପରାମର୍ଶିତ ମୂଲ୍ୟ • Suggested Price',
    marketRateSub: 'ବଜାର ଦର ଅନୁଯାୟୀ • Market Standard',
    directArtisanIncome: 'ସିଧାସଳଖ ଆପଣଙ୍କ ଆୟ • Direct to You',
    packagingCut: 'ପ୍ୟାକିଂ ଓ ସୁରକ୍ଷା • Packaging',
    speakToChangeTitle: 'କହିକରି ବଦଳାନ୍ତୁ • Voice Edit',
    speakToChangeSub: 'ସଂଶୋଧନ ପାଇଁ ମାଇକ୍ ଚିପନ୍ତୁ • Tap to Edit',
    publishToShopBtn: 'ଦୋକାନରେ ପ୍ରକାଶ କରନ୍ତୁ • Publish to Shop',
    saveDraftBtn: 'ଡ୍ରାଫ୍ଟ ସାଇତନ୍ତୁ • Save Draft',
    shareBtn: 'ଶେୟାର କରନ୍ତୁ • Share',

    myShopTitle: 'ମୋ ଦୋକାନ • My Shop',
    namasteArtisan: 'ରାମଦାସ ଆଜ୍ଞା, ନମସ୍କାର! 🙏 • Welcome',
    verifiedArtisanBadge: 'କାରିଗର ପରିଚୟ: ପ୍ରମାଣିତ • Verified',
    audioGuideShop: 'ପ୍ରଥମ ସାମଗ୍ରୀ କିପରି ଯୋଡ଼ିବେ ଶୁଣନ୍ତୁ • Audio Guide',
    emptyShopToggle: '⇄ ଖାଲି ଦୋକାନ • Empty View',
    activeShopToggle: '⇄ ସକ୍ରିୟ ଦୋକାନ • Active Shop',
    activeStats: 'ସକ୍ରିୟ ସାମଗ୍ରୀ • Active Items',
    totalSalesStats: 'ମୋଟ ବିକ୍ରି • Total Sales',
    queriesStats: 'ବାର୍ତ୍ତା • Queries',
    myProductsTitle: 'ମୋ ହସ୍ତଶିଳ୍ପ • My Craft Products',
    orderPendingBadge: 'ଅର୍ଡର ଆସିଛି • 1 Order Pending',
    startPackingBtn: 'ପ୍ୟାକିଂ ଆରମ୍ଭ କରନ୍ତୁ • Start Packing',
    emptyShopHeading: 'ଦୋକାନରେ କୌଣସି ସାମଗ୍ରୀ ନାହିଁ • Shop is Empty',
    emptyShopMessage:
      'ଆପଣଙ୍କ କଳାକୁ ସାରା ବିଶ୍ୱରେ ପହଞ୍ଚାନ୍ତୁ। ମାତ୍ର ୨ ମିନିଟରେ ଫଟୋ ଓ ସ୍ୱର ସାହାଯ୍ୟରେ ପ୍ରଥମ ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ।',
    micAddFirstItem: 'ମାଇକ୍ ଚିପି ପ୍ରଥମ ସାମଗ୍ରୀ ଯୋଡ଼ନ୍ତୁ • Add First Item',
    micJustSpeak: 'ଖାଲି କୁହନ୍ତୁ, ବାକି ସବୁ କଳାସେତୁ କରିବ ✨',
    threeStepsTitle: '୩ଟି ସହଜ ପଦକ୍ଷେପ: ୨ ମିନିଟ',
    step1PhotoTitle: '୧. ଫଟୋ ଉଠାନ୍ତୁ • Take Photo',
    step1PhotoSub: '୨ଟି ସ୍ପଷ୍ଟ ଫଟୋ',
    step2VoiceTitle: '୨. କଥା କୁହନ୍ତୁ • Speak',
    step2VoiceSub: 'ନିଜ ଭାଷାରେ',
    step3LiveTitle: '୩. ଦୋକାନ ଚାଲୁ • Shop Live',
    step3LiveSub: 'ସିଧା ବିକ୍ରି',
    helpCenterTitle: 'ସାହାଯ୍ୟ ଦରକାର? ସହାୟତା କେନ୍ଦ୍ର • Help Center',
    freeTag: 'ମାଗଣା • Free',
    listenAudioInstructions: 'ଅଡିଓ ନିର୍ଦ୍ଦେଶ ଶୁଣନ୍ତୁ • Listen Instructions',
    listenAudioInstructionsSub: 'ନିଜ ଭାଷାରେ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରକ୍ରିୟା ବୁଝନ୍ତୁ',
    callShilpMitra: 'ଶିଳ୍ପ ମିତ୍ରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ • Call Shilp Mitra',
    callShilpMitraSub: 'ଟୋଲ-ଫ୍ରି ଫୋନ୍ ସହାୟତା (1800-000-123)',
    newProductMicPrompt: 'ନୂଆ ସାମଗ୍ରୀ ବିଷୟରେ କୁହନ୍ତୁ • Add by Voice',
    newProductMicSub: 'ମାଇକ୍ ଚିପନ୍ତୁ • Tap mic',
    needHelpPrompt: 'ସାହାଯ୍ୟ ଦରକାର? • Need Help?',
    needHelpSub: 'ଦୋକାନ ପରିଚାଳନା ପରାମର୍ଶ • Guidance',

    marketplaceTitle: 'କଳାସେତୁ ହାଟ • Marketplace',
    searchPlaceholder: 'ଶିଳ୍ପ ବା କାରିଗର ଖୋଜନ୍ତୁ • Search...',
    filterAll: 'ସବୁ • All',
    filterGi: 'GI ଟ୍ୟାଗ୍ • GI Tagged',
    filterPottery: 'ମାଟି ଶିଳ୍ପ • Pottery',
    filterMetal: 'ଧାତୁ ଶିଳ୍ପ • Metal Craft',
    filterTextile: 'ହସ୍ତତନ୍ତ ବସ୍ତ୍ର • Handloom',
    fairTradeBannerTitle: '୧୦୦% ସିଧା କାରିଗରଙ୍କଠାରୁ • ୦% ମଧ୍ୟସ୍ଥି',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'କାରିଗରଙ୍କ ସୃଷ୍ଟି • Artisan Creations',
    resultsCount: 'ସାମଗ୍ରୀ ଉପଲବ୍ଧ • items available',
    listenCraftStory: 'ଶିଳ୍ପ କଥା ଶୁଣନ୍ତୁ • Craft Story',
    freeShipping: 'ମାଗଣା ଡେଲିଭରୀ • Free Shipping',
    chatWithArtisan: 'କାରିଗରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ • Chat',
    whatsAppOrder: 'WhatsApp ଅର୍ଡର',
    audioTourTitle: 'କଳାସେତୁ ଅଡିଓ ଯାତ୍ରା • Audio Tour',
    audioTourSub: 'ଶୁଣନ୍ତୁ ଗ୍ରାମୀଣ ଶିଳ୍ପକାରଙ୍କ ପାରମ୍ପରିକ ଲୋକକଥା',
    audioTourPrompt: 'ମହୁମାଛି ମହମରେ ଢଳା ପ୍ରାଚୀନ ଧାତୁ କଳା...',
    listenFullAudioStory: 'ପୂରା କଥା ଶୁଣନ୍ତୁ • Listen Tour',

    profileHeading: 'କାରିଗର ପରିଚୟ • Artisan Profile',
    supportBtn: 'ସହଯୋଗ କରନ୍ତୁ • Support',
    supportedBtn: 'ସହଯୋଗ କରାଗଲା ✓ • Supported',
    experienceBadge: 'ବର୍ଷର ଅନୁଭବ • Years Experience',
    generationBadge: 'ପିଢ଼ିର ଐତିହ୍ୟ • Generation Lineage',
    hearArtisanStoryTitle: 'କାରିଗରଙ୍କ ମୁହଁରୁ ଶୁଣନ୍ତୁ • Hear Story',
    traditionTitle: 'ପରମ୍ପରା ଓ ପବିତ୍ର ମାଟି • Tradition & Earth',
    handcraftedWorksTitle: 'ହସ୍ତନିର୍ମିତ କଳାକୃତି • Handcrafted Works',
    directFromHomeSub: 'ସିଧା କାରିଗରଙ୍କ ଘରୁ • Direct from Home',
    itemsAvailable: 'ଉପଲବ୍ଧ • Available',
    buyBtn: 'କିଣନ୍ତୁ • Buy Now',
    directConnectHeading: 'ସିଧାସଳଖ ସମ୍ପର୍କ • Direct Connect',
    zeroMiddlemenGuarantee: 'ମଧ୍ୟସ୍ଥିହୀନ ପ୍ରତିଶ୍ରୁତି • 100% Direct to Artisan',
    kilnSupportTitle: 'ଭାଟି ନିର୍ମାଣ ସହାୟତା • Kiln Heritage Support',
    kilnSupportSub: 'ନୂଆ ଭାଟି ତିଆରି ପାଇଁ ଅନୁଦାନ',
    kilnSupportBtn: '₹୧୦୦ ଉପହାର • Gift ₹100',
    kilnSupportDone: '✓ ପଠାଗଲା • Sent',
    directCallBtn: 'ସିଧା କଲ୍ କରନ୍ତୁ • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ଅର୍ଡର • Order on WhatsApp',
    guaranteeText:
      'କଳାସେତୁ ପ୍ରତିଶ୍ରୁତି: ଆପଣ ଦେଉଥିବା ଟଙ୍କାର ୧୦୦% ସିଧା କାରିଗରଙ୍କ ବ୍ୟାଙ୍କ ଖାତାରେ ଜମା ହୁଏ।',

    chatHeaderTitle: 'ସିଧାସଳଖ କଥାବାର୍ତ୍ତା • Direct Chat',
    chatSubText: 'ମଧ୍ୟସ୍ଥି ନାହାନ୍ତି • Zero Middlemen',
    chatTrustNotice: '🔒 ସମ୍ପୂର୍ଣ୍ଣ ଟଙ୍କା ସିଧାସଳଖ ଅସଲ କାରିଗରଙ୍କ ପାଖକୁ ଯାଏ।',
    chatInputPlaceholder: 'ବାର୍ତ୍ତା ଲେଖନ୍ତୁ ବା କୁହନ୍ତୁ...',
  },

  // 8. Marathi
  mr: {
    appName: 'कलासेतू • KalaSetu',
    artisanMode: 'कारीगर (विक्रेता) • Seller',
    buyerMode: 'कलाप्रेमी (ग्राहक) • Buyer',
    sellerRoleLabel: 'कारीगर • Seller',
    buyerRoleLabel: 'ग्राहक • Buyer',
    switchMode: 'भूमिका बदला • Switch Role',
    listen: 'ऐका • Listen',
    offlineBanner: 'इंटरनेट बंद आहे • Firestore ऑफलाइन मोड • पुन्हा कनेक्ट झाल्यावर ऑटो-सिंक',
    offlineRetry: 'तपासा • Check',
    onlineNotice: 'ऑनलाइन मोड सक्रिय • Online',
    firestoreOnlineNotice: 'क्लाउड फायरस्टोअर सक्रिय • डेटा रिअल-टाइम सिंक होत आहे',
    firestoreSyncSubtext: 'फायरस्टोअर डेटाबेस: ai-studio-kalasetu • रिअल-टाइम क्लाउड सिंक',
    stepOf: 'टप्पा • Step',
    back: 'मागे जा • Back',
    continueBtn: 'पुढे चला • Continue',
    close: 'बंद करा • Close',

    navMyShop: 'माझे दुकान • My Shop',
    navMarketplace: 'बाजारपेठ • Marketplace',
    navAddProduct: 'वस्तू जोडा • Add Item',
    navProfile: 'कारीगर • Profile',
    navOffline: 'ऑफलाइन • Offline',
    navOnline: 'ऑनलाइन • Online',

    welcome: 'कलासेतू मध्ये आपले स्वागत आहे',
    welcomeTitle: 'कलासेतूमध्ये आपले स्वागत आहे • Welcome to KalaSetu',
    voiceFirstTitle: 'बोलून काम करा • Zero Typing',
    voiceFirstSub: 'आवाज आणि फोटोंच्या साहाय्याने आपली कला देशभर विका',
    chooseLanguageTitle: 'आपली भाषा निवडा • Select Language',
    chooseRoleTitle: 'आपण कोण आहात? • Select Role',
    roleArtisanTitle: 'मी एक कारागीर आहे • Artisan (Seller)',
    roleArtisanDesc: 'मला माझ्या हाताने बनवलेल्या वस्तू विकायच्या आहेत',
    roleBuyerTitle: 'मी ग्राहक आहे • Craft Lover (Buyer)',
    roleBuyerDesc: 'थेट ग्रामीण कारागिरांकडून अस्सल हस्तकला खरेदी करा',
    onboardingContinue: 'पुढे चला • Continue',

    addProductTitle: 'नवीन वस्तू जोडा • Add Product',
    stepIndicator: 'टप्पा १ / २ • Step 1 of 2',
    stepSub: 'फोटो आणि आवाज • Photo & Voice',
    simulateErrorLabel: 'त्रुटी चाचणी • State Simulator',
    simulateErrorSub: 'आवाज स्पष्ट नसल्यास चाचणी (Simulate Retry)',
    simulateErrorActive: 'त्रुटी सक्रिय • Error Active',
    simulateErrorTrigger: 'त्रुटी दाखवा • Show Error',
    photosHeading: 'हस्तशिल्पाचे फोटो • Craft Photos',
    photosCount1: '१ / २ पूर्ण • 1 of 2 Done',
    photosCount2: '२ / २ पूर्ण • 2 of 2 Done',
    mainPhotoTag: '✓ मुख्य फोटो • Main Photo',
    secondPhotoTag: '✓ दुसरा फोटो • Second Photo',
    secondPhotoDesc: 'पुढील किंवा मागील भाग • Other Angle',
    addPhotoBtn: '[ + जोडा ] • Add Photo',
    optimizingPhoto: 'ग्रामीण नेटवर्कसाठी फोटो आकार कमी करत आहे (<500KB)...',
    photoOptimizedBadge: 'फोटो अनुकूलित (<500KB) • Optimized',
    voiceGuideTitle: 'बोलून माहिती द्या • Voice Guide',
    q1Name: '१. काय बनवले? • Product Name',
    q1Sub: 'वस्तूचे नाव',
    q2Hours: '२. किती वेळ लागला? • Hours Made',
    q2Sub: 'कामाचे तास',
    q3Material: '३. कोणते साहित्य वापरले? • Materials',
    q3Sub: 'माती / धातू / धागे',
    speakDetailsTitle: 'आवाजात वर्णन करा • Speak Details',
    speakDetailsSub: 'माईक दाबा आणि न घाबरता बोला (टाइपिंगची गरज नाही)',
    recordedPill: 'रेकॉर्ड झाले • Clear Voice Saved',
    retryErrorTitle: 'आवाज समजला नाही, कृपया पुन्हा बोला • Please Retake',
    retryErrorDesc: 'शांत वातावरणात माईकजवळ येऊन स्पष्टपणे बोला.',
    retryVoiceBtn: 'पुन्हा रेकॉर्ड करा • Retry Voice',
    generateListingBtn: 'तपासून पुढे जा • Next',
    generateListingSub: 'AI सूची तयार करा • Generate Listing',

    listingPreviewTitle: 'उत्पादन तपशील • Product Details',
    aiCraftedPill: 'AI द्वारे तयार सूची • AI Crafted Listing',
    listenFullDetails: 'पूर्ण माहिती ऐका • Listen Full Details',
    listenLanguageSub: 'मराठीत ऐका • Listen in Marathi',
    giVerified: '✓ GI प्रमाणित • GI Tagged',
    anglesVerified: '३ कोन नोंदवले • 3 Angles Verified',
    hoursLabor: 'कामाचे तास • Crafting Hours',
    materialsBadge: 'साहित्य • Materials',
    suggestedPriceTitle: 'शिफारस केलेली किंमत • Suggested Price',
    marketRateSub: 'बाजार भावानुसार • Market Standard',
    directArtisanIncome: 'थेट आपले उत्पन्न • Direct to You',
    packagingCut: 'पॅकिंग व सुरक्षा • Packaging',
    speakToChangeTitle: 'बोलून बदला • Voice Edit',
    speakToChangeSub: 'बदलासाठी माईक दाबा • Tap to Edit',
    publishToShopBtn: 'बाजारात प्रकाशित करा • Publish to Shop',
    saveDraftBtn: 'मसुदा सेव्ह करा • Save Draft',
    shareBtn: 'शेअर करा • Share',

    myShopTitle: 'माझे दुकान • My Shop',
    namasteArtisan: 'रामदास जी, नमस्कार! 🙏 • Welcome',
    verifiedArtisanBadge: 'कारागीर ओळख: प्रमाणित • Verified',
    audioGuideShop: 'पहिली वस्तू कशी जोडायची ते ऐका • Audio Guide',
    emptyShopToggle: '⇄ रिकामे दुकान • Empty View',
    activeShopToggle: '⇄ सक्रिय दुकान • Active Shop',
    activeStats: 'सक्रिय वस्तू • Active Items',
    totalSalesStats: 'एकूण विक्री • Total Sales',
    queriesStats: 'संदेश • Queries',
    myProductsTitle: 'माझी हस्तकला उत्पादने • My Craft Products',
    orderPendingBadge: 'ऑर्डर मिळाली • 1 Order Pending',
    startPackingBtn: 'पॅकिंग सुरू करा • Start Packing',
    emptyShopHeading: 'दुकानात अजून वस्तू नाहीत • Shop is Empty',
    emptyShopMessage:
      'आपली कला देशभर पोहोचवा. फक्त २ मिनिटांत फोटो आणि आवाजाने पहिली वस्तू जोडा.',
    micAddFirstItem: 'माईक दाबा आणि पहिली वस्तू जोडा • Add First Item',
    micJustSpeak: 'फक्त बोला, बाकी सर्व कलासेतू करेल ✨',
    threeStepsTitle: '३ सोपे टप्पे: २ मिनिटे',
    step1PhotoTitle: '१. फोटो काढा • Take Photo',
    step1PhotoSub: '२ स्पष्ट फोटो',
    step2VoiceTitle: '२. बोला • Speak',
    step2VoiceSub: 'आपल्या भाषेत',
    step3LiveTitle: '३. दुकान सुरू • Shop Live',
    step3LiveSub: 'थेट विक्री',
    helpCenterTitle: 'मदत हवी आहे? मदत केंद्र • Help Center',
    freeTag: 'विनामूल्य • Free',
    listenAudioInstructions: 'ऑडिओ सूचना ऐका • Listen Instructions',
    listenAudioInstructionsSub: 'आपल्या भाषेत संपूर्ण प्रक्रिया समजून घ्या',
    callShilpMitra: 'शिल्प मित्राशी बोला • Call Shilp Mitra',
    callShilpMitraSub: 'टोल-फ्री फोन मदत (1800-000-123)',
    newProductMicPrompt: 'नवीन वस्तूबद्दल बोला • Add by Voice',
    newProductMicSub: 'माईक दाबा • Tap mic',
    needHelpPrompt: 'मदत हवी आहे? • Need Help?',
    needHelpSub: 'दुकान व्यवस्थापन मार्गदर्शन • Guidance',

    marketplaceTitle: 'कलासेतू बाजार • Marketplace',
    searchPlaceholder: 'शिल्प किंवा कारागीर शोधा • Search...',
    filterAll: 'सर्व • All',
    filterGi: 'GI टॅग • GI Tagged',
    filterPottery: 'मातीकाम • Pottery',
    filterMetal: 'धातूकाम • Metal Craft',
    filterTextile: 'हातमाग वस्त्रे • Handloom',
    fairTradeBannerTitle: '१००% थेट कारागिराकडून • ०% दलाल',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission',
    artisanFeedHeading: 'कारागिरांच्या कलाकृती • Artisan Creations',
    resultsCount: 'वस्तू उपलब्ध • items available',
    listenCraftStory: 'शिल्प कथा ऐका • Craft Story',
    freeShipping: 'मोफत शिपिंग • Free Shipping',
    chatWithArtisan: 'कारागिराशी बोला • Chat',
    whatsAppOrder: 'WhatsApp ऑर्डर',
    audioTourTitle: 'कलासेतू ऑडिओ प्रवास • Audio Tour',
    audioTourSub: 'बस्तर आणि पारंपरिक कारागिरांच्या लोककथा ऐका',
    audioTourPrompt: 'जंगलात मधमाश्यांच्या मेणाने ओतलेली प्राचीन धातू कला...',
    listenFullAudioStory: 'पूर्ण कथा ऐका • Listen Tour',

    profileHeading: 'कारागीर प्रोफाइल • Artisan Profile',
    supportBtn: 'सहकार्य करा • Support',
    supportedBtn: 'सहकार्य केले ✓ • Supported',
    experienceBadge: 'वर्षांचा अनुभव • Years Experience',
    generationBadge: 'पिढ्यांचा वारसा • Generation Lineage',
    hearArtisanStoryTitle: 'कारागिराच्या तोंडून ऐका • Hear Story',
    traditionTitle: 'परंपरा आणि पवित्र माती • Tradition & Earth',
    handcraftedWorksTitle: 'हस्तनिर्मित कलाकृती • Handcrafted Works',
    directFromHomeSub: 'थेट कारागिराच्या घरातून • Direct from Home',
    itemsAvailable: 'उपलब्ध • Available',
    buyBtn: 'खरेदी करा • Buy Now',
    directConnectHeading: 'थेट संवाद आणि पाठिंबा • Direct Connect',
    zeroMiddlemenGuarantee: 'दलालीमुक्त हमी • 100% Direct to Artisan',
    kilnSupportTitle: 'भट्टी उभारणी साहाय्य • Kiln Heritage Support',
    kilnSupportSub: 'नवीन भट्टीसाठी योगदान',
    kilnSupportBtn: '₹१०० भेट • Gift ₹100',
    kilnSupportDone: '✓ पाठवले • Sent',
    directCallBtn: 'थेट फोन करा • Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp ऑर्डर • Order on WhatsApp',
    guaranteeText:
      'कलासेतू हमी: आपण दिलेल्या रकमेतील १००% थेट कारागिराच्या जन-धन खात्यात जमा होतात.',

    chatHeaderTitle: 'थेट कारागिराशी संवाद • Direct Chat',
    chatSubText: 'थेट संपर्क • Zero Middlemen',
    chatTrustNotice: '🔒 संपूर्ण रक्कम थेट मूळ कारागिराला मिळते.',
    chatInputPlaceholder: 'संदेश लिहा किंवा बोला...',
  },

  // 9. English
  en: {
    appName: 'KalaSetu',
    artisanMode: 'Artisan (Seller)',
    buyerMode: 'Craft Patron (Buyer)',
    sellerRoleLabel: 'Artisan (Seller)',
    buyerRoleLabel: 'Buyer (Patron)',
    switchMode: 'Switch Role',
    listen: 'Listen',
    offlineBanner: 'No Internet • Firestore Offline Cache Active • Auto-syncs to Cloud on reconnect',
    offlineRetry: 'Check Connection',
    onlineNotice: 'Online Mode Active',
    firestoreOnlineNotice: 'Cloud Firestore Active • Real-time Data Synced',
    firestoreSyncSubtext: 'Firestore Database: ai-studio-kalasetu • Real-time Cloud Sync',
    stepOf: 'Step',
    back: 'Back',
    continueBtn: 'Continue',
    close: 'Close',

    navMyShop: 'My Shop',
    navMarketplace: 'Marketplace',
    navAddProduct: 'Add Item',
    navProfile: 'Profile',
    navOffline: 'Offline',
    navOnline: 'Online',

    welcome: 'Welcome to KalaSetu',
    welcomeTitle: 'Welcome to KalaSetu',
    voiceFirstTitle: 'Voice-First Platform • Zero Typing',
    voiceFirstSub: 'Sell your crafts nationwide using only your voice and camera',
    chooseLanguageTitle: 'Select Your Language',
    chooseRoleTitle: 'Who are you?',
    roleArtisanTitle: 'I am an Artisan (Seller)',
    roleArtisanDesc: 'I want to sell my handmade crafts directly',
    roleBuyerTitle: 'I am a Craft Patron (Buyer)',
    roleBuyerDesc: 'Buy authentic crafts directly from indigenous artisans',
    onboardingContinue: 'Continue',

    addProductTitle: 'Add New Product',
    stepIndicator: 'Step 1 of 2',
    stepSub: 'Photo & Voice Details',
    simulateErrorLabel: 'State Simulator',
    simulateErrorSub: 'Test voice retry state',
    simulateErrorActive: 'Error Active',
    simulateErrorTrigger: 'Show Error State',
    photosHeading: 'Craft Photos',
    photosCount1: '1 of 2 Complete',
    photosCount2: '2 of 2 Complete',
    mainPhotoTag: '✓ Main Photo',
    secondPhotoTag: '✓ Second Photo',
    secondPhotoDesc: 'Back or front angle',
    addPhotoBtn: '[ + Add Photo ]',
    optimizingPhoto: 'Optimizing for rural network (<500KB)...',
    photoOptimizedBadge: 'Optimized (<500KB)',
    voiceGuideTitle: 'Voice Guide',
    q1Name: '1. What did you make?',
    q1Sub: 'Product Name',
    q2Hours: '2. How many hours?',
    q2Sub: 'Time spent crafting',
    q3Material: '3. What materials?',
    q3Sub: 'Clay / Metal / Thread',
    speakDetailsTitle: 'Speak Your Details',
    speakDetailsSub: 'Tap microphone and speak freely (No typing needed)',
    recordedPill: 'Voice Saved Clearly',
    retryErrorTitle: "Couldn't understand, please speak again",
    retryErrorDesc: 'Please move closer to the microphone in a quiet room and speak again.',
    retryVoiceBtn: 'Retry Voice Recording',
    generateListingBtn: 'Check & Continue',
    generateListingSub: 'Generate AI Listing',

    listingPreviewTitle: 'Product Details',
    aiCraftedPill: 'Magic AI Crafted Listing',
    listenFullDetails: 'Listen to Full Details',
    listenLanguageSub: 'Listen in English',
    giVerified: '✓ GI Certified',
    anglesVerified: '3 Angles Verified',
    hoursLabor: 'Crafting Hours',
    materialsBadge: 'Raw Materials',
    suggestedPriceTitle: 'Suggested Price',
    marketRateSub: 'Based on market standards',
    directArtisanIncome: 'Direct to You',
    packagingCut: 'Protective Packaging',
    speakToChangeTitle: 'Speak to Edit',
    speakToChangeSub: 'Tap mic to adjust price or details',
    publishToShopBtn: 'Publish to Shop & Marketplace',
    saveDraftBtn: 'Save Draft',
    shareBtn: 'Share',

    myShopTitle: 'My Shop',
    namasteArtisan: 'Welcome, Ramdas Ji! 🙏',
    verifiedArtisanBadge: 'Artisan ID: Verified',
    audioGuideShop: 'Listen: How to add your first item',
    emptyShopToggle: '⇄ Empty Shop View',
    activeShopToggle: '⇄ Active Shop View',
    activeStats: 'Active Items',
    totalSalesStats: 'Total Sales',
    queriesStats: 'Queries',
    myProductsTitle: 'My Craft Products',
    orderPendingBadge: '1 Order Pending',
    startPackingBtn: 'Start Packing',
    emptyShopHeading: 'No items in your shop yet',
    emptyShopMessage:
      'Reach craft patrons nationwide. Add your first product in 2 minutes using only photos and voice.',
    micAddFirstItem: 'Tap mic to add your first product',
    micJustSpeak: 'Just speak, KalaSetu takes care of everything ✨',
    threeStepsTitle: '3 Easy Steps (Zero Typing): 2 mins',
    step1PhotoTitle: '1. Take Photos',
    step1PhotoSub: '2 clear photos',
    step2VoiceTitle: '2. Speak',
    step2VoiceSub: 'In your language',
    step3LiveTitle: '3. Shop Live',
    step3LiveSub: 'Direct sales',
    helpCenterTitle: 'Need help? Support Center',
    freeTag: 'Toll-Free',
    listenAudioInstructions: 'Listen to Audio Instructions',
    listenAudioInstructionsSub: 'Understand the process in your mother tongue',
    callShilpMitra: 'Call Shilp Mitra Helpline',
    callShilpMitraSub: 'Toll-free instant phone assistance (1800-000-123)',
    newProductMicPrompt: 'Describe a new product by voice',
    newProductMicSub: 'Tap mic and speak',
    needHelpPrompt: 'Need help managing shop?',
    needHelpSub: 'Step-by-step guidance',

    marketplaceTitle: 'KalaSetu Marketplace',
    searchPlaceholder: 'Search craft or artisan...',
    filterAll: 'All',
    filterGi: 'GI Tagged',
    filterPottery: 'Pottery & Clay',
    filterMetal: 'Lost-Wax Metal',
    filterTextile: 'Handloom Weaves',
    fairTradeBannerTitle: '100% Direct from Artisan • 0% Middlemen',
    fairTradeBannerSub: 'Direct Fair Trade • Zero Commission Guarantee',
    artisanFeedHeading: 'Masterpieces by Rural Artisans',
    resultsCount: 'craft items available',
    listenCraftStory: 'Listen Craft Story',
    freeShipping: 'Free Shipping',
    chatWithArtisan: 'Chat with Artisan',
    whatsAppOrder: 'WhatsApp Order',
    audioTourTitle: 'KalaSetu Audio Journey',
    audioTourSub: 'Hear how Bastar and Gorakhpur masters shape indigenous heritage',
    audioTourPrompt: 'Cast with natural beeswax in the heart of tribal forests...',
    listenFullAudioStory: 'Listen Full Tour',

    profileHeading: 'Artisan Profile',
    supportBtn: 'Support Artisan',
    supportedBtn: 'Supported ✓',
    experienceBadge: 'Years Experience',
    generationBadge: 'Generation Heritage',
    hearArtisanStoryTitle: "Hear in Artisan's Voice",
    traditionTitle: 'Tradition & Sacred Clay',
    handcraftedWorksTitle: 'Handcrafted Creations',
    directFromHomeSub: "Direct from Artisan's Home",
    itemsAvailable: 'Available',
    buyBtn: 'Buy Now',
    directConnectHeading: 'Direct Connection & Fair Trade',
    zeroMiddlemenGuarantee: '100% Direct to Artisan Guarantee',
    kilnSupportTitle: 'Craft Heritage Support',
    kilnSupportSub: 'Contribution for new traditional kiln',
    kilnSupportBtn: 'Gift ₹100',
    kilnSupportDone: '✓ Sent',
    directCallBtn: 'Direct Call',
    whatsAppCraftOrderBtn: 'WhatsApp Craft Order',
    guaranteeText:
      'KalaSetu Commitment: 100% of your payment is directly transferred to the artisan’s Jan Dhan bank account.',

    chatHeaderTitle: 'Direct Artisan Chat',
    chatSubText: 'Zero Middlemen',
    chatTrustNotice: '🔒 100% of your payment goes directly to the verified maker.',
    chatInputPlaceholder: 'Type or speak your message...',
  },
};

// Helper to get text for given language code with fallback to Hindi
export function getTranslations(lang: string): TranslationStrings {
  const code = (lang || 'hi').toLowerCase() as SupportedLanguage;
  const base = TRANSLATIONS[code] || TRANSLATIONS['hi'];
  return {
    ...base,
    replacePhoto: base.replacePhoto || 'फ़ोटो बदलें • Change Photo',
    secondPhotoBadge: base.secondPhotoBadge || base.secondPhotoTag,
    addPhotoSlot: base.addPhotoSlot || base.addPhotoBtn,
    voiceDetailsTitle: base.voiceDetailsTitle || base.speakDetailsTitle,
    promptWhatMade: base.promptWhatMade || base.q1Sub,
    promptHowLong: base.promptHowLong || base.q2Sub,
    promptMaterials: base.promptMaterials || base.q3Sub,
    recordedVoice: base.recordedVoice || base.recordedPill,
    rerecordPrompt: base.rerecordPrompt || 'फिर से बोलें • Re-record',
    retryTitle: base.retryTitle || base.retryErrorTitle,
    retryMessage: base.retryMessage || base.retryErrorDesc,
    retryBtn: base.retryBtn || base.retryVoiceBtn,
    generateAiListing: base.generateAiListing || base.generateListingBtn,
    artisanIncomeLabel: base.artisanIncomeLabel || base.directArtisanIncome,
    craftHoursPrompt: base.craftHoursPrompt || base.hoursLabor,
    voiceEditPrompt: base.voiceEditPrompt || base.speakToChangeSub,
    aiPreviewTitle: base.aiPreviewTitle || base.listingPreviewTitle,
    aiCraftedBadge: base.aiCraftedBadge || base.aiCraftedPill,
    listenDialectNotice: base.listenDialectNotice || base.listenLanguageSub,
    giTagBadge: base.giTagBadge || base.giVerified,
    editTitle: base.editTitle || 'बदलें • Edit',
    suggestedPriceLabel: base.suggestedPriceLabel || base.suggestedPriceTitle,
    packagingLogisticsLabel: base.packagingLogisticsLabel || base.packagingCut,
    voiceEditBtn: base.voiceEditBtn || base.speakToChangeTitle,
    publishSuccessNotice: base.publishSuccessNotice || 'दुकान में प्रकाशित हुआ • Published to Shop',
    craftYearsExperience: base.craftYearsExperience || base.experienceBadge,
    artisanProfileTitle: base.artisanProfileTitle || base.profileHeading,
    supportReceived: base.supportReceived || base.supportedBtn,
    listenArtisanStory: base.listenArtisanStory || base.hearArtisanStoryTitle,
    artisanArtworksTitle: base.artisanArtworksTitle || base.handcraftedWorksTitle,
    productsCountSuffix: base.productsCountSuffix || base.itemsAvailable,
    buyProductBtn: base.buyProductBtn || base.buyBtn,
    directConnectTitle: base.directConnectTitle || base.directConnectHeading,
    zeroCommissionBadge: base.zeroCommissionBadge || base.zeroMiddlemenGuarantee,
    whatsappOrder: base.whatsappOrder || base.whatsAppOrder,
    craftArtworksTitle: base.craftArtworksTitle || base.artisanFeedHeading,
    listenStoryBtn: base.listenStoryBtn || base.listenCraftStory,
    freeShippingBadge: base.freeShippingBadge || base.freeShipping,
    audioTourListen: base.audioTourListen || base.listenFullAudioStory,
    closeModal: base.closeModal || base.close,
    step1Of2: base.step1Of2 || base.stepIndicator,
    photosLabel: base.photosLabel || base.photosHeading,
    compressingImage: base.compressingImage || base.optimizingPhoto,
    photoAddedCompressed: base.photoAddedCompressed || base.photoOptimizedBadge,
    voiceRecordedNotice: base.voiceRecordedNotice || base.recordedPill,
    simulateErrorBtn: base.simulateErrorBtn || base.simulateErrorTrigger,
    photoCompressed: base.photoCompressed || base.photoOptimizedBadge,
    mainPhotoBadge: base.mainPhotoBadge || base.mainPhotoTag,

    // Login fallbacks
    loginTitle: base.loginTitle || 'कलासेतु में प्रवेश • Sign In to KalaSetu',
    loginSubtitle: base.loginSubtitle || 'शिल्पकार या कला-प्रेमी के रूप में जुड़ें • Connect as Artisan or Art Lover',
    loginWithPhone: base.loginWithPhone || 'फ़ोन नंबर (OTP) • Phone Number',
    loginWithEmail: base.loginWithEmail || 'ईमेल / Gmail • Email',
    loginWithGoogle: base.loginWithGoogle || 'Google से साइन इन करें • Sign in with Google',
    phoneLabel: base.phoneLabel || 'मोबाइल नंबर • 10-Digit Mobile',
    phonePlaceholder: base.phonePlaceholder || '98765 43210',
    invalidPhoneError: base.invalidPhoneError || 'कृपया मान्य 10-अंकों का भारतीय मोबाइल नंबर दर्ज करें (6, 7, 8 या 9 से शुरू) • Enter valid 10-digit mobile number starting with 6-9',
    sendOtp: base.sendOtp || 'सत्यापन कोड (OTP) भेजें • Send OTP',
    enterOtp: base.enterOtp || '4-अंकों का OTP दर्ज करें • Enter 4-digit OTP',
    otpPlaceholder: base.otpPlaceholder || '• • • •',
    resendOtp: base.resendOtp || 'OTP फिर से भेजें • Resend OTP',
    verifyAndLogin: base.verifyAndLogin || 'सत्यापित करके प्रवेश करें • Verify & Sign In',
    emailLabel: base.emailLabel || 'ईमेल पता • Email Address (Gmail)',
    emailPlaceholder: base.emailPlaceholder || 'shilpkar@gmail.com',
    invalidEmailError: base.invalidEmailError || 'कृपया मान्य ईमेल पता दर्ज करें • Please enter a valid email address',
    passwordLabel: base.passwordLabel || 'पासवर्ड • Password',
    passwordPlaceholder: base.passwordPlaceholder || 'कम से कम 6 अक्षर • Min. 6 characters',
    invalidPasswordError: base.invalidPasswordError || 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए • Password must be at least 6 characters',
    nameLabel: base.nameLabel || 'आपका नाम • Your Name',
    namePlaceholder: base.namePlaceholder || 'जैसे: पार्वती देवी • e.g., Parvati Devi',
    continueWithGoogle: base.continueWithGoogle || 'Google खाते से जारी रखें • Continue with Google',
    logout: base.logout || 'लॉग आउट • Sign Out',
    loggedInAs: base.loggedInAs || 'सत्यापित खाता • Logged In As',
    guestMode: base.guestMode || 'अतिथि मोड • Guest Mode',
    switchAccount: base.switchAccount || 'खाता बदलें • Switch Account',
    welcome: base.welcome || base.welcomeTitle || 'कलासेतु में आपका स्वागत है • Welcome to KalaSetu',
    googleAccountDialogTitle: base.googleAccountDialogTitle || 'Google खाता चुनें • Choose a Google Account',
  };
}

// Direct dictionary export for components accessing translations[language].welcome
export const translations: Record<string, TranslationStrings> = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return getTranslations(prop);
    },
  }
);

// Map language ID to speech synthesis BCP-47 language tag
export function getSpeechLangCode(lang: string): string {
  switch (lang) {
    case 'te':
    case 'gondi':
    case 'lambadi':
      return 'te-IN';
    case 'bn':
      return 'bn-IN';
    case 'ta':
      return 'ta-IN';
    case 'mr':
      return 'mr-IN';
    case 'en':
      return 'en-IN';
    case 'hi':
    default:
      return 'hi-IN';
  }
}
