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
    { code: 'PH101', name: 'Physics', credits: 4, units: 5 },
    { code: 'CH101', name: 'Chemistry', credits: 4, units: 5 },
    { code: 'ME101', name: 'Workshop and manufacturing Practice', credits: 4, units: 5 },
    { code: 'PH101', name: 'Physics Laboratory', credits: 1.5},
    { code: 'CY101', name: 'Chemistry Laboratory', credits: 1.5},
    { code: 'HS101', name: 'English Communication', credits: 3, units: 4 },
  ],
  2: [
    { code: 'MA201', name: 'Engineering Mathematics II', credits: 4, units: 5 },
    { code: 'EE201', name: 'Basic Electrical Engineering', credits: 4, units: 5 },
    { code: 'ME201', name: 'Engineering Graphics', credits: 3, units: 5 },
    { code: 'CS201', name: 'Programming for Problem Solving', credits: 3, units: 5 },
    { code: 'EE202', name: 'Basic Electrical Engineering Laboratory', credits: 3, units: 5 },
    { code: 'CS202', name: 'Programming Laboratory', credits: 1.5, units: 3 },
  ],
  3: [
    { code: 'SH301', name: 'Biology for Engineers', credits: 2, units: 5 },
    { code: 'EC302', name: 'Electronics Devices and Digital Systems', credits: 3, units: 5 },
    { code: 'CS303', name: 'Computer Organization and Architecture', credits: 4, units: 5 },
    { code: 'CS304', name: 'Data Structures', credits: 3, units: 5 },
    { code: 'CS305', name: 'Object Oriented Programming Language', credits: 3, units: 5 },
    { code: 'CS336', name: 'Electronics Devices and Digital Systems Laboratory', credits: 1.5, units: 4 },
    { code: 'CS304', name: 'Data Structures Laboratory', credits: 1.5, units: 3 },
    { code: 'CS305', name: 'Object Oriented Programming Language Laboratory', credits: 1.5, units: 3 },
  ],
  4: [
    { code: 'MA206', name: 'Mathematics for Computing', credits: 4, units: 5 },
    { code: 'CS208', name: 'Operating System', credits: 3, units: 5 },
    { code: 'CS209', name: 'Design and Analysis of Algorithms', credits: 3, units: 5 },
    { code: 'CS210', name: 'Database Management Systems', credits: 3, units: 5 },
    { code: 'CS211', name: 'Software Engineering', credits: 4, units: 5 },
    { code: 'CS212', name: 'Operating System Laboratory', credits: 1.5, units: 4 },
    { code: 'CS213', name: 'Algorithm Laboratory', credits: 1.5, units: 4 },
    { code: 'CS214', name: 'Database Management Systems Laboratory', credits: 1.5, units: 4 },
  ],
  5: [
    { code: 'MS202', name: 'Industrial Economics and Management', credits: 3, units: 5 },
    { code: 'CS215', name: 'Platform Technologies', credits: 3, units: 5 },
    { code: 'CS216', name: 'Computer Networks', credits: 3, units: 5 },
    { code: 'CS217', name: 'Automata theory and Compiler Design', credits: 4, units: 5 },
    { code: 'CSYXX', name: 'elective ', credits: 3, units: 4 },
    { code: 'CS218', name: 'Platform Technologies Laboratory', credits: 3, units: 4 },
    { code: 'CS219', name: 'Computer Networks Laboratory', credits: 1.5, units: 4 },
  ],
  6: [
    { code: 'EP201', name: 'entrepreneurship', credits: 2, units: 5 },
    { code: 'CS220', name: 'microprocessor and Microcontroller', credits: 3, units: 5 },
    { code: 'CS221', name: 'Web Technologies', credits: 3, units: 5 },
    { code: 'CS222', name: 'Information Security', credits: 4, units: 5 },
    { code: 'CSYXX', name: 'Professional Elective I', credits: 3, units: 4 },
    { code: 'CSYXX', name: 'Open Elective II', credits: 3, units: 4 },
    { code: 'CS220', name: 'microprocessor and Microcontroller Laboratory', credits: 1.5, units: 4 },
    { code: 'CS221', name: 'Web Technologies Laboratory', credits: 1.5, units: 4 },
  ],
  7: [
    { code: 'CS225', name: 'Artificial Intelligence', credits: 3, units: 5 },
    { code: 'CS226', name: 'Parallel and Distributed Systems', credits: 4, units: 5 },
    { code: 'CS227', name: 'Datascience Essentials', credits: 4, units: 4 },
    { code: 'CSYXX', name: 'Professional Elective II', credits: 3, units: 4 },
    { code: 'CSYXX', name: 'Professional Elective III', credits: 3, units: 4 },
    { code: 'CS228', name: 'Ai laboratory', credits: 1.5, units: 5 },
    { code: 'CS229', name: 'seminar', credits: 1, units: 5 },
  ],
  8: [
    { code: 'SWOXX', name: 'open elective 1', credits: 2  },
    { code: 'SWOXX', name: 'open elective 2', credits: 2  },
    { code: 'CS231', name: 'comphrensive test', credits: 1 },
    { code: 'CS232', name: 'internship', credits: 2 },
    { code: 'CS233', name: 'Project work', credits: 8 },
    
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
