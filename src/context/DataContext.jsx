import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { admin, createInitialData, students } from '../data/mockData';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';

const DataContext = createContext(null);

function loadData() {
  const assignments = readStorage(STORAGE_KEYS.assignments, null);
  const submissions = readStorage(STORAGE_KEYS.submissions, null);

  if (Array.isArray(assignments) && Array.isArray(submissions)) {
    return { assignments, submissions };
  }

  return createInitialData();
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.assignments, data.assignments);
  }, [data.assignments]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.submissions, data.submissions);
  }, [data.submissions]);

  const createAssignment = useCallback((values) => {
    const id = `a${Date.now()}`;

    const assignment = {
      id,
      ...values,
      createdBy: admin.id,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const newSubmissions = values.assignedTo.map((studentId) => ({
      id: `${id}-${studentId}`,
      assignmentId: id,
      studentId,
      status: 'not-submitted',
      submittedAt: null,
      marks: null,
    }));

    setData((current) => ({
      assignments: [assignment, ...current.assignments],
      submissions: [...current.submissions, ...newSubmissions],
    }));

    return assignment;
  }, []);

  const updateAssignment = useCallback((id, values) => {
    setData((current) => {
      const assignments = current.assignments.map((assignment) =>
        assignment.id === id ? { ...assignment, ...values } : assignment
      );

      const previous = current.submissions.filter((submission) => submission.assignmentId === id);
      const others = current.submissions.filter((submission) => submission.assignmentId !== id);

      const nextSubmissions = values.assignedTo.map(
        (studentId) =>
          previous.find((submission) => submission.studentId === studentId) ?? {
            id: `${id}-${studentId}`,
            assignmentId: id,
            studentId,
            status: 'not-submitted',
            submittedAt: null,
            marks: null,
          }
      );

      return { assignments, submissions: [...others, ...nextSubmissions] };
    });
  }, []);

  const deleteAssignment = useCallback((id) => {
    setData((current) => ({
      assignments: current.assignments.filter((assignment) => assignment.id !== id),
      submissions: current.submissions.filter((submission) => submission.assignmentId !== id),
    }));
  }, []);

  const markSubmitted = useCallback((assignmentId, studentId) => {
    setData((current) => {
      const submittedAt = new Date().toISOString();

      const exists = current.submissions.some(
        (submission) => submission.assignmentId === assignmentId && submission.studentId === studentId
      );

      const submissions = exists
        ? current.submissions.map((submission) =>
            submission.assignmentId === assignmentId && submission.studentId === studentId
              ? { ...submission, status: 'submitted', submittedAt }
              : submission
          )
        : [
            ...current.submissions,
            {
              id: `${assignmentId}-${studentId}`,
              assignmentId,
              studentId,
              status: 'submitted',
              submittedAt,
              marks: null,
            },
          ];

      return { ...current, submissions };
    });
  }, []);

  const setMarks = useCallback((assignmentId, studentId, marks) => {
    setData((current) => ({
      ...current,
      submissions: current.submissions.map((submission) =>
        submission.assignmentId === assignmentId && submission.studentId === studentId
          ? { ...submission, marks: marks == null ? null : Number(marks) }
          : submission
      ),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(createInitialData());
  }, []);

  const value = useMemo(
    () => ({
      assignments: data.assignments,
      submissions: data.submissions,
      students,
      createAssignment,
      updateAssignment,
      deleteAssignment,
      markSubmitted,
      setMarks,
      resetData,
    }),
    [data, createAssignment, updateAssignment, deleteAssignment, markSubmitted, setMarks, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used inside a DataProvider');
  }

  return context;
}