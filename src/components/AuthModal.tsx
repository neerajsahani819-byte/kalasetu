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
import { AuthUser, UserRole, UserAccountRecord } from '../types';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
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
  const [customGoogleEmail] = useState('');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Registered accounts for easy testing & transparency
  const [, setSavedAccounts] = useState<UserAccountRecord[]>([]);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const DEMO_ACCOUNTS_SEED = [
    {
      id: 'user-vaishu',
      name: 'Vaishu Kalkuda',
      email: 'vaishukalkuda@gmail.com',
      password: 'password123',
      role: 'artisan' as UserRole,
      roleLabel: t('auth.roleArtisan'),
      icon: '🎨',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'user-parvati',
      name: 'Parvati Devi',
      email: 'parvati@kalasetu.org',
      password: 'craft123',
      role: 'artisan' as UserRole,
      roleLabel: t('auth.roleArtisan'),
      icon: '🏺',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'user-raghav',
      name: 'Raghav Sharma',
      email: 'raghav.sharma@gmail.com',
      password: 'buyer123',
      role: 'buyer' as UserRole,
      roleLabel: t('auth.roleBuyer'),
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
      setPhoneError(t('auth.invalidPhone'));
      return false;
    }
    if (!/^[6-9]/.test(cleaned)) {
      setPhoneError(t('auth.invalidPhone'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSendOtp = () => {
    if (!validatePhone(phoneNumber)) {
      speakAloud(t('auth.invalidPhone'), { lang: speechLang });
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

      speakAloud(`${t('auth.otpSent', { phone: phoneNumber })}: ${code.split('').join(' ')}`, {
        lang: speechLang,
      });
    }, 500);
  };

  const handleVerifyPhoneOtp = () => {
    if (!enteredOtp || enteredOtp.trim().length !== 4) {
      setOtpError(t('auth.enterOtp'));
      return;
    }
    if (enteredOtp.trim() !== generatedOtp) {
      setOtpError(t('auth.invalidOtp'));
      speakAloud(t('auth.invalidOtp'), { lang: speechLang });
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

      setSuccessToast(t('auth.loginSuccess', { name: res.user.name }));
      speakAloud(t('auth.loginSuccess', { name: res.user.name }), { lang: speechLang });

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
      setEmailError(t('auth.loginError'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (pass: string): boolean => {
    if (!pass || pass.length < 6) {
      setPasswordError(t('auth.loginError'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    const isEmailValid = validateEmail(emailAddress);
    const isPassValid = validatePassword(emailPassword);

    if (!isEmailValid || !isPassValid) {
      speakAloud(t('auth.loginError'), { lang: speechLang });
      return;
    }

    if (emailMode === 'register') {
      if (!registerNameInput.trim()) {
        setEmailError(t('auth.signupError'));
        return;
      }
    }

    setIsLoading(true);

    if (emailMode === 'register') {
      const res = registerNewUser({
        email: emailAddress.trim(),
        password: emailPassword,
        name: registerNameInput.trim(),
        role: selectedRole,
        authProvider: 'email',
        avatarUrl: customPhotoUrl,
      });
      setIsLoading(false);

      if (!res.success || !res.user) {
        setGeneralError(res.error || t('auth.signupError'));
        speakAloud(res.error || t('auth.signupError'), { lang: speechLang });
        return;
      }

      setSavedAccounts(getRegisteredUsers());
      setSuccessToast(t('auth.signupSuccess', { name: res.user.name }));
      speakAloud(t('auth.signupSuccess', { name: res.user.name }), { lang: speechLang });

      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 600);
    } else {
      const res = loginUserWithEmail(
        emailAddress.trim(),
        emailPassword
      );
      setIsLoading(false);

      if (!res.success || !res.user) {
        setGeneralError(res.error || t('auth.loginError'));
        speakAloud(res.error || t('auth.loginError'), { lang: speechLang });
        return;
      }

      setSuccessToast(t('auth.loginSuccess', { name: res.user.name }));
      speakAloud(t('auth.loginSuccess', { name: res.user.name }), { lang: speechLang });

      setTimeout(() => {
        onLoginSuccess(res.user!);
        onClose();
      }, 600);
    }
  };

  const handleAutofillDemo = (demo: typeof DEMO_ACCOUNTS_SEED[0]) => {
    setEmailAddress(demo.email);
    setEmailPassword(demo.password);
    setSelectedRole(demo.role);
    setEmailMode('login');
    setCustomPhotoUrl(demo.avatarUrl);
    setGeneralError('');
    setEmailError('');
    setPasswordError('');
    setSuccessToast(t('auth.loginSuccess', { name: demo.name }));
    speakAloud(t('auth.loginSuccess', { name: demo.name }), { lang: speechLang });
  };

  // 4. Google One-Tap & Firebase Login
  const handleGoogleOneTap = async (chosenEmail?: string) => {
    setIsLoading(true);
    setGeneralError('');

    try {
      const firebaseRes = await signInWithFirebaseGoogle(selectedRole);
      if (firebaseRes.success && firebaseRes.user) {
        setIsLoading(false);
        setSuccessToast(t('auth.loginSuccess', { name: firebaseRes.user.name }));
        speakAloud(t('auth.loginSuccess', { name: firebaseRes.user.name }), { lang: speechLang });
        setTimeout(() => {
          onLoginSuccess(firebaseRes.user!);
          onClose();
        }, 600);
        return;
      }
    } catch {
      // ignore
    }

    const emailToUse = chosenEmail || customGoogleEmail.trim() || 'user@kalasetu.org';
    const fallbackAvatar = customPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    const res = loginUserWithGoogle(emailToUse, 'Google User', fallbackAvatar, selectedRole);
    setIsLoading(false);

    if (customPhotoUrl && customPhotoUrl !== res.user.avatarUrl) {
      updateUserProfilePhoto(res.user.id, customPhotoUrl);
      res.user.avatarUrl = customPhotoUrl;
    }

    setSuccessToast(t('auth.loginSuccess', { name: res.user.name }));
    speakAloud(t('auth.loginSuccess', { name: res.user.name }), { lang: speechLang });

    setTimeout(() => {
      onLoginSuccess(res.user);
      onClose();
    }, 600);
  };

  // 5. Update Profile Photo Live
  const handleProfilePhotoSelect = (newPhotoUrl: string) => {
    setCustomPhotoUrl(newPhotoUrl);
    if (!currentUser) return;
    updateUserProfilePhoto(currentUser.id, newPhotoUrl);
    const updatedUser = { ...currentUser, avatarUrl: newPhotoUrl };
    onUpdateUser?.(updatedUser);
    onLoginSuccess(updatedUser);
    speakAloud(t('profile.changePhoto'), { lang: speechLang });
  };

  // Guide speech
  const handleListenAuthGuide = () => {
    if (currentUser) {
      speakAloud(t('profile.accountSettings'), { lang: speechLang });
      return;
    }
    const guide = emailMode === 'login' ? t('auth.subtitle') : t('auth.artisanRoleSub');
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
                  ? t('profile.accountSettings')
                  : emailMode === 'register' && activeTab === 'email'
                  ? t('auth.signupTitle')
                  : t('auth.loginTitle')}
              </h2>
              <div className="text-[11px] text-[#5E534D]">
                {currentUser ? `${currentUser.authProvider.toUpperCase()} Verified` : t('common.directFairTrade')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-auth-listen-guide"
              type="button"
              onClick={handleListenAuthGuide}
              className="w-8 h-8 rounded-full bg-[#FAF6F0] text-[#9C3D25] flex items-center justify-center border border-[#E3D5C5] active:scale-95 transition-transform"
              title={t('artisan.audioGuide')}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              id="btn-close-auth-modal"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FFFFFF] text-[#5E534D] hover:text-[#201A18] border border-[#E3D5C5] flex items-center justify-center active:scale-95 transition-transform"
              aria-label={t('common.close')}
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
                  <span>{t('profile.changePhoto')}</span>
                </span>
                <span className="text-[10px] font-bold bg-[#E2ECE6] text-[#2D5A43] px-2 py-0.5 rounded-full">
                  {t('common.verified')}
                </span>
              </div>

              <ProfilePhotoUploader
                currentAvatar={currentUser.avatarUrl}
                onSelectAvatar={handleProfilePhotoSelect}
                role={currentUser.role}
              />
            </div>

            {/* Current Account Details */}
            <div className="bg-[#FFFFFF] border border-[#E3D5C5] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#9C3D25]"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-[#201A18] truncate">{currentUser.name}</div>
                  <div className="text-xs text-[#5E534D] truncate">{currentUser.email || currentUser.phone}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF1EC] text-[#9C3D25]">
                      {currentUser.role === 'artisan' ? t('common.artisan') : t('common.buyer')}
                    </span>
                    <span className="text-[10px] text-[#8A726C] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#E5A93C]" />
                      {currentUser.authProvider.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                    onClose();
                  }
                }}
                className="flex-1 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('common.logout')}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-[#9C3D25] hover:bg-[#85331E] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all"
              >
                <span>{t('common.close')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW B: LOGIN / SIGNUP TABS */
          <div className="p-4 sm:p-5 space-y-4">
            {/* Tab Selection */}
            <div className="flex bg-[#EFE6DB] p-1 rounded-2xl border border-[#E3D5C5]">
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'email'
                    ? 'bg-[#FFFFFF] text-[#9C3D25] shadow-xs'
                    : 'text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t('auth.emailLabel')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('phone')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'phone'
                    ? 'bg-[#FFFFFF] text-[#9C3D25] shadow-xs'
                    : 'text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('auth.phoneLabel')}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('google')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'google'
                    ? 'bg-[#FFFFFF] text-[#9C3D25] shadow-xs'
                    : 'text-[#5E534D] hover:text-[#201A18]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Google</span>
              </button>
            </div>

            {/* TAB 1: EMAIL / PASSWORD */}
            {activeTab === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {/* Login vs Register Switch */}
                <div className="flex items-center justify-between pb-1 border-b border-[#E3D5C5]/60">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEmailMode('login')}
                      className={`text-xs font-bold pb-1 transition-all ${
                        emailMode === 'login'
                          ? 'text-[#9C3D25] border-b-2 border-[#9C3D25]'
                          : 'text-[#5E534D] hover:text-[#201A18]'
                      }`}
                    >
                      {t('common.login')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailMode('register')}
                      className={`text-xs font-bold pb-1 transition-all ${
                        emailMode === 'register'
                          ? 'text-[#9C3D25] border-b-2 border-[#9C3D25]'
                          : 'text-[#5E534D] hover:text-[#201A18]'
                      }`}
                    >
                      {t('common.signup')}
                    </button>
                  </div>
                  <span className="text-[11px] text-[#8A726C]">
                    {selectedRole === 'artisan' ? t('common.artisan') : t('common.buyer')}
                  </span>
                </div>

                {/* Role Selector (visible in Register mode) */}
                {emailMode === 'register' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#201A18]">
                      {t('auth.selectRole')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('artisan')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          selectedRole === 'artisan'
                            ? 'bg-[#FDF1EC] border-[#9C3D25] text-[#9C3D25] font-bold shadow-xs'
                            : 'bg-white border-[#E3D5C5] text-[#5E534D]'
                        }`}
                      >
                        <span className="text-base">🎨</span>
                        <span className="text-xs">{t('common.artisan')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('buyer')}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                          selectedRole === 'buyer'
                            ? 'bg-[#FDF1EC] border-[#9C3D25] text-[#9C3D25] font-bold shadow-xs'
                            : 'bg-white border-[#E3D5C5] text-[#5E534D]'
                        }`}
                      >
                        <span className="text-base">🛍️</span>
                        <span className="text-xs">{t('common.buyer')}</span>
                      </button>
                    </div>

                    {/* Profile Photo Uploader */}
                    <ProfilePhotoUploader
                      currentAvatar={customPhotoUrl}
                      onSelectAvatar={setCustomPhotoUrl}
                      role={selectedRole}
                    />
                  </div>
                )}

                {/* Full Name for Register */}
                {emailMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-[#201A18] mb-1">
                      {t('auth.nameLabel')}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={registerNameInput}
                        onChange={(e) => setRegisterNameInput(e.target.value)}
                        placeholder={t('auth.namePlaceholder')}
                        className="w-full h-11 pl-9 pr-3 rounded-xl border border-[#E3D5C5] bg-white text-xs text-[#201A18] focus:border-[#9C3D25] focus:outline-hidden"
                      />
                      <User className="w-4 h-4 text-[#8A726C] absolute left-3 top-3.5" />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#201A18] mb-1">
                    {t('auth.emailLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                        setEmailError('');
                      }}
                      placeholder={t('auth.emailPlaceholder')}
                      className={`w-full h-11 pl-9 pr-3 rounded-xl border bg-white text-xs text-[#201A18] focus:outline-hidden ${
                        emailError ? 'border-red-500' : 'border-[#E3D5C5] focus:border-[#9C3D25]'
                      }`}
                    />
                    <Mail className="w-4 h-4 text-[#8A726C] absolute left-3 top-3.5" />
                  </div>
                  {emailError && <p className="text-[11px] text-red-600 font-medium mt-1">{emailError}</p>}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#201A18]">{t('auth.passwordLabel')}</label>
                    {emailMode === 'login' && (
                      <span className="text-[11px] text-[#9C3D25] hover:underline cursor-pointer">
                        {t('auth.forgotPassword')}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={emailPassword}
                      onChange={(e) => {
                        setEmailPassword(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder={t('auth.passwordPlaceholder')}
                      className={`w-full h-11 pl-9 pr-10 rounded-xl border bg-white text-xs text-[#201A18] focus:outline-hidden ${
                        passwordError ? 'border-red-500' : 'border-[#E3D5C5] focus:border-[#9C3D25]'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-[#8A726C] absolute left-3 top-3.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#8A726C] hover:text-[#201A18]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && <p className="text-[11px] text-red-600 font-medium mt-1">{passwordError}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-xl bg-[#9C3D25] hover:bg-[#85331E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : emailMode === 'register' ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>{t('auth.signupBtn')}</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>{t('auth.loginBtn')}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: PHONE OTP */}
            {activeTab === 'phone' && (
              <div className="space-y-3.5">
                {!isOtpSent ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-[#201A18] mb-1">
                        {t('auth.phoneLabel')}
                      </label>
                      <div className="relative flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E3D5C5] bg-[#EFE6DB] text-xs font-bold text-[#5E534D]">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value.replace(/\D/g, ''));
                            setPhoneError('');
                          }}
                          placeholder="98765 43210"
                          className="w-full h-11 px-3 rounded-r-xl border border-[#E3D5C5] bg-white text-xs text-[#201A18] focus:border-[#9C3D25] focus:outline-hidden"
                        />
                      </div>
                      {phoneError && <p className="text-[11px] text-red-600 font-medium mt-1">{phoneError}</p>}
                    </div>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={handleSendOtp}
                      className="w-full h-11 rounded-xl bg-[#9C3D25] hover:bg-[#85331E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>{t('auth.sendOtp')}</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#201A18]">{t('auth.enterOtp')}</label>
                        <span className="text-[11px] text-[#5E534D]">+91 {phoneNumber}</span>
                      </div>
                      <input
                        type="text"
                        maxLength={4}
                        value={enteredOtp}
                        onChange={(e) => {
                          setEnteredOtp(e.target.value.replace(/\D/g, ''));
                          setOtpError('');
                        }}
                        placeholder="••••"
                        className="w-full h-11 text-center font-mono font-bold text-base tracking-widest rounded-xl border border-[#E3D5C5] bg-white text-[#201A18] focus:border-[#9C3D25] focus:outline-hidden"
                      />
                      {otpError && <p className="text-[11px] text-red-600 font-medium mt-1">{otpError}</p>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={timerCount > 0}
                        onClick={handleSendOtp}
                        className="flex-1 h-11 rounded-xl border border-[#E3D5C5] bg-white text-[#5E534D] font-bold text-xs disabled:opacity-50"
                      >
                        {timerCount > 0 ? t('auth.resendOtp', { count: timerCount }) : t('auth.resendOtpNow')}
                      </button>
                      <button
                        type="button"
                        disabled={isLoading || enteredOtp.length !== 4}
                        onClick={handleVerifyPhoneOtp}
                        className="flex-1 h-11 rounded-xl bg-[#9C3D25] hover:bg-[#85331E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
                      >
                        {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : t('auth.verifyAndLogin')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 3: GOOGLE ONE-TAP */}
            {activeTab === 'google' && (
              <div className="space-y-3.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleGoogleOneTap()}
                  className="w-full h-12 rounded-2xl bg-white border border-[#E3D5C5] hover:bg-gray-50 text-[#201A18] font-bold text-xs shadow-xs flex items-center justify-center gap-3 active:scale-98 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span>{t('auth.signInWithGoogle')}</span>
                </button>
              </div>
            )}

            {/* DEMO ACCOUNTS ONE-TAP */}
            <div className="pt-2 border-t border-[#E3D5C5]/60">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#8A726C] hover:text-[#9C3D25]"
              >
                <span>{t('auth.demoAccounts')}</span>
                <span className="text-[10px]">{showDemoAccounts ? '▲' : '▼'}</span>
              </button>

              {showDemoAccounts && (
                <div className="grid grid-cols-1 gap-1.5 mt-2">
                  {DEMO_ACCOUNTS_SEED.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleAutofillDemo(demo)}
                      className="p-2 rounded-xl bg-[#FFFFFF] border border-[#E3D5C5] hover:border-[#9C3D25] flex items-center justify-between text-left transition-all active:scale-98"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{demo.icon}</span>
                        <div>
                          <div className="text-xs font-bold text-[#201A18] leading-tight">{demo.name}</div>
                          <div className="text-[10px] text-[#5E534D]">{demo.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FDF1EC] text-[#9C3D25]">
                        {t('auth.autofillBtn')}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
