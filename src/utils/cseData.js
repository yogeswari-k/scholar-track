// src/utils/cseData.js

export const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'F': 0
};

export const GRADE_COLORS = {
  'O': '#1B5E20', 'A+': '#2E7D32', 'A': '#1565C0',
  'B+': '#0277BD', 'B': '#E65100', 'C': '#BF360C', 'F': '#B71C1C'
};

export const CSE_SUBJECTS = {
  1: [
    { code: 'MA101', name: 'Engineering Mathematics I', credits: 4, units: 5 },
    { code: 'PH101', name: 'Engineering Physics', credits: 4, units: 5 },
    { code: 'CH101', name: 'Engineering Chemistry', credits: 4, units: 5 },
    { code: 'CS101', name: 'Programming in C', credits: 4, units: 5 },
    { code: 'ME101', name: 'Engineering Graphics', credits: 3, units: 4 },
    { code: 'EN101', name: 'English Communication', credits: 2, units: 4 },
  ],
  2: [
    { code: 'MA201', name: 'Engineering Mathematics II', credits: 4, units: 5 },
    { code: 'CS201', name: 'Data Structures', credits: 4, units: 5 },
    { code: 'EC201', name: 'Digital Electronics', credits: 4, units: 5 },
    { code: 'CS202', name: 'Object Oriented Programming (C++)', credits: 4, units: 5 },
    { code: 'MA202', name: 'Discrete Mathematics', credits: 3, units: 5 },
    { code: 'BS201', name: 'Environmental Science', credits: 2, units: 3 },
  ],
  3: [
    { code: 'CS301', name: 'Design & Analysis of Algorithms', credits: 4, units: 5 },
    { code: 'CS302', name: 'Computer Organization & Architecture', credits: 4, units: 5 },
    { code: 'CS303', name: 'Database Management Systems', credits: 4, units: 5 },
    { code: 'CS304', name: 'Operating Systems', credits: 4, units: 5 },
    { code: 'MA301', name: 'Mathematics for CS', credits: 3, units: 5 },
    { code: 'CS305', name: 'Software Engineering', credits: 3, units: 4 },
  ],
  4: [
    { code: 'CS401', name: 'Computer Networks', credits: 4, units: 5 },
    { code: 'CS402', name: 'Theory of Computation', credits: 4, units: 5 },
    { code: 'CS403', name: 'Java Programming', credits: 4, units: 5 },
    { code: 'CS404', name: 'Microprocessors & Interfacing', credits: 4, units: 5 },
    { code: 'MA401', name: 'Probability & Statistics', credits: 3, units: 5 },
    { code: 'CS405', name: 'Web Technologies', credits: 3, units: 4 },
  ],
  5: [
    { code: 'CS501', name: 'Machine Learning', credits: 4, units: 5 },
    { code: 'CS502', name: 'Compiler Design', credits: 4, units: 5 },
    { code: 'CS503', name: 'Information Security', credits: 4, units: 5 },
    { code: 'CS504', name: 'Cloud Computing', credits: 4, units: 5 },
    { code: 'CS505', name: 'Mobile Application Development', credits: 3, units: 4 },
    { code: 'OE501', name: 'Open Elective I', credits: 3, units: 4 },
  ],
  6: [
    { code: 'CS601', name: 'Artificial Intelligence', credits: 4, units: 5 },
    { code: 'CS602', name: 'Big Data Analytics', credits: 4, units: 5 },
    { code: 'CS603', name: 'Internet of Things', credits: 4, units: 5 },
    { code: 'CS604', name: 'Distributed Systems', credits: 3, units: 5 },
    { code: 'PE601', name: 'Professional Elective I', credits: 3, units: 4 },
    { code: 'OE601', name: 'Open Elective II', credits: 3, units: 4 },
  ],
  7: [
    { code: 'CS701', name: 'Deep Learning', credits: 4, units: 5 },
    { code: 'CS702', name: 'Natural Language Processing', credits: 4, units: 5 },
    { code: 'CS703', name: 'Blockchain Technology', credits: 3, units: 4 },
    { code: 'PE701', name: 'Professional Elective II', credits: 3, units: 4 },
    { code: 'PE702', name: 'Professional Elective III', credits: 3, units: 4 },
    { code: 'CS704', name: 'Project Phase I', credits: 4, units: 0 },
  ],
  8: [
    { code: 'CS801', name: 'Image Processing & Computer Vision', credits: 4, units: 5 },
    { code: 'CS802', name: 'Cyber Security', credits: 3, units: 4 },
    { code: 'PE801', name: 'Professional Elective IV', credits: 3, units: 4 },
    { code: 'OE801', name: 'Open Elective III', credits: 3, units: 4 },
    { code: 'CS803', name: 'Project Phase II', credits: 6, units: 0 },
    { code: 'CS804', name: 'Internship / Seminar', credits: 2, units: 0 },
  ],
};

export function buildDefaultSubjects(sem) {
  return (CSE_SUBJECTS[sem] || []).map((s, i) => ({
    id: `${sem}_${i}`,
    ...s,
    grade: null,
    gradePoints: null,
    internalMark1: 0,
    internalMark2: 0,
    assignmentMark: 0,
    absentCount: 0,
    unitProgress: Array.from({ length: s.units }, (_, u) => ({
      unitNumber: u + 1,
      title: `Unit ${u + 1}`,
      completed: false,
    })),
  }));
}

export function calcSGPA(subjects) {
  const graded = subjects.filter(s => s.gradePoints != null);
  if (!graded.length) return 0;
  const pts = graded.reduce((a, s) => a + s.gradePoints * s.credits, 0);
  const creds = graded.reduce((a, s) => a + s.credits, 0);
  return creds ? +(pts / creds).toFixed(2) : 0;
}

export function calcCGPA(allSubjects) {
  const graded = allSubjects.filter(s => s.gradePoints != null);
  if (!graded.length) return 0;
  const pts = graded.reduce((a, s) => a + s.gradePoints * s.credits, 0);
  const creds = graded.reduce((a, s) => a + s.credits, 0);
  return creds ? +(pts / creds).toFixed(2) : 0;
}
