import React, { useState } from 'react';
import {
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
  Globe,
  Check,
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { useLanguage, getSpeechLangCode } from '../i18n/LanguageContext';
import { speakAloud } from '../utils/audioService';
import { KalaSetuLogo } from './KalaSetuLogo';
import {
  firebaseLoginWithEmail,
  firebaseSignUpWithEmail,
  firebaseSendPasswordReset,
  signInWithFirebaseGoogle,
} from '../utils/authService';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser, isNewUserWithoutRole?: boolean) => void;
  language?: string;
  onOpenLanguageSelector?: () => void;
  initialTab?: 'login' | 'signup';
  initialRole?: UserRole;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  language: propLanguage,
  onOpenLanguageSelector,
  initialTab = 'login',
  initialRole = 'artisan',
}) => {
  const { language: currentLang, t } = useLanguage();
  const activeLang = propLanguage || currentLang;
  const speechLang = getSpeechLangCode(activeLang);

  // Active Tab: 'login' or 'signup'
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  // UI / Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPass, setIsResettingPass] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Demo Accounts
  const DEMO_ACCOUNTS = [
    {
      name: 'Vaishu Kalkuda',
      email: 'vaishukalkuda@gmail.com',
      password: 'password123',
      role: 'artisan' as UserRole,
      label: t('common.artisan'),
      icon: '🎨',
    },
    {
      name: 'Raghav Sharma',
      email: 'raghav.sharma@gmail.com',
      password: 'buyer123',
      role: 'buyer' as UserRole,
      label: t('common.buyer'),
      icon: '🛍️',
    },
  ];

  // Voice Readers for accessible assistance
  const speakFieldLabel = (label: string) => {
    speakAloud(label, { lang: speechLang });
  };

  const handleListenScreenGuide = () => {
    const guideText =
      activeTab === 'login'
        ? `${t('screens.auth.loginTitle')}. ${t('screens.auth.emailLabel')}, ${t('screens.auth.passwordLabel')}. ${t('screens.auth.googleSignIn')}.`
        : `${t('screens.auth.signupTitle')}. ${t('screens.auth.nameLabel')}, ${t('screens.auth.emailLabel')}, ${t('screens.auth.passwordLabel')}. ${t('screens.auth.selectRole')}.`;
    speakAloud(guideText, { lang: speechLang });
  };

  // Validation Helpers
  const validateEmailFormat = (val: string): boolean => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val.trim() || !pattern.test(val.trim())) {
      setEmailError(t('errors.invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswordFormat = (val: string): boolean => {
    if (!val || val.length < 4) {
      setPasswordError(t('errors.invalidPassword'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  // 1. Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessToast('');

    const isEmailValid = validateEmailFormat(email);
    const isPassValid = validatePasswordFormat(password);
    if (!isEmailValid || !isPassValid) return;

    setIsLoading(true);
    try {
      const result = await firebaseLoginWithEmail(email, password);
      if (result.success && result.user) {
        const welcomeMsg = t('screens.auth.loginSuccess', { name: result.user.name });
        setSuccessToast(welcomeMsg);
        speakAloud(welcomeMsg, { lang: speechLang });
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 400);
      } else {
        const errMsg = result.error || t('errors.loginFailed');
        setGeneralError(errMsg);
        speakAloud(errMsg, { lang: speechLang });
      }
    } catch (err: any) {
      setGeneralError(err?.message || t('errors.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Signup Submit
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessToast('');

    if (!fullName.trim()) {
      setNameError(t('errors.nameRequired'));
      return;
    } else {
      setNameError('');
    }

    const isEmailValid = validateEmailFormat(email);
    const isPassValid = validatePasswordFormat(password);
    if (!isEmailValid || !isPassValid) return;

    setIsLoading(true);
    try {
      const result = await firebaseSignUpWithEmail({
        name: fullName.trim(),
        email: email.trim(),
        password,
        role: selectedRole,
        language: activeLang,
      });

      if (result.success && result.user) {
        const successMsg = t('screens.auth.signupSuccess', { name: result.user.name });
        setSuccessToast(successMsg);
        speakAloud(successMsg, { lang: speechLang });
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 400);
      } else {
        setGeneralError(result.error || t('errors.signupFailed'));
      }
    } catch (err: any) {
      setGeneralError(err?.message || t('errors.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setEmailError(t('errors.invalidEmail'));
      speakAloud(t('errors.invalidEmail'), { lang: speechLang });
      return;
    }
    setIsResettingPass(true);
    setGeneralError('');
    try {
      const res = await firebaseSendPasswordReset(email);
      if (res.success) {
        setSuccessToast(t('screens.auth.resetSent'));
        speakAloud(t('screens.auth.resetSent'), { lang: speechLang });
      } else {
        setGeneralError(res.error || res.message);
      }
    } finally {
      setIsResettingPass(false);
    }
  };

  // 4. Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setGeneralError('');
    try {
      const res = await signInWithFirebaseGoogle(selectedRole);
      if (res.success && res.user) {
        const welcomeMsg = t('screens.auth.loginSuccess', { name: res.user.name });
        setSuccessToast(welcomeMsg);
        speakAloud(welcomeMsg, { lang: speechLang });
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 400);
      } else {
        setGeneralError(res.error || t('errors.genericError'));
      }
    } catch (err: any) {
      setGeneralError(err?.message || t('errors.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. One-tap Autofill Demo Account
  const handleAutofillDemo = (demo: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedRole(demo.role);
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    speakAloud(`${demo.name} (${demo.label})`, { lang: speechLang });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#201A18] flex flex-col justify-between py-6 px-4 relative selection:bg-[#9C3D25]/20 selection:text-[#9C3D25]">
      {/* Decorative Atmosphere Glows */}
      <div className="fixed top-0 right-0 w-80 h-80 rounded-full bg-[#E5A93C]/10 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full bg-[#9C3D25]/10 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pb-3">
        <KalaSetuLogo size={34} showText={true} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-auth-voice-guide"
            onClick={handleListenScreenGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/50 text-xs font-bold text-[#7B5500] hover:bg-[#E5A93C]/30 transition-all cursor-pointer"
            title={t('common.listen')}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#9C3D25]" />
            <span>{t('common.listen')}</span>
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E3D5C5] shadow-xl shadow-[#9C3D25]/5 z-10 space-y-5">
        {/* Title & Tagline */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FDF1EC] border border-[#9C3D25]/20 text-[11px] font-bold text-[#9C3D25] uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-[#E5A93C]" />
            <span>{t('common.tagline')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#201A18] tracking-tight">
            {activeTab === 'login' ? t('screens.auth.loginTitle') : t('screens.auth.signupTitle')}
          </h1>
          <p className="text-xs text-[#5E534D]">
            {t('screens.auth.subtitle')}
          </p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div
            role="status"
            className="bg-[#E2ECE6] border border-[#2D5A43]/30 text-[#2D5A43] px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn"
          >
            <CheckCircle2 className="w-4 h-4 text-[#2D5A43] flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* General Error Alert */}
        {generalError && (
          <div
            role="alert"
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-fadeIn"
          >
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Top 2 Tabs: LOGIN vs SIGNUP */}
        <div className="grid grid-cols-2 p-1 bg-[#FAF6F0] rounded-2xl border border-[#E3D5C5]">
          <button
            type="button"
            id="tab-login"
            onClick={() => {
              setActiveTab('login');
              setGeneralError('');
              setEmailError('');
              setPasswordError('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#9C3D25] text-white shadow-sm'
                : 'text-[#5E534D] hover:text-[#201A18]'
            }`}
          >
            {t('common.login')}
          </button>

          <button
            type="button"
            id="tab-signup"
            onClick={() => {
              setActiveTab('signup');
              setGeneralError('');
              setEmailError('');
              setPasswordError('');
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-[#9C3D25] text-white shadow-sm'
                : 'text-[#5E534D] hover:text-[#201A18]'
            }`}
          >
            {t('common.signup')}
          </button>
        </div>

        {/* LOGIN TAB FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-login-email"
                  className="text-xs font-bold text-[#201A18] flex items-center gap-1.5"
                >
                  <span>{t('screens.auth.emailLabel')}</span>
                  <button
                    type="button"
                    onClick={() => speakFieldLabel(t('screens.auth.emailLabel'))}
                    className="text-[#9C3D25] hover:opacity-75 p-0.5 cursor-pointer"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </label>
              </div>

              <div className="relative">
                <Mail className="w-5 h-5 text-[#8A726C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder={t('screens.auth.emailPlaceholder')}
                  className={`w-full min-h-[48px] pl-11 pr-3 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-[#9C3D25]/20 ${
                    emailError
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-[#E3D5C5] bg-white focus:border-[#9C3D25]'
                  }`}
                />
              </div>
              {emailError && <p className="text-xs text-red-600 font-semibold">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-login-password"
                  className="text-xs font-bold text-[#201A18] flex items-center gap-1.5"
                >
                  <span>{t('screens.auth.passwordLabel')}</span>
                  <button
                    type="button"
                    onClick={() => speakFieldLabel(t('screens.auth.passwordLabel'))}
                    className="text-[#9C3D25] hover:opacity-75 p-0.5 cursor-pointer"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </label>

                {/* Forgot Password Link */}
                <button
                  type="button"
                  id="btn-forgot-password"
                  onClick={handleForgotPassword}
                  disabled={isResettingPass}
                  className="text-xs font-bold text-[#9C3D25] hover:underline cursor-pointer"
                >
                  {isResettingPass ? t('common.loading') : t('screens.auth.forgotPassword')}
                </button>
              </div>

              <div className="relative">
                <Lock className="w-5 h-5 text-[#8A726C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder={t('screens.auth.passwordPlaceholder')}
                  className={`w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-[#9C3D25]/20 ${
                    passwordError
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-[#E3D5C5] bg-white focus:border-[#9C3D25]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A726C] hover:text-[#201A18] p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-600 font-semibold">{passwordError}</p>}
            </div>

            {/* Prominent Full-Width Log In Button */}
            <button
              type="submit"
              id="btn-login-submit"
              disabled={isLoading}
              className="w-full min-h-[48px] h-13 bg-[#9C3D25] hover:bg-[#802913] active:scale-[0.98] text-white rounded-2xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('screens.auth.loginBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Sign In with Google Button */}
            <button
              type="button"
              id="btn-google-login"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full min-h-[48px] h-12 bg-white hover:bg-[#FAF6F0] active:scale-[0.98] text-[#201A18] border-2 border-[#E3D5C5] rounded-2xl font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
              <span>{t('screens.auth.googleSignIn')}</span>
            </button>

            {/* Try Demo Accounts Link */}
            <div className="pt-1 text-center">
              <button
                type="button"
                id="btn-toggle-demo-accounts"
                onClick={() => setShowDemoDrawer(!showDemoDrawer)}
                className="text-xs font-bold text-[#9C3D25] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t('screens.auth.tryDemo')}</span>
              </button>

              {/* Demo Accounts List */}
              {showDemoDrawer && (
                <div className="mt-3 p-3 bg-[#FAF6F0] rounded-2xl border border-[#E3D5C5] space-y-2 text-left animate-fadeIn">
                  <div className="text-[11px] font-bold text-[#5E534D] uppercase tracking-wider">
                    {t('screens.auth.demoTitle')}
                  </div>
                  <div className="space-y-2">
                    {DEMO_ACCOUNTS.map((demo) => (
                      <button
                        key={demo.email}
                        type="button"
                        onClick={() => handleAutofillDemo(demo)}
                        className="w-full p-2.5 rounded-xl bg-white hover:bg-[#FDF1EC] border border-[#E3D5C5] hover:border-[#9C3D25] flex items-center justify-between text-left transition-all cursor-pointer shadow-2xs group"
                      >
                        <div>
                          <div className="text-xs font-bold text-[#201A18] group-hover:text-[#9C3D25] flex items-center gap-1.5">
                            <span>{demo.icon}</span>
                            <span>{demo.email}</span>
                          </div>
                          <div className="text-[10px] text-[#5E534D]">
                            Password: <span className="font-mono font-bold text-[#7C3A1D]">{demo.password}</span> • {demo.label}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#9C3D25] bg-[#FAF6F0] px-2 py-1 rounded-lg border border-[#E3D5C5]">
                          {t('screens.auth.autofillBtn')}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>
        )}

        {/* SIGNUP TAB FORM */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-signup-name"
                  className="text-xs font-bold text-[#201A18] flex items-center gap-1.5"
                >
                  <span>{t('screens.auth.nameLabel')}</span>
                  <button
                    type="button"
                    onClick={() => speakFieldLabel(t('screens.auth.nameLabel'))}
                    className="text-[#9C3D25] hover:opacity-75 p-0.5 cursor-pointer"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </label>
              </div>

              <div className="relative">
                <User className="w-5 h-5 text-[#8A726C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder={t('screens.auth.namePlaceholder')}
                  className={`w-full min-h-[48px] pl-11 pr-3 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-[#9C3D25]/20 ${
                    nameError
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-[#E3D5C5] bg-white focus:border-[#9C3D25]'
                  }`}
                />
              </div>
              {nameError && <p className="text-xs text-red-600 font-semibold">{nameError}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-signup-email"
                  className="text-xs font-bold text-[#201A18] flex items-center gap-1.5"
                >
                  <span>{t('screens.auth.emailLabel')}</span>
                  <button
                    type="button"
                    onClick={() => speakFieldLabel(t('screens.auth.emailLabel'))}
                    className="text-[#9C3D25] hover:opacity-75 p-0.5 cursor-pointer"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </label>
              </div>

              <div className="relative">
                <Mail className="w-5 h-5 text-[#8A726C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder={t('screens.auth.emailPlaceholder')}
                  className={`w-full min-h-[48px] pl-11 pr-3 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-[#9C3D25]/20 ${
                    emailError
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-[#E3D5C5] bg-white focus:border-[#9C3D25]'
                  }`}
                />
              </div>
              {emailError && <p className="text-xs text-red-600 font-semibold">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="input-signup-password"
                  className="text-xs font-bold text-[#201A18] flex items-center gap-1.5"
                >
                  <span>{t('screens.auth.passwordLabel')}</span>
                  <button
                    type="button"
                    onClick={() => speakFieldLabel(t('screens.auth.passwordLabel'))}
                    className="text-[#9C3D25] hover:opacity-75 p-0.5 cursor-pointer"
                    title={t('common.listen')}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </label>
              </div>

              <div className="relative">
                <Lock className="w-5 h-5 text-[#8A726C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="input-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder={t('screens.auth.passwordPlaceholder')}
                  className={`w-full min-h-[48px] pl-11 pr-11 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-[#9C3D25]/20 ${
                    passwordError
                      ? 'border-red-400 bg-red-50/50'
                      : 'border-[#E3D5C5] bg-white focus:border-[#9C3D25]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A726C] hover:text-[#201A18] p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-600 font-semibold">{passwordError}</p>}
            </div>

            {/* Role Selector with TWO BIG BUTTONS (Artisan vs Buyer) */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-[#201A18] block">
                {t('screens.auth.selectRole')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* BIG Button 1: Artisan */}
                <button
                  type="button"
                  id="signup-role-artisan"
                  onClick={() => {
                    setSelectedRole('artisan');
                    speakAloud(t('screens.auth.artisanRoleTitle'), { lang: speechLang });
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    selectedRole === 'artisan'
                      ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-sm'
                      : 'bg-white border-[#E3D5C5] hover:border-[#8A726C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#201A18]">
                        {t('screens.auth.artisanRoleTitle')}
                      </div>
                      <div className="text-[10px] text-[#7C3A1D]">
                        {t('screens.auth.artisanRoleSub')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ${
                      selectedRole === 'artisan'
                        ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                        : 'border-[#8A726C]/40 bg-white'
                    }`}
                  >
                    {selectedRole === 'artisan' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* BIG Button 2: Buyer */}
                <button
                  type="button"
                  id="signup-role-buyer"
                  onClick={() => {
                    setSelectedRole('buyer');
                    speakAloud(t('screens.auth.buyerRoleTitle'), { lang: speechLang });
                  }}
                  className={`p-3.5 rounded-2xl border-2 text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    selectedRole === 'buyer'
                      ? 'bg-[#FDF1EC] border-[#9C3D25] ring-2 ring-[#9C3D25]/20 shadow-sm'
                      : 'bg-white border-[#E3D5C5] hover:border-[#8A726C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-[#201A18]">
                        {t('screens.auth.buyerRoleTitle')}
                      </div>
                      <div className="text-[10px] text-[#7C3A1D]">
                        {t('screens.auth.buyerRoleSub')}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors flex-shrink-0 ${
                      selectedRole === 'buyer'
                        ? 'bg-[#9C3D25] border-[#9C3D25] text-white'
                        : 'border-[#8A726C]/40 bg-white'
                    }`}
                  >
                    {selectedRole === 'buyer' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              id="btn-signup-submit"
              disabled={isLoading}
              className="w-full min-h-[48px] h-13 bg-[#9C3D25] hover:bg-[#802913] active:scale-[0.98] text-white rounded-2xl font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('screens.auth.signupBtn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Sign in with Google */}
            <button
              type="button"
              id="btn-google-signup"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full min-h-[48px] h-12 bg-white hover:bg-[#FAF6F0] active:scale-[0.98] text-[#201A18] border-2 border-[#E3D5C5] rounded-2xl font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
              <span>{t('screens.auth.googleSignIn')}</span>
            </button>
          </form>
        )}

        {/* BOTH TABS: Language Selector & Fair Trade footer */}
        <div className="pt-2 border-t border-[#E3D5C5] flex items-center justify-between text-xs text-[#5E534D]">
          {onOpenLanguageSelector ? (
            <button
              type="button"
              id="btn-auth-change-language"
              onClick={onOpenLanguageSelector}
              className="inline-flex items-center gap-1.5 font-bold text-[#9C3D25] hover:underline cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t('common.changeLanguage')} ({activeLang.toUpperCase()})</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#9C3D25]" />
              <span>{t('common.language')}: {activeLang.toUpperCase()}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[#2D5A43] font-semibold text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t('common.verified')}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-[#8A726C] pt-6 z-10">
        {t('common.appName')} • {t('common.directFairTrade')}
      </footer>
    </div>
  );
};
