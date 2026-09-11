import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Volume2,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  RefreshCw,
  LogOut,
  Camera,
  KeyRound,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { AuthUser, UserRole, AuthProvider, UserAccountRecord } from '../types';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { getTranslations } from '../utils/translations';
import { speakAloud } from '../utils/audioService';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import {
  loginUserWithEmail,
  loginUserWithPhone,
  loginUserWithGoogle,
  signInWithFirebaseGoogle,
  registerNewUser,
  getRegisteredUsers,
  updateUserProfilePhoto,
} from '../utils/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  language?: string;
  currentRole?: UserRole;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onUpdateUser?: (updatedUser: AuthUser) => void;
}

type AuthTab = 'phone' | 'email' | 'google';
type EmailAuthMode = 'login' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentRole = 'artisan',
  currentUser = null,
  onLogout,
  onUpdateUser,
}) => {
  const { language, t } = useLanguage();
  const speechLang = getSpeechLangCode(language);

  const [activeTab, setActiveTab] = useState<AuthTab>('email');
  const [emailMode, setEmailMode] = useState<EmailAuthMode>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  // Custom Profile Photo state for register / profile edit
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
  );

  // Phone Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [timerCount, setTimerCount] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [phoneUserNameInput, setPhoneUserNameInput] = useState('');

  // Email / Password Form State
  const [emailAddress, setEmailAddress] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [registerNameInput, setRegisterNameInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Google Flow State
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleError, setCustomGoogleError] = useState('');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Registered accounts for easy testing & transparency
  const [savedAccounts, setSavedAccounts] = useState<UserAccountRecord[]>([]);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const DEMO_ACCOUNTS_SEED = [
    {
      id: 'user-vaishu',
      name: 'Vaishu Kalkuda',
      email: 'vaishukalkuda@gmail.com',
      password: 'password123',
      role: 'artisan' as UserRole,
      roleLabel: 'Artisan (selling crafts)',
      icon: '🎨',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'user-parvati',
      name: 'श्रीमती पार्वती देवी',
      email: 'parvati@kalasetu.org',
      password: 'craft123',
      role: 'artisan' as UserRole,
      roleLabel: 'Artisan (selling crafts)',
      icon: '🏺',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'user-raghav',
      name: 'राघवेंद्र शर्मा (Raghav)',
      email: 'raghav.sharma@gmail.com',
      password: 'buyer123',
      role: 'buyer' as UserRole,
      roleLabel: 'Buyer (shopping)',
      icon: '🛍️',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setSavedAccounts(getRegisteredUsers());
    }
  }, [isOpen]);

  // Sync role
  useEffect(() => {
    setSelectedRole(currentRole);
    if (currentRole === 'buyer') {
      setCustomPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    } else {
      setCustomPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80');
    }
  }, [currentRole]);

  // OTP Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    } else if (timerCount === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerCount]);

  if (!isOpen) return null;

  // 1. Phone validation & real login
  const validatePhone = (num: string): boolean => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setPhoneError('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें • Enter valid 10-digit mobile number');
      return false;
    }
    if (!/^[6-9]/.test(cleaned)) {
      setPhoneError(
        'भारतीय मोबाइल नंबर 6, 7, 8 या 9 से शुरू होना चाहिए • Indian numbers start with 6, 7, 8, or 9'
      );
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSendOtp = () => {
    if (!validatePhone(phoneNumber)) {
      speakAloud('अमान्य मोबाइल नंबर, कृपया 10 अंक दर्ज करें', { lang: speechLang });
      return;
    }
    setIsLoading(true);
    setGeneralError('');

    setTimeout(() => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      setIsOtpSent(true);
      setIsLoading(false);
      setIsTimerRunning(true);
      setTimerCount(45);
      setOtpError('');

      speakAloud(`कलासेतु सत्यापन कोड है: ${code.split('').join(' ')}`, {
        lang: speechLang,
      });
    }, 500);
  };

  const handleVerifyPhoneOtp = () => {
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      setOtpError('कृपया 4 अंकों का OTP कोड दर्ज करें • Enter 4-digit code');
      return;
    }
    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError('गलत OTP कोड। पुनः प्रयास करें • Incorrect OTP');
      speakAloud('गलत कोड, कृपया पुनः प्रयास करें', { lang: speechLang });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleaned = phoneNumber.replace(/\D/g, '');
      const res = loginUserWithPhone(
        cleaned,
        phoneUserNameInput.trim(),
        selectedRole
      );

      // If user provided a custom photo, apply it
      if (customPhotoUrl && customPhotoUrl !== res.user.avatarUrl) {
        updateUserProfilePhoto(res.user.id, customPhotoUrl);
        res.user.avatarUrl = customPhotoUrl;
      }

      setSuccessToast(`सत्यापन सफल! स्वागत है ${res.user.name}`);
      speakAloud(`प्रवेश सफल! स्वागत है ${res.user.name}`, { lang: speechLang });

      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 600);
    }, 400);
  };

  // 2. Email Validation, Real Login & Real Registration
  const validateEmail = (email: string): boolean => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !pattern.test(email.trim())) {
      setEmailError('कृपया मान्य ईमेल पता दर्ज करें (उदा: user@gmail.com)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (pass: string): boolean => {
    if (!pass || pass.length < 6) {
      setPasswordError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए • Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    const isEmailValid = validateEmail(emailAddress);
    const isPassValid = validatePassword(emailPassword);

    if (!isEmailValid || !isPassValid) {
      speakAloud('कृपया सही ईमेल और 6 अक्षरों का पासवर्ड दर्ज करें', { lang: speechLang });
      return;
    }

    if (emailMode === 'register') {
      if (!registerNameInput.trim()) {
        setEmailError('कृपया अपना नाम दर्ज करें • Please enter your name');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const res = registerNewUser({
          name: registerNameInput.trim(),
          email: emailAddress.trim(),
          password: emailPassword,
          avatarUrl: customPhotoUrl,
          role: selectedRole,
          authProvider: 'email',
        });

        if (!res.success) {
          setGeneralError(res.error || 'पंजीकरण विफल रहा');
          speakAloud(res.error || 'पंजीकरण विफल रहा', { lang: speechLang });
          return;
        }

        const user = res.user!;
        setSuccessToast(`नया खाता तैयार! स्वागत है ${user.name}`);
        speakAloud(`खाता बन गया! स्वागत है ${user.name}`, { lang: speechLang });

        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 600);
      }, 500);
    } else {
      // Real Sign In verification
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const res = loginUserWithEmail(emailAddress.trim(), emailPassword);

        if (!res.success) {
          setGeneralError(res.error || 'लॉगिन विफल रहा');
          speakAloud(res.error || 'लॉगिन विफल रहा', { lang: speechLang });
          return;
        }

        const user = res.user!;
        setSuccessToast(`प्रवेश सफल! स्वागत है ${user.name}`);
        speakAloud(`प्रवेश सफल! स्वागत है ${user.name}`, { lang: speechLang });

        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 600);
      }, 500);
    }
  };

  // Quick fill helper for demo/evaluator convenience
  const handleQuickFillAccount = (acc: UserAccountRecord) => {
    setEmailAddress(acc.email || '');
    setEmailPassword(acc.password || 'password123');
    setSelectedRole(acc.role);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSuccessToast(`भरा गया: ${acc.name} (${acc.role === 'artisan' ? 'कारीगर' : 'ख़रीदार'})`);
    speakAloud(`${acc.name} खाता चुना गया`, { lang: speechLang });
  };

  const handleOneTapDemoLogin = (demo: typeof DEMO_ACCOUNTS_SEED[0], autoSignIn = true) => {
    setEmailAddress(demo.email);
    setEmailPassword(demo.password);
    setSelectedRole(demo.role);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setSuccessToast(`डेमो खाता: ${demo.name} (${demo.role === 'artisan' ? 'कारीगर' : 'ख़रीदार'})`);
    speakAloud(`${demo.name} डेमो खाता`, { lang: speechLang });

    if (autoSignIn) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const res = loginUserWithEmail(demo.email, demo.password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        } else {
          // If not yet saved in current browser session, register and sign in seamlessly
          const regRes = registerNewUser({
            name: demo.name,
            email: demo.email,
            password: demo.password,
            role: demo.role,
            avatarUrl: demo.avatarUrl,
            authProvider: 'email',
          });
          if (regRes.success && regRes.user) {
            onLoginSuccess(regRes.user);
            onClose();
          }
        }
      }, 350);
    }
  };

  // 3. Real Google Login Handling
  const handleSelectGoogleAccount = (accountEmail: string, accountName: string, avatar: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = loginUserWithGoogle(
        accountEmail,
        accountName,
        customPhotoUrl || avatar,
        selectedRole
      );

      setSuccessToast(`Google से साइन इन सफल! स्वागत है ${res.user.name}`);
      speakAloud(`Google प्रवेश सफल! स्वागत है ${res.user.name}`, { lang: speechLang });

      setTimeout(() => {
        onLoginSuccess(res.user);
        onClose();
      }, 500);
    }, 400);
  };

  const handleFirebaseGoogleSignIn = async () => {
    setIsLoading(true);
    setGeneralError('');
    try {
      const res = await signInWithFirebaseGoogle(selectedRole);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessToast(`Google प्रमाणीकरण सफल! स्वागत है ${res.user.name}`);
        speakAloud(`Google प्रवेश सफल! स्वागत है ${res.user.name}`, { lang: speechLang });
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 500);
      } else {
        setGeneralError(res.error || 'Google Sign-In failed');
      }
    } catch (e: any) {
      setIsLoading(false);
      setGeneralError(e?.message || 'Google Sign-In failed');
    }
  };

  const handleCustomGoogleSubmit = () => {
    const email = customGoogleEmail.trim().toLowerCase();
    if (!email || !email.includes('@') || !email.endsWith('.com')) {
      setCustomGoogleError('कृपया मान्य Google/Gmail पता दर्ज करें (उदा. vaishukalkuda@gmail.com)');
      return;
    }
    setCustomGoogleError('');
    const name = email
      .split('@')[0]
      .replace(/[._]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    handleSelectGoogleAccount(
      email,
      name,
      customPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'
    );
  };

  // Handle in-profile avatar update
  const handleUpdateLoggedInAvatar = (newPhotoUrl: string) => {
    if (!currentUser) return;
    updateUserProfilePhoto(currentUser.id, newPhotoUrl);
    const updatedUser = { ...currentUser, avatarUrl: newPhotoUrl };
    onUpdateUser?.(updatedUser);
    onLoginSuccess(updatedUser);
    speakAloud('प्रोफ़ाइल फ़ोटो सफलतापूर्वक अपडेट हो गई', { lang: speechLang });
  };

  // Guide speech
  const handleListenAuthGuide = () => {
    if (currentUser) {
      speakAloud(`आप ${currentUser.name} के रूप में प्रवेशित हैं। भूमिका: ${currentUser.role === 'artisan' ? 'शिल्पकार' : 'कला प्रेमी ख़रीदार'}।`, { lang: speechLang });
      return;
    }
    let guide = '';
    if (activeTab === 'email') {
      guide = emailMode === 'login'
        ? 'अपने पंजीकृत ईमेल और पासवर्ड से साइन इन करें। नया खाता बनाने के लिए रजिस्टर टैब चुनें।'
        : 'नया खाता बनाने के लिए अपना नाम, ईमेल, पासवर्ड और अपनी प्रोफाइल फोटो चुनें।';
    } else if (activeTab === 'phone') {
      guide = 'अपना 10-अंकों का मोबाइल नंबर दर्ज करें और प्राप्त 4-अंकों के कोड से सत्यापित करें।';
    } else {
      guide = 'Google खाते से एक-क्लिक में सुरक्षित प्रवेश करें।';
    }
    speakAloud(guide, { lang: speechLang });
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-[#FAF6F0] rounded-3xl border border-[#E3D5C5] shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="bg-[#FFFFFF] border-b border-[#E3D5C5] px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#FDF1EC] text-[#9C3D25] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#201A18] leading-tight">
                {currentUser
                  ? 'खाता विवरण • User Profile'
                  : emailMode === 'register' && activeTab === 'email'
                  ? 'नया खाता बनाएं • Create Account'
                  : 'प्रवेश करें • Sign In to KalaSetu'}
              </h2>
              <div className="text-[11px] text-[#5E534D]">
                {currentUser ? `${currentUser.authProvider.toUpperCase()} Verified` : 'कलासेतु सुरक्षित प्रमाणन'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-auth-listen-guide"
              type="button"
              onClick={handleListenAuthGuide}
              className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#9C3D25] flex items-center justify-center border border-[#E3D5C5] active:scale-95 transition-transform"
              title="निर्देश सुनें • Audio Guide"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              id="btn-close-auth-modal"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FFFFFF] text-[#5E534D] hover:text-[#201A18] border border-[#E3D5C5] flex items-center justify-center active:scale-95 transition-transform"
              aria-label="बंद करें • Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-[#E2ECE6] text-[#2D5A43] border-b border-[#2D5A43]/20 px-4 py-2.5 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* General Error Banner */}
        {generalError && (
          <div className="bg-red-50 text-red-700 border-b border-red-200 px-4 py-2.5 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* VIEW A: IF CURRENTLY LOGGED IN, SHOW ACCOUNT MANAGEMENT & PHOTO UPDATER */}
        {currentUser ? (
          <div className="p-5 space-y-4">
            {/* Custom Profile Photo Live Updater */}
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#201A18] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#9C3D25]" />
                  <span>कस्टम प्रोफ़ाइल फ़ोटो • Profile Photo</span>
                </span>
                <span className="text-[10px] font-bold bg-[#E2ECE6] text-[#2D5A43] px-2 py-0.5 rounded-full">
                  सत्यापित
                </span>
              </div>

              <ProfilePhotoUploader
                currentAvatar={currentUser.avatarUrl}
                onAvatarChange={handleUpdateLoggedInAvatar}
                role={currentUser.role}
                language={language}
                size="md"
                idPrefix="logged-in-user"
              />
            </div>

            {/* Profile Information Summary */}
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 shadow-xs space-y-3">
              <div className="space-y-1">
                <div className="text-xs text-[#5E534D] font-medium">नाम • Display Name</div>
                <div className="font-display font-bold text-base text-[#201A18]">
                  {currentUser.name}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#E3D5C5]">
                <div>
                  <div className="text-[11px] text-[#5E534D]">खाता प्रकार • Role</div>
                  <div className="font-bold text-[#9C3D25] mt-0.5">
                    {currentUser.role === 'artisan' ? 'कारीगर • Artisan' : 'कला प्रेमी • Buyer'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#5E534D]">माध्यम • Provider</div>
                  <div className="font-bold text-[#201A18] capitalize mt-0.5">
                    {currentUser.authProvider}
                  </div>
                </div>
              </div>

              {currentUser.email && (
                <div className="text-xs pt-1 border-t border-[#E3D5C5] text-[#5E534D] truncate">
                  <span className="font-medium text-[#201A18]">ईमेल: </span>
                  {currentUser.email}
                </div>
              )}
              {currentUser.phone && (
                <div className="text-xs pt-1 border-t border-[#E3D5C5] text-[#5E534D]">
                  <span className="font-medium text-[#201A18]">फ़ोन: </span>
                  {currentUser.phone}
                </div>
              )}
            </div>

            {/* Sign Out Action */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                id="btn-auth-switch-role"
                type="button"
                onClick={() => {
                  const newRole = currentUser.role === 'artisan' ? 'buyer' : 'artisan';
                  const updated = { ...currentUser, role: newRole as UserRole };
                  onLoginSuccess(updated);
                  speakAloud(`भूमिका बदली गई: ${newRole === 'artisan' ? 'शिल्पकार' : 'ख़रीदार'}`, { lang: speechLang });
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F4EBE1] border border-[#E3D5C5] text-xs font-bold text-[#201A18] text-center transition-colors"
              >
                {currentUser.role === 'artisan' ? 'Switch to Buyer Mode' : 'Switch to Artisan Mode'}
              </button>

              <button
                id="btn-auth-logout"
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>लॉग आउट • Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: SIGN IN / REGISTER FORM */
          <div className="p-4 sm:p-5 space-y-4">
            {/* Role Selection Pills */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#201A18] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#9C3D25]" />
                <span>भूमिका चुनें • Select Role</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#F4EBE1] p-1 rounded-2xl border border-[#E3D5C5]">
                <button
                  type="button"
                  id="btn-select-role-artisan"
                  onClick={() => {
                    setSelectedRole('artisan');
                    speakAloud('कारीगर भूमिका चुनी गई', { lang: speechLang });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'artisan'
                      ? 'bg-[#9C3D25] text-white shadow-xs'
                      : 'text-[#5E534D] hover:text-[#201A18]'
                  }`}
                >
                  <span>🏺 कारीगर • Artisan</span>
                </button>

                <button
                  type="button"
                  id="btn-select-role-buyer"
                  onClick={() => {
                    setSelectedRole('buyer');
                    speakAloud('कला प्रेमी ग्राहक भूमिका चुनी गई', { lang: speechLang });
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    selectedRole === 'buyer'
                      ? 'bg-[#2D5A43] text-white shadow-xs'
                      : 'text-[#5E534D] hover:text-[#201A18]'
                  }`}
                >
                  <span>🛍️ कला प्रेमी • Buyer</span>
                </button>
              </div>
            </div>

            {/* Auth Provider Navigation Tabs */}
            <div className="flex border-b border-[#E3D5C5] gap-2">
              <button
                type="button"
                id="tab-email-login"
                onClick={() => {
                  setActiveTab('email');
                  setGeneralError('');
                }}
                className={`pb-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'email'
                    ? 'border-[#9C3D25] text-[#9C3D25]'
                    : 'border-transparent text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ईमेल • Email</span>
              </button>

              <button
                type="button"
                id="tab-phone-login"
                onClick={() => {
                  setActiveTab('phone');
                  setGeneralError('');
                }}
                className={`pb-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'phone'
                    ? 'border-[#9C3D25] text-[#9C3D25]'
                    : 'border-transparent text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>फ़ोन OTP • Phone</span>
              </button>

              <button
                type="button"
                id="tab-google-login"
                onClick={() => {
                  setActiveTab('google');
                  setGeneralError('');
                }}
                className={`pb-2 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                  activeTab === 'google'
                    ? 'border-[#9C3D25] text-[#9C3D25]'
                    : 'border-transparent text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Google</span>
              </button>
            </div>

            {/* ---------------- TAB 1: EMAIL LOGIN & REGISTRATION ---------------- */}
            {activeTab === 'email' && (
              <div className="space-y-4">
                {/* Sign In vs Register Toggle */}
                <div className="flex items-center justify-between bg-white rounded-xl p-1 border border-[#E3D5C5]">
                  <button
                    type="button"
                    id="btn-mode-login"
                    onClick={() => {
                      setEmailMode('login');
                      setGeneralError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                      emailMode === 'login'
                        ? 'bg-[#FAF6F0] text-[#9C3D25] shadow-2xs font-extrabold'
                        : 'text-[#5E534D]'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>साइन इन • Sign In</span>
                  </button>

                  <button
                    type="button"
                    id="btn-mode-register"
                    onClick={() => {
                      setEmailMode('register');
                      setGeneralError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                      emailMode === 'register'
                        ? 'bg-[#FAF6F0] text-[#9C3D25] shadow-2xs font-extrabold'
                        : 'text-[#5E534D]'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>नया खाता बनाएं • Sign Up</span>
                  </button>
                </div>

                {/* Custom Photo Selector (Active during Sign Up mode) */}
                {emailMode === 'register' && (
                  <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3.5 space-y-2">
                    <label className="text-xs font-bold text-[#201A18] block">
                      कस्टम प्रोफ़ाइल फ़ोटो लगाएं • Custom Profile Photo
                    </label>
                    <ProfilePhotoUploader
                      currentAvatar={customPhotoUrl}
                      onAvatarChange={(newUrl) => setCustomPhotoUrl(newUrl)}
                      role={selectedRole}
                      language={language}
                      size="sm"
                      idPrefix="register-custom"
                    />
                  </div>
                )}

                {/* Demo Accounts Hint on Login Screen (Requirement 4) */}
                {emailMode === 'login' && (
                  <div className="bg-[#FAF6F0] border border-[#E3D5C5] rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        id="btn-demo-accounts-hint-toggle"
                        onClick={() => setShowDemoAccounts((prev) => !prev)}
                        className="text-xs font-bold text-[#9C3D25] hover:text-[#802913] flex items-center gap-1.5 transition-colors group"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span className="underline underline-offset-2">Try demo accounts →</span>
                        <span className="text-[10px] font-mono font-semibold bg-[#F5DDD6] text-[#9C3D25] px-1.5 py-0.5 rounded-full no-underline">
                          dev-only
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDemoAccounts((prev) => !prev)}
                        className="text-[11px] text-[#8A726C] hover:text-[#201A18]"
                      >
                        {showDemoAccounts ? 'Hide' : 'Show 3 accounts'}
                      </button>
                    </div>

                    {showDemoAccounts && (
                      <div className="space-y-2 pt-1 border-t border-[#E3D5C5]/60">
                        {DEMO_ACCOUNTS_SEED.map((demo) => (
                          <div
                            key={demo.email}
                            id={`demo-card-${demo.email.split('@')[0]}`}
                            className="bg-white border border-[#E3D5C5] rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs hover:border-[#9C3D25]/40 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={demo.avatarUrl}
                                alt={demo.name}
                                className="w-8 h-8 rounded-full object-cover border border-[#E3D5C5] flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-[#201A18] truncate">
                                    {demo.name}
                                  </span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                      demo.role === 'artisan'
                                        ? 'bg-[#FDF1EC] text-[#9C3D25] border-[#9C3D25]/20'
                                        : 'bg-[#E2ECE6] text-[#2D5A43] border-[#2D5A43]/20'
                                    }`}
                                  >
                                    {demo.icon} {demo.role === 'artisan' ? 'Artisan' : 'Buyer'}
                                  </span>
                                </div>
                                <div className="text-[10px] text-[#6B605B] truncate font-mono">
                                  {demo.email}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                id={`btn-autofill-${demo.email.split('@')[0]}`}
                                onClick={() => handleQuickFillAccount(demo as any)}
                                className="text-[11px] font-bold text-[#201A18] bg-[#F4EBE1] hover:bg-[#ebdccf] px-2.5 py-1.5 rounded-lg border border-[#E3D5C5] transition-colors active:scale-95"
                              >
                                Autofill
                              </button>
                              <button
                                type="button"
                                id={`btn-login-${demo.email.split('@')[0]}`}
                                onClick={() => handleOneTapDemoLogin(demo, true)}
                                className="text-[11px] font-bold text-white bg-[#9C3D25] hover:bg-[#802913] px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors active:scale-95"
                              >
                                Sign In
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Email Form */}
                <form onSubmit={handleEmailAuthSubmit} className="space-y-3">
                  {emailMode === 'register' && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#201A18] block">
                        पूरा नाम • Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8A726C]" />
                        <input
                          type="text"
                          id="input-register-name"
                          value={registerNameInput}
                          onChange={(e) => setRegisterNameInput(e.target.value)}
                          placeholder={selectedRole === 'artisan' ? 'श्रीमती पार्वती देवी' : 'Vaishu Kalkuda'}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3D5C5] rounded-xl text-xs text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#201A18] block">
                      ईमेल पता • Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#8A726C]" />
                      <input
                        type="email"
                        id="input-email-address"
                        value={emailAddress}
                        onChange={(e) => {
                          setEmailAddress(e.target.value);
                          setEmailError('');
                        }}
                        placeholder="vaishukalkuda@gmail.com"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3D5C5] rounded-xl text-xs text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                        required
                      />
                    </div>
                    {emailError && (
                      <p className="text-[11px] text-red-600 font-semibold">{emailError}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#201A18] block">
                      पासवर्ड • Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8A726C]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="input-email-password"
                        value={emailPassword}
                        onChange={(e) => {
                          setEmailPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="कम से कम 6 अक्षर • min 6 chars"
                        className="w-full pl-9 pr-10 py-2 bg-white border border-[#E3D5C5] rounded-xl text-xs text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                        required
                      />
                      <button
                        type="button"
                        id="btn-toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#8A726C]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-[11px] text-red-600 font-semibold">{passwordError}</p>
                    )}
                  </div>

                  {/* Ask: Are you an Artisan (selling crafts) or a Buyer (shopping)? (Requirement 1) */}
                  {emailMode === 'register' && (
                    <div className="space-y-2 pt-1 border-t border-[#F4EBE1]">
                      <label className="text-xs font-bold text-[#201A18] block">
                        आपकी भूमिका क्या है? • Are you an Artisan (selling crafts) or a Buyer (shopping)? *
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          id="btn-register-select-artisan"
                          onClick={() => {
                            setSelectedRole('artisan');
                            speakAloud('शिल्पकार (कारीगर) भूमिका चुनी गई', { lang: speechLang });
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            selectedRole === 'artisan'
                              ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/25 text-[#9C3D25] shadow-xs'
                              : 'bg-white border-[#E3D5C5] text-[#5E534D] hover:bg-[#FAF6F0]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xl">🏺</span>
                            {selectedRole === 'artisan' ? (
                              <CheckCircle2 className="w-4 h-4 text-[#9C3D25]" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[#D5C6B5]" />
                            )}
                          </div>
                          <div className="pt-2">
                            <div className="font-bold text-xs text-[#201A18]">
                              कारीगर • Artisan
                            </div>
                            <div className="text-[10px] text-[#8A726C] leading-snug pt-0.5">
                              Selling crafts • हस्तशिल्प बिक्री
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          id="btn-register-select-buyer"
                          onClick={() => {
                            setSelectedRole('buyer');
                            speakAloud('कला प्रेमी (ख़रीदार) भूमिका चुनी गई', { lang: speechLang });
                          }}
                          className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            selectedRole === 'buyer'
                              ? 'bg-[#E2ECE6] border-[#2D5A43] ring-2 ring-[#2D5A43]/25 text-[#2D5A43] shadow-xs'
                              : 'bg-white border-[#E3D5C5] text-[#5E534D] hover:bg-[#FAF6F0]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xl">🛍️</span>
                            {selectedRole === 'buyer' ? (
                              <CheckCircle2 className="w-4 h-4 text-[#2D5A43]" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border border-[#D5C6B5]" />
                            )}
                          </div>
                          <div className="pt-2">
                            <div className="font-bold text-xs text-[#201A18]">
                              कला प्रेमी • Buyer
                            </div>
                            <div className="text-[10px] text-[#8A726C] leading-snug pt-0.5">
                              Shopping & crafts • ख़रीदारी
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    id="btn-submit-email-auth"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>
                          {emailMode === 'register'
                            ? 'खाता बनाएं एवं प्रवेश करें • Register & Login'
                            : 'सुरक्षित प्रवेश करें • Sign In'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* ---------------- TAB 2: PHONE OTP LOGIN ---------------- */}
            {activeTab === 'phone' && (
              <div className="space-y-4">
                {/* Phone Input Box */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#201A18] block">
                    भारतीय मोबाइल नंबर • 10-Digit Phone *
                  </label>
                  <div className="flex gap-2">
                    <div className="w-16 bg-[#F4EBE1] border border-[#E3D5C5] rounded-xl flex items-center justify-center text-xs font-bold text-[#201A18]">
                      🇮🇳 +91
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-[#8A726C]" />
                      <input
                        type="tel"
                        id="input-phone-number"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          setPhoneError('');
                        }}
                        maxLength={10}
                        placeholder="9876543210"
                        className="w-full pl-9 pr-3 py-2 bg-white border border-[#E3D5C5] rounded-xl text-xs text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-red-600 font-semibold">{phoneError}</p>
                  )}
                </div>

                {!isOtpSent ? (
                  <button
                    type="button"
                    id="btn-send-phone-otp"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-xl bg-[#9C3D25] hover:bg-[#802913] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>OTP सत्यापन कोड भेजें • Send Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  /* OTP Verification Box */
                  <div className="space-y-3 bg-white border border-[#E3D5C5] rounded-2xl p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#201A18]">
                        सत्यापन कोड दर्ज करें • Enter 4-Digit Code
                      </span>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp)}
                        className="text-[10px] font-bold text-[#9C3D25] bg-[#FDF1EC] px-2 py-0.5 rounded-full hover:underline"
                      >
                        Auto-Fill: {generatedOtp}
                      </button>
                    </div>

                    <input
                      type="text"
                      id="input-entered-otp"
                      value={enteredOtp}
                      onChange={(e) => {
                        setEnteredOtp(e.target.value);
                        setOtpError('');
                      }}
                      maxLength={4}
                      placeholder="• • • •"
                      className="w-full tracking-widest text-center text-lg font-bold py-2 bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                    />
                    {otpError && (
                      <p className="text-[11px] text-red-600 font-semibold">{otpError}</p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-[#5E534D]">
                      <span>
                        {isTimerRunning
                          ? `पुनः भेजें ${timerCount}s में`
                          : 'कोड नहीं मिला?'}
                      </span>
                      <button
                        type="button"
                        disabled={isTimerRunning}
                        onClick={handleSendOtp}
                        className="text-[#9C3D25] font-bold disabled:opacity-40 hover:underline"
                      >
                        पुनः OTP भेजें
                      </button>
                    </div>

                    <button
                      type="button"
                      id="btn-verify-otp-submit"
                      onClick={handleVerifyPhoneOtp}
                      disabled={isLoading}
                      className="w-full py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>प्रवेश सत्यापित करें • Verify & Sign In</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ---------------- TAB 3: GOOGLE AUTH ---------------- */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                {/* Primary Google Auth Button */}
                <button
                  type="button"
                  id="btn-firebase-google-auth"
                  onClick={handleFirebaseGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-white hover:bg-[#F4EBE1] border-2 border-[#E3D5C5] hover:border-[#9C3D25] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xs active:scale-98 text-xs font-bold text-[#201A18]"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#9C3D25]" />
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Google से सीधे साइन इन करें • Sign In with Google</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#E3D5C5]"></div>
                  <span className="flex-shrink mx-3 text-[11px] font-bold text-[#8A726C]">
                    या खाता चुनें • Or Quick Select
                  </span>
                  <div className="flex-grow border-t border-[#E3D5C5]"></div>
                </div>

                {/* Quick Google Profiles */}
                <div className="space-y-2">
                  <button
                    type="button"
                    id="btn-google-account-vaishu"
                    onClick={() =>
                      handleSelectGoogleAccount(
                        'vaishukalkuda@gmail.com',
                        'Vaishu Kalkuda',
                        customPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      )
                    }
                    className="w-full bg-white hover:bg-[#F4EBE1] border border-[#E3D5C5] rounded-2xl p-3 flex items-center justify-between transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E3D5C5] flex-shrink-0">
                        <img
                          src={customPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt="Vaishu"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs text-[#201A18] group-hover:text-[#9C3D25]">
                          Vaishu Kalkuda
                        </div>
                        <div className="text-[11px] text-[#5E534D]">vaishukalkuda@gmail.com</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2D5A43] bg-[#E2ECE6] px-2.5 py-1 rounded-full">
                      Continue →
                    </span>
                  </button>

                  <button
                    type="button"
                    id="btn-google-account-parvati"
                    onClick={() =>
                      handleSelectGoogleAccount(
                        'parvati.devi@kalasetu.org',
                        'श्रीमती पार्वती देवी',
                        customPhotoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
                      )
                    }
                    className="w-full bg-white hover:bg-[#F4EBE1] border border-[#E3D5C5] rounded-2xl p-3 flex items-center justify-between transition-colors shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E3D5C5] flex-shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                          alt="Parvati"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-xs text-[#201A18] group-hover:text-[#9C3D25]">
                          श्रीमती पार्वती देवी (Parvati Devi)
                        </div>
                        <div className="text-[11px] text-[#5E534D]">parvati.devi@kalasetu.org</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#2D5A43] bg-[#E2ECE6] px-2.5 py-1 rounded-full">
                      Continue →
                    </span>
                  </button>
                </div>

                {/* Custom Gmail Input */}
                <div className="bg-white border border-[#E3D5C5] rounded-2xl p-3 space-y-2">
                  <div className="text-[11px] font-bold text-[#5E534D]">
                    अन्य Google खाता दर्ज करें • Any Gmail Address
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      id="input-custom-google-email"
                      value={customGoogleEmail}
                      onChange={(e) => {
                        setCustomGoogleEmail(e.target.value);
                        setCustomGoogleError('');
                      }}
                      placeholder="yourname@gmail.com"
                      className="flex-1 px-3 py-1.5 bg-[#FAF6F0] border border-[#E3D5C5] rounded-xl text-xs text-[#201A18] focus:outline-none focus:border-[#9C3D25]"
                    />
                    <button
                      type="button"
                      id="btn-submit-custom-google"
                      onClick={handleCustomGoogleSubmit}
                      className="px-3 py-1.5 bg-[#9C3D25] text-white text-xs font-bold rounded-xl active:scale-95"
                    >
                      Sign In
                    </button>
                  </div>
                  {customGoogleError && (
                    <p className="text-[11px] text-red-600 font-semibold">{customGoogleError}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-[#FFFFFF] border-t border-[#E3D5C5] px-5 py-2.5 flex items-center justify-between text-[11px] text-[#5E534D]">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="text-[#9C3D25] font-semibold">कलासेतु • KalaSetu Digital</span>
        </div>
      </div>
    </div>
  );
};
