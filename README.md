# 📚 Scholar Track — React + Firebase

## B.Tech CSE Student Academic Tracker

---

## 🗂️ Complete File Structure

```
scholar-track/
├── public/
│   └── index.html
├── src/
│   ├── index.js                        # React entry
│   ├── index.css                       # Full institution theme
│   ├── App.jsx                         # Root + routing
│   ├── context/
│   │   └── AuthContext.jsx             # Firebase Auth + profile
│   ├── services/
│   │   ├── firebase.js                 # 🔧 Add your config here
│   │   └── dataService.js             # Firestore CRUD
│   ├── utils/
│   │   └── cseData.js                  # All 8 sem subjects + CGPA calc
│   └── components/
│       ├── auth/
│       │   └── AuthPage.jsx            # Login + Register
│       ├── shared/
│       │   └── Sidebar.jsx             # Navigation
│       ├── dashboard/
│       │   └── Dashboard.jsx           # CGPA, SGPA chart, overview
│       ├── subjects/
│       │   └── SubjectsPage.jsx        # Unit checklist + Internal marks
│       ├── grades/
│       │   └── GradesPage.jsx          # 8-sem grade book
│       ├── attendance/
│       │   └── AttendancePage.jsx      # Absent counter per subject
│       └── goals/
│           └── GoalsPage.jsx           # Daily / Learning / Projects / Upcoming
├── firestore.rules
└── package.json
```

---

## 🚀 Step-by-Step Setup

### STEP 1 — Prerequisites

Install Node.js 18+ from https://nodejs.org

```bash
node --version   # must be 18+
npm --version
```

---

### STEP 2 — Create React App

```bash
npx create-react-app scholar-track
cd scholar-track
```

Then replace all generated files with these project files.

---

### STEP 3 — Install Dependencies

```bash
npm install firebase recharts react-router-dom date-fns react-hot-toast lucide-react
```

---

### STEP 4 — Create Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **Add project** → name it `scholar-track`
3. Disable Google Analytics → Create

#### Enable Authentication:
- Sidebar → **Authentication** → Get started
- Sign-in method → **Email/Password** → Enable → Save

#### Enable Firestore:
- Sidebar → **Firestore Database** → Create database
- Select **Production mode** → choose region (`asia-south1` for India) → Enable

---

### STEP 5 — Get Firebase Config

1. Firebase Console → ⚙️ Project Settings → **Your apps**
2. Click **</>** (Web app icon) → Register app → name it `scholar-track`
3. Copy the `firebaseConfig` object

Paste it into `src/services/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "scholar-track-xxxx.firebaseapp.com",
  projectId: "scholar-track-xxxx",
  storageBucket: "scholar-track-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

---

### STEP 6 — Set Firestore Security Rules

Firebase Console → Firestore → **Rules** tab → paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{sub=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Click **Publish**.

---

### STEP 7 — Run the App

```bash
npm start
```

Open http://localhost:3000

---

### STEP 8 — Build for Production

```bash
npm run build
```

Deploy the `build/` folder to:
- **Firebase Hosting**: `npm install -g firebase-tools && firebase deploy`
- **Vercel**: `npx vercel --prod`
- **Netlify**: Drag & drop `build/` folder

---

## 🎯 Features

| Page | What it does |
|---|---|
| 🔐 Auth | Email/password login & registration with student profile |
| 📊 Dashboard | CGPA KPI, SGPA progression chart, unit coverage, today's goals, reminder banner |
| 📚 Subjects | Current sem — unit-wise checklist, internal marks (IA1 + IA2 + Assignment) |
| 🏆 Grade Book | All 8 semesters with SGPA per sem, grade picker (O/A+/A/B+/B/C/F) |
| 📅 Attendance | Per-subject absent counter, attendance %, radial gauge, detention warning |
| 🎯 Goals | Daily goals, learning path, projects done, upcoming goals with due dates |

---

## 🎨 Design Theme — Institution Classic

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#0D1B3E` | Primary surfaces, headings |
| `--gold` | `#C9A84C` | Accents, active states |
| `--cream` | `#FAF6EE` | Page background |
| `--parchment` | `#F2ECD8` | Card backgrounds |
| Font Display | Playfair Display | Headings, numbers |
| Font Body | Lora | Body text |
| Font UI | Source Serif 4 | Labels, navigation |

---

## 🔧 Firestore Data Structure

```
students/{uid}
  ├── name, rollNumber, email, currentSemester, batch, collegeName
  ├── semesters/{1..8}
  │     └── subjects: [ { id, code, name, grade, gradePoints, credits,
  │                        internalMark1, internalMark2, assignmentMark,
  │                        absentCount, unitProgress: [{unitNumber, completed}] } ]
  └── goals/{goalId}
        └── title, description, type, status, createdAt, dueDate, completedAt
```

---

## ⚠️ Troubleshooting

| Issue | Fix |
|---|---|
| Firebase config error | Double-check `firebase.js` with exact values from console |
| `auth/email-already-in-use` | Email already registered, use login |
| Firestore permission denied | Publish the security rules (Step 6) |
| Blank page | Check browser console for errors, ensure `npm install` ran |
| Fonts not loading | Check internet connection (loads from Google Fonts) |
