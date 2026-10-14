import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import type { User, Address } from '../types';

// Indian English localized error translator
export function getLocalizedAuthError(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Kindly log in instead.';
    case 'auth/invalid-email':
      return 'Kindly provide a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Kindly enable it under Authentication > Sign-in method.';
    case 'auth/weak-password':
      return 'Password must be at least 8 characters in length. Kindly choose a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been suspended. Kindly get in touch with our customer care concierge.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email address or password. Kindly check your credentials and try again.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing authentication. Kindly try again.';
    case 'auth/popup-blocked':
      return 'Browser popup was blocked. Kindly allow popups for this boutique website.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to multiple failed login attempts. Kindly reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection issue encountered. Kindly verify your internet connection.';
    default:
      return error?.message || 'An unexpected error occurred during authentication. Kindly try again.';
  }
}

// Fetch user profile from Firestore
export async function getUserProfile(userId: string): Promise<User | null> {
  const docPath = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
  }
}

// Create or update user profile document in Firestore
export async function syncUserProfileDoc(
  fbUser: FirebaseUser,
  extra?: { name?: string; phone?: string; role?: 'CUSTOMER' | 'ADMIN' }
): Promise<User> {
  const userId = fbUser.uid;
  const docPath = `users/${userId}`;
  const now = new Date().toISOString();

  // Known administrator email verification
  const isBootstrapAdmin = fbUser.email?.toLowerCase() === 'pravalikagoli9@gmail.com' || fbUser.email?.toLowerCase() === 'admin@velmora.com';
  const assignedRole = extra?.role || (isBootstrapAdmin ? 'ADMIN' : 'CUSTOMER');

  try {
    const existing = await getUserProfile(userId);
    if (existing) {
      // Update existing if new fields provided
      if (extra?.name || extra?.phone) {
        const updates: Partial<User> = {
          name: extra.name || existing.name,
          updatedAt: now
        };
        await updateDoc(doc(db, 'users', userId), updates as any);
        return { ...existing, ...updates };
      }
      return existing;
    }

    // Initialize new patron profile
    const newUser: User = {
      id: userId,
      name: extra?.name || fbUser.displayName || 'VELMORA Patron',
      email: fbUser.email || '',
      role: assignedRole,
      accountStatus: 'ACTIVE',
      addresses: [],
      loyaltyPoints: 500, // 500 Welcome Member Bonus Points
      loyaltyTier: 'NOIR',
      loyaltyHistory: [
        {
          id: `ly_${Date.now()}`,
          date: now.split('T')[0],
          description: 'Welcome Member Privilege Points',
          points: 500,
          type: 'EARNED'
        }
      ],
      favoriteCategories: ['fragrances'],
      notificationPreferences: {
        priceDropAlerts: true,
        backInStockAlerts: true,
        orderUpdates: true,
        gazetteNewsletter: true
      },
      emailVerifiedAt: fbUser.emailVerified ? now : undefined,
      createdAt: now
    };

    await setDoc(doc(db, 'users', userId), newUser);

    // If admin, record in /admins directory as well
    if (assignedRole === 'ADMIN') {
      try {
        await setDoc(doc(db, 'admins', userId), {
          email: fbUser.email,
          role: 'ADMIN',
          createdAt: now
        });
      } catch {
        // Silently handled if admin table restricts
      }
    }

    return newUser;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

// 1. Sign Up with Email and Password
export async function signUpWithEmail(
  name: string,
  email: string,
  pass: string,
  phone?: string
): Promise<{ user: User | null; error?: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    await updateProfile(cred.user, { displayName: name.trim() });
    const patronProfile = await syncUserProfileDoc(cred.user, { name: name.trim(), phone });
    return { user: patronProfile };
  } catch (error: any) {
    return { user: null, error: getLocalizedAuthError(error) };
  }
}

// 2. Sign In with Email and Password
export async function signInWithEmail(
  email: string,
  pass: string
): Promise<{ user: User | null; error?: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    let patronProfile = await getUserProfile(cred.user.uid);
    if (!patronProfile) {
      patronProfile = await syncUserProfileDoc(cred.user);
    }
    return { user: patronProfile };
  } catch (error: any) {
    return { user: null, error: getLocalizedAuthError(error) };
  }
}

// 3. Sign In with Google Popup
export async function signInWithGoogle(): Promise<{ user: User | null; error?: string }> {
  try {
    const cred = await signInWithPopup(auth, googleProvider);
    let patronProfile = await getUserProfile(cred.user.uid);
    if (!patronProfile) {
      patronProfile = await syncUserProfileDoc(cred.user);
    }
    return { user: patronProfile };
  } catch (error: any) {
    return { user: null, error: getLocalizedAuthError(error) };
  }
}

// 4. Send Password Reset Email
export async function sendPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (error: any) {
    return { success: false, error: getLocalizedAuthError(error) };
  }
}

// 5. Sign Out
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// 6. Update Profile Information
export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, 'name' | 'favoriteCategories' | 'notificationPreferences' | 'addresses'>>
): Promise<{ success: boolean; error?: string }> {
  const docPath = `users/${userId}`;
  try {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, {
      ...data,
      updatedAt: new Date().toISOString()
    } as any);
    return { success: true };
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}
