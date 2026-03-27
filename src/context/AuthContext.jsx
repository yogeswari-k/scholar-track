// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { buildDefaultSubjects } from '../utils/cseData';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, 'students', u.uid));
        setProfile(snap.exists() ? snap.data() : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
  }, []);

  async function register({ email, password, name, rollNumber, currentSemester, batch, collegeName }) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    const profileData = { uid, name, rollNumber, email, currentSemester: +currentSemester, batch, collegeName, department: 'B.Tech CSE', createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'students', uid), profileData);
    // Init current sem subjects
    const subjects = buildDefaultSubjects(+currentSemester);
    await setDoc(doc(db, 'students', uid, 'semesters', String(currentSemester)), { subjects });
    setProfile(profileData);
    return cred;
  }

  async function login(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const snap = await getDoc(doc(db, 'students', cred.user.uid));
    if (snap.exists()) setProfile(snap.data());
    return cred;
  }

  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
