// src/services/dataService.js
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { buildDefaultSubjects } from '../utils/cseData';

// ── SUBJECTS ────────────────────────────────────────────────────────────────

export async function getSemSubjects(uid, sem) {
  const ref = doc(db, 'students', uid, 'semesters', String(sem));
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data().subjects || [];
  // Auto-init
  const subjects = buildDefaultSubjects(sem);
  await setDoc(ref, { subjects });
  return subjects;
}

export async function saveSemSubjects(uid, sem, subjects) {
  await setDoc(doc(db, 'students', uid, 'semesters', String(sem)), { subjects });
}

export async function getAllSubjects(uid) {
  const all = [];
  for (let sem = 1; sem <= 8; sem++) {
    const ref = doc(db, 'students', uid, 'semesters', String(sem));
    const snap = await getDoc(ref);
    if (snap.exists()) all.push(...(snap.data().subjects || []));
  }
  return all;
}

// ── GOALS ────────────────────────────────────────────────────────────────────

export async function getGoals(uid) {
  const snap = await getDocs(collection(db, 'students', uid, 'goals'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addGoal(uid, goal) {
  const ref = await addDoc(collection(db, 'students', uid, 'goals'), {
    ...goal,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function updateGoal(uid, goalId, updates) {
  await updateDoc(doc(db, 'students', uid, 'goals', goalId), updates);
}

export async function deleteGoal(uid, goalId) {
  await deleteDoc(doc(db, 'students', uid, 'goals', goalId));
}

export async function getTodayGoals(uid) {
  const today = new Date().toISOString().split('T')[0];
  const all = await getGoals(uid);
  return all.filter(g => g.type === 'daily' && g.createdAt?.startsWith(today));
}
