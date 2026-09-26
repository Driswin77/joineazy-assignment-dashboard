const today = () => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  return date;
};

const isoDate = (offsetInDays) => {
  const date = today();
  date.setDate(date.getDate() + offsetInDays);
  return date.toISOString().slice(0, 10);
};

const isoDateTime = (offsetInDays) => {
  const date = new Date();
  date.setDate(date.getDate() + offsetInDays);
  return date.toISOString();
};

export const students = [
  {
    id: 'u1',
    name: 'Driswin Kumar',
    email: 'student@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-014',
    enrolledCourses: ['Web Development', 'Database Systems', 'Data Structures'],
  },
  {
    id: 'u2',
    name: 'Rahul Menon',
    email: 'rahul.menon@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-021',
    enrolledCourses: ['Web Development', 'Database Systems'],
  },
  {
    id: 'u3',
    name: 'Anu Thomas',
    email: 'anu.thomas@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-007',
    enrolledCourses: ['Web Development', 'Design Fundamentals'],
  },
  {
    id: 'u4',
    name: 'Arjun Nair',
    email: 'arjun.nair@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-032',
    enrolledCourses: ['Data Structures', 'Operating Systems'],
  },
  {
    id: 'u5',
    name: 'Neha Joseph',
    email: 'neha.joseph@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-045',
    enrolledCourses: ['Web Development', 'Design Fundamentals', 'Operating Systems'],
  },
  {
    id: 'u6',
    name: 'Vivek Raj',
    email: 'vivek.raj@joineazy.demo',
    password: 'student123',
    role: 'student',
    course: 'B.Tech Computer Science',
    year: '3rd year',
    rollNo: 'CSE-21-052',
    enrolledCourses: ['Database Systems', 'Data Structures', 'Operating Systems'],
  },
];

export const admin = {
  id: 'admin1',
  name: 'Meera Krishnan',
  email: 'admin@joineazy.demo',
  password: 'admin123',
  role: 'admin',
  title: 'Assistant Professor',
  department: 'Computer Science',
};

export const accounts = [...students, admin];

export const demoAccounts = [
  { role: 'Student', name: 'Driswin Kumar', email: 'student@joineazy.demo', password: 'student123' },
  { role: 'Admin', name: 'Meera Krishnan', email: 'admin@joineazy.demo', password: 'admin123' },
];

const assignmentSeed = [
  {
    id: 'a1',
    title: 'React Dashboard Implementation',
    course: 'Web Development',
    description: 'Build a responsive admin dashboard using reusable React components and hooks.',
    instructions:
      'Use React with functional components and hooks. Keep the layout responsive down to 390px. Push the source code to the shared Drive folder and include a short README describing your component structure.',
    dueInDays: 3,
    createdInDays: -9,
    maxMarks: 50,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-react-dashboard',
  },
  {
    id: 'a2',
    title: 'SQL Query Assignment',
    course: 'Database Systems',
    description: 'Write a set of SELECT, JOIN and aggregate queries against the supplied schema.',
    instructions:
      'Answer all 12 questions in a single .sql file. Use comments to number each answer. Upload the file to the Drive folder.',
    dueInDays: -2,
    createdInDays: -14,
    maxMarks: 30,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-sql-queries',
  },
  {
    id: 'a3',
    title: 'UI/UX Case Study',
    course: 'Design Fundamentals',
    description: 'Pick a real product and document a redesign of one core flow.',
    instructions:
      'Include problem statement, wireframes and a short rationale. Export as PDF and place it in the Drive folder.',
    dueInDays: 8,
    createdInDays: -6,
    maxMarks: 40,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-ux-case-study',
  },
  {
    id: 'a4',
    title: 'JavaScript ES6 Practice',
    course: 'Web Development',
    description: 'Solve the ES6 problem set covering destructuring, spread and modules.',
    instructions:
      'Submit one .js file per problem in a single folder. Do not use external libraries.',
    dueInDays: -6,
    createdInDays: -20,
    maxMarks: 25,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-es6-practice',
  },
  {
    id: 'a5',
    title: 'Web Development Project',
    course: 'Web Development',
    description: 'Build a small full frontend project of your choice and document it.',
    instructions:
      'The project must include at least three routes, form validation and a responsive layout. Submit the repository link and a screenshot walkthrough.',
    dueInDays: 16,
    createdInDays: -4,
    maxMarks: 100,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-web-project',
  },
  {
    id: 'a6',
    title: 'Database Design Assignment',
    course: 'Database Systems',
    description: 'Design an ER model and normalise it up to third normal form.',
    instructions:
      'Include the ER diagram, relational schema and a short note on the normalisation steps. Upload a single PDF.',
    dueInDays: 21,
    createdInDays: -3,
    maxMarks: 50,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-db-design',
  },
  {
    id: 'a7',
    title: 'Data Structures Problem Set',
    course: 'Data Structures',
    description: 'Implement and analyse the assigned problems on trees and graphs.',
    instructions:
      'Submit source files along with a short complexity note for each problem.',
    dueInDays: 1,
    createdInDays: -11,
    maxMarks: 40,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-ds-problems',
  },
  {
    id: 'a8',
    title: 'Operating Systems Lab Record',
    course: 'Operating Systems',
    description: 'Compile the lab record for scheduling and memory management experiments.',
    instructions:
      'Follow the standard lab format. Include output screenshots for every experiment.',
    dueInDays: 11,
    createdInDays: -8,
    maxMarks: 30,
    submissionLink: 'https://drive.google.com/drive/folders/joineazy-os-lab',
  },
];

const submissionSeed = {
  a1: { u1: 'submitted', u2: 'submitted', u3: 'submitted', u4: 'not-submitted', u5: 'submitted', u6: 'not-submitted' },
  a2: { u1: 'not-submitted', u2: 'submitted', u3: 'submitted', u4: 'not-submitted', u5: 'not-submitted', u6: 'submitted' },
  a3: { u1: 'not-submitted', u2: 'not-submitted', u3: 'submitted', u4: 'not-submitted', u5: 'submitted', u6: 'not-submitted' },
  a4: { u1: 'submitted', u2: 'submitted', u3: 'submitted', u4: 'submitted', u5: 'not-submitted', u6: 'submitted' },
  a5: { u1: 'not-submitted', u2: 'submitted', u3: 'not-submitted', u4: 'not-submitted', u5: 'not-submitted', u6: 'not-submitted' },
  a6: { u1: 'submitted', u2: 'not-submitted', u3: 'submitted', u4: 'submitted', u5: 'submitted', u6: 'not-submitted' },
  a7: { u1: 'submitted', u2: 'submitted', u3: 'not-submitted', u4: 'not-submitted', u5: 'submitted', u6: 'submitted' },
  a8: { u1: 'submitted', u2: 'not-submitted', u3: 'not-submitted', u4: 'submitted', u5: 'submitted', u6: 'not-submitted' },
};

function pseudoMarks(assignment, studentId) {
  const seed = `${assignment.id}-${studentId}`
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  const min = Math.round(assignment.maxMarks * 0.6);
  const max = assignment.maxMarks;
  return min + (seed % (max - min + 1));
}

function studentsInCourse(course) {
  return students.filter((student) => student.enrolledCourses.includes(course));
}

export function createInitialData() {
  const assignments = assignmentSeed.map(({ dueInDays, createdInDays, ...rest }) => ({
    ...rest,
    assignedTo: studentsInCourse(rest.course).map((student) => student.id),
    dueDate: isoDate(dueInDays),
    createdAt: isoDate(createdInDays),
    createdBy: admin.id,
  }));

  const submissions = [];

  assignments.forEach((assignment, index) => {
    const seed = submissionSeed[assignment.id] ?? {};

    assignment.assignedTo.forEach((studentId) => {
      const status = seed[studentId] ?? 'not-submitted';
      const submitted = status === 'submitted';

      submissions.push({
        id: `${assignment.id}-${studentId}`,
        assignmentId: assignment.id,
        studentId,
        status,
        submittedAt: submitted ? isoDateTime(-((index % 6) + 1)) : null,
        marks: submitted ? pseudoMarks(assignment, studentId) : null,
      });
    });
  });

  return { assignments, submissions };
}