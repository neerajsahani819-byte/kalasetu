import { AuthUser, UserAccountRecord, UserRole, FirestoreUser } from '../types';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, uploadProductImage } from '../services/firebase';
import { saveUserToFirestore } from '../services/firestoreService';

const USERS_STORAGE_KEY = 'kalasetu_registered_users';
const ACTIVE_USER_KEY = 'kalasetu_auth_user';

export const PRESET_AVATARS: { id: string; url: string; label: string; role: 'artisan' | 'buyer' | 'both' }[] = [
  {
    id: 'avatar-artisan-parvati',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    label: 'Artisan Elder',
    role: 'artisan',
  },
  {
    id: 'avatar-artisan-weaver',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    label: 'Handloom Weaver',
    role: 'artisan',
  },
  {
    id: 'avatar-artisan-potter',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    label: 'Terracotta Potter',
    role: 'artisan',
  },
  {
    id: 'avatar-artisan-brass',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    label: 'Metal Craftsman',
    role: 'artisan',
  },
  {
    id: 'avatar-buyer-urban',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    label: 'Craft Patron',
    role: 'buyer',
  },
  {
    id: 'avatar-buyer-designer',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    label: 'Collector',
    role: 'buyer',
  },
  {
    id: 'avatar-buyer-curator',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    label: 'Art Curator',
    role: 'buyer',
  },
  {
    id: 'avatar-buyer-student',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    label: 'Craft Researcher',
    role: 'buyer',
  },
];

const DEFAULT_USERS: UserAccountRecord[] = [
  {
    id: 'user-vaishu',
    name: 'Vaishu Kalkuda',
    email: 'vaishukalkuda@gmail.com',
    password: 'password123',
    phone: '+91 98123 45678',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: 'artisan',
    authProvider: 'google',
    isVerified: true,
    joinedDate: '12 January 2026',
    bio: 'Patron of traditional Indian terracotta arts',
  },
  {
    id: 'user-parvati',
    name: 'Parvati Devi',
    email: 'parvati@kalasetu.org',
    password: 'craft123',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role: 'artisan',
    authProvider: 'phone',
    isVerified: true,
    joinedDate: '15 August 2025',
    bio: 'Master terracotta artisan & sculptor (28 yrs exp)',
  },
  {
    id: 'user-raghav',
    name: 'Raghav Sharma',
    email: 'raghav.sharma@gmail.com',
    password: 'buyer123',
    phone: '+91 94567 89012',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'buyer',
    authProvider: 'email',
    isVerified: true,
    joinedDate: '3 February 2026',
    bio: 'Conscious collector & supporter of Indian heritage',
  },
];

export function getRegisteredUsers(): UserAccountRecord[] {
  let list: UserAccountRecord[] = [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    }
  } catch (e) {
    console.error('Error reading registered users:', e);
  }

  // Ensure all 3 required demo accounts exist and have correct passwords and roles
  for (const def of DEFAULT_USERS) {
    const idx = list.findIndex(
      (u) => u.email?.toLowerCase() === def.email?.toLowerCase() || u.id === def.id
    );
    if (idx === -1) {
      list.push(def);
    } else {
      list[idx] = {
        ...list[idx],
        id: def.id,
        email: def.email,
        name: def.name,
        password: def.password,
        role: def.role,
      };
    }
  }

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }
  return list;
}

export function saveRegisteredUsers(users: UserAccountRecord[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save registered users:', e);
  }
}

export function getActiveUserSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return null;
}

export function setActiveUserSession(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_KEY);
    }
  } catch {
    // ignore
  }
}

export function findUserByEmail(email: string): UserAccountRecord | undefined {
  const users = getRegisteredUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email?.toLowerCase() === normalized);
}

export function findUserByPhone(phone: string): UserAccountRecord | undefined {
  const users = getRegisteredUsers();
  const cleanedTarget = phone.replace(/\D/g, '').slice(-10);
  return users.find((u) => {
    if (!u.phone) return false;
    const cleaned = u.phone.replace(/\D/g, '').slice(-10);
    return cleaned === cleanedTarget;
  });
}

export function registerNewUser(account: {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  avatarUrl?: string;
  role: UserRole;
  authProvider: 'phone' | 'google' | 'email';
  bio?: string;
}): { success: boolean; error?: string; user?: AuthUser } {
  const users = getRegisteredUsers();

  if (account.email) {
    const existing = findUserByEmail(account.email);
    if (existing) {
      return {
        success: false,
        error: 'This email is already registered. Please login.',
      };
    }
  }

  if (account.phone) {
    const existing = findUserByPhone(account.phone);
    if (existing) {
      return {
        success: false,
        error: 'This phone number is already registered.',
      };
    }
  }

  const defaultAvatar =
    account.role === 'artisan'
      ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  const newUser: UserAccountRecord = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: account.name.trim(),
    email: account.email?.trim().toLowerCase(),
    phone: account.phone?.trim(),
    password: account.password,
    avatarUrl: account.avatarUrl || defaultAvatar,
    role: account.role,
    authProvider: account.authProvider,
    isVerified: true,
    joinedDate: new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    bio: account.bio || (account.role === 'artisan' ? 'Master Artisan' : 'Art Patron'),
    customAvatar: Boolean(account.avatarUrl && account.avatarUrl !== defaultAvatar),
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  setActiveUserSession(newUser);

  // Sync with Firestore collection 'users'
  saveUserToFirestore(newUser).catch((err) => {
    console.warn('[Firestore] Background user sync warning:', err);
  });

  // Attempt Firebase Auth account creation if email + password provided
  if (account.email && account.password) {
    createUserWithEmailAndPassword(auth, account.email, account.password).catch((fbErr) => {
      // If user already exists in Firebase Auth or offline, that's fine
      console.log('[Firebase Auth] Note on background signup:', fbErr?.message || fbErr);
    });
  }

  return { success: true, user: newUser };
}

export function loginUserWithEmail(
  email: string,
  pass: string
): { success: boolean; error?: string; user?: AuthUser } {
  const user = findUserByEmail(email);
  if (!user) {
    return {
      success: false,
      error: 'Email not registered. Please sign up.',
    };
  }

  if (user.password && user.password !== pass) {
    return {
      success: false,
      error: 'Incorrect password. Please try again.',
    };
  }

  setActiveUserSession(user);

  // Sync to Firestore in background
  saveUserToFirestore(user).catch(() => {});

  // Also trigger Firebase Auth login in background if available
  signInWithEmailAndPassword(auth, email, pass).catch(() => {});

  return { success: true, user };
}

export function loginUserWithPhone(
  phone: string,
  nameIfNew?: string,
  roleIfNew: UserRole = 'artisan'
): { success: boolean; error?: string; user: AuthUser } {
  let user = findUserByPhone(phone);
  if (!user) {
    // Auto register phone user
    const cleaned = phone.replace(/\D/g, '').slice(-10);
    const result = registerNewUser({
      name: nameIfNew?.trim() || (roleIfNew === 'artisan' ? 'Master Artisan' : 'Art Patron'),
      phone: `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`,
      role: roleIfNew,
      authProvider: 'phone',
    });
    if (result.user) {
      return { success: true, user: result.user };
    }
  }

  setActiveUserSession(user!);
  saveUserToFirestore(user!).catch(() => {});
  return { success: true, user: user! };
}

export function loginUserWithGoogle(
  email: string,
  name: string,
  avatarUrl: string,
  role: UserRole
): { success: boolean; user: AuthUser } {
  let user = findUserByEmail(email);
  if (!user) {
    const users = getRegisteredUsers();
    const newUser: UserAccountRecord = {
      id: `user-google-${email.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: name,
      email: email.toLowerCase(),
      avatarUrl: avatarUrl,
      role: role,
      authProvider: 'google',
      isVerified: true,
      joinedDate: new Date().toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      bio: 'Google Verified Account',
      customAvatar: true,
    };
    users.push(newUser);
    saveRegisteredUsers(users);
    user = newUser;
  }

  setActiveUserSession(user);
  saveUserToFirestore(user).catch(() => {});
  return { success: true, user };
}

/**
 * Real Google Sign-In with Firebase Authentication popup
 */
export async function signInWithFirebaseGoogle(
  role: UserRole = 'artisan'
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const name = fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Google User');
    const email = fbUser.email || '';
    const avatarUrl =
      fbUser.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

    const authUser: AuthUser = {
      id: fbUser.uid,
      name,
      email,
      avatarUrl,
      avatar: avatarUrl,
      role,
      language: 'hi',
      authProvider: 'google',
      isVerified: true,
      joinedDate: new Date().toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      bio: 'Google Verified Account',
    };

    // Save to Firestore collection 'users'
    await saveUserToFirestore(authUser);

    // Save to local cache & session
    const users = getRegisteredUsers();
    const existingIdx = users.findIndex((u) => u.email === email || u.id === fbUser.uid);
    if (existingIdx !== -1) {
      users[existingIdx] = { ...users[existingIdx], ...authUser };
    } else {
      users.push({ ...authUser, customAvatar: true });
    }
    saveRegisteredUsers(users);
    setActiveUserSession(authUser);

    return { success: true, user: authUser };
  } catch (error: any) {
    console.warn('[Firebase Auth] Google popup sign-in error:', error);
    return {
      success: false,
      error: error?.message || 'Google Sign-In popup could not complete. You can also select your Google account below.',
    };
  }
}

export function updateUserProfilePhoto(
  userId: string,
  newAvatarUrl: string
): { success: boolean; user?: AuthUser } {
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  let updatedUser: AuthUser | undefined;

  if (idx !== -1) {
    users[idx].avatarUrl = newAvatarUrl;
    users[idx].customAvatar = true;
    saveRegisteredUsers(users);
    setActiveUserSession(users[idx]);
    updatedUser = users[idx];
  } else {
    const active = getActiveUserSession();
    if (active && active.id === userId) {
      active.avatarUrl = newAvatarUrl;
      setActiveUserSession(active);
      updatedUser = active;
    }
  }

  if (updatedUser) {
    // Sync to Firestore & Storage in background
    uploadProductImage(newAvatarUrl, 'avatars').then((storedUrl) => {
      if (storedUrl && storedUrl !== newAvatarUrl && updatedUser) {
        updatedUser.avatarUrl = storedUrl;
        updatedUser.avatar = storedUrl;
        saveUserToFirestore(updatedUser);
      } else if (updatedUser) {
        saveUserToFirestore(updatedUser);
      }
    }).catch(() => {
      if (updatedUser) saveUserToFirestore(updatedUser);
    });

    return { success: true, user: updatedUser };
  }

  return { success: false };
}

/**
 * Sends a password reset email via Firebase Authentication
 */
export async function firebaseSendPasswordReset(
  email: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    await setPersistence(auth, browserLocalPersistence).catch(() => {});
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: 'Password reset link sent to your email!',
    };
  } catch (err: any) {
    console.warn('[Firebase Auth] Password reset error:', err);
    return {
      success: false,
      message: 'Could not send reset email',
      error:
        err?.code === 'auth/user-not-found'
          ? 'Email not registered'
          : err?.message || 'Error sending password reset email',
    };
  }
}

/**
 * Creates a new user in Firebase Auth and generates the users/{uid} document in Firestore
 * complying with Requirement 7:
 * { email, displayName, role, language, createdAt, location: null, hasCompletedOnboarding: false }
 */
export async function firebaseSignUpWithEmail({
  name,
  email,
  password,
  role,
  language = 'en',
  avatarUrl,
}: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  language?: string;
  avatarUrl?: string;
}): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    await setPersistence(auth, browserLocalPersistence).catch(() => {});
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    await updateProfile(fbUser, { displayName: name.trim() }).catch(() => {});

    const defaultAvatar =
      avatarUrl ||
      (role === 'artisan'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

    const userDocData = {
      id: fbUser.uid,
      email: fbUser.email || email.trim().toLowerCase(),
      displayName: name.trim(),
      name: name.trim(),
      role: role,
      language: language,
      avatar: defaultAvatar,
      avatarUrl: defaultAvatar,
      location: null,
      hasCompletedOnboarding: false,
      createdAt: new Date().toISOString(),
      joinedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      authProvider: 'email' as const,
      isVerified: true,
    };

    // Requirement 7: Create users/{uid} in Firestore
    await setDoc(doc(db, 'users', fbUser.uid), userDocData, { merge: true });
    console.log(`[Auth] Sign up success: ${fbUser.email || email}`);

    const authUser: AuthUser = {
      id: fbUser.uid,
      name: name.trim(),
      email: fbUser.email || email.trim().toLowerCase(),
      role: role,
      avatarUrl: defaultAvatar,
      avatar: defaultAvatar,
      language: language,
      authProvider: 'email',
      isVerified: true,
      joinedDate: userDocData.joinedDate,
      hasCompletedOnboarding: false,
    };

    // Cache locally as well
    const users = getRegisteredUsers();
    users.push({ ...authUser, password });
    saveRegisteredUsers(users);
    setActiveUserSession(authUser);

    return { success: true, user: authUser };
  } catch (err: any) {
    console.warn('[Firebase Auth] Sign up error:', err);
    // If account already exists locally or in demo seed
    const localReg = registerNewUser({
      name,
      email,
      password,
      role,
      authProvider: 'email',
      avatarUrl,
    });
    if (localReg.success && localReg.user) {
      console.log(`[Auth] Sign up success: ${email}`);
      return { success: true, user: localReg.user };
    }
    return {
      success: false,
      error:
        err.code === 'auth/operation-not-allowed'
          ? 'Email sign-in is currently unavailable. Please contact support or use Google Sign-In.'
          : err.code === 'auth/email-already-in-use'
          ? 'Email already registered'
          : err.code === 'auth/weak-password'
          ? 'Password must be at least 6 characters'
          : err?.message || 'Sign up failed',
    };
  }
}

/**
 * Logs in with Firebase Auth, checking users/{uid} for role and falling back to seed accounts
 */
export async function firebaseLoginWithEmail(
  email: string,
  pass: string
): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
  try {
    await setPersistence(auth, browserLocalPersistence).catch(() => {});
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const fbUser = cred.user;

    const userDocSnap = await getDoc(doc(db, 'users', fbUser.uid)).catch(() => null);
    const data = userDocSnap?.exists() ? userDocSnap.data() : null;

    const role: UserRole =
      (data?.role as UserRole) ||
      (email.toLowerCase().includes('buyer') || email.toLowerCase().includes('raghav') ? 'buyer' : 'artisan');
    const name = data?.displayName || data?.name || fbUser.displayName || email.split('@')[0];
    const avatar =
      data?.avatar ||
      data?.avatarUrl ||
      fbUser.photoURL ||
      (role === 'artisan'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');

    const authUser: AuthUser = {
      id: fbUser.uid,
      name,
      email: fbUser.email || email,
      role,
      avatarUrl: avatar,
      avatar,
      language: data?.language || 'en',
      authProvider: 'email',
      isVerified: true,
      joinedDate: data?.joinedDate || new Date().toLocaleDateString('en-IN'),
      hasCompletedOnboarding: data?.hasCompletedOnboarding ?? true,
    };

    setActiveUserSession(authUser);
    return { success: true, user: authUser };
  } catch (err: any) {
    console.warn('[Firebase Auth] Login note:', err?.code, err?.message);
    // Check against seed demo accounts (Vaishu Kalkuda, Raghav Sharma, Parvati Devi)
    const localResult = loginUserWithEmail(email, pass);
    if (localResult.success && localResult.user) {
      return localResult;
    }
    return {
      success: false,
      error:
        err.code === 'auth/operation-not-allowed'
          ? 'Email sign-in is currently unavailable. Please contact support or use Google Sign-In.'
          : err.code === 'auth/invalid-credential' ||
            err.code === 'auth/wrong-password' ||
            err.code === 'auth/user-not-found' ||
            err.code === 'auth/invalid-email'
          ? 'Invalid email or password'
          : err?.message || 'Login failed',
    };
  }
}

/**
 * Updates a user's role in Firestore users/{uid}
 */
export async function saveUserRoleToFirestore(uid: string, role: UserRole, email?: string): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await setDoc(
    userRef,
    {
      id: uid,
      role,
      ...(email ? { email } : {}),
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
