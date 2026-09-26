import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../components/Toast';
import AssignmentForm from '../components/AssignmentForm';
import EmptyState from '../components/EmptyState';
import { getCourses } from '../utils/calculations';

export default function CreateAssignment() {
  const { assignmentId } = useParams();
  const { assignments, students, createAssignment, updateAssignment } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const isEditing = Boolean(assignmentId);
  const existing = isEditing ? assignments.find((item) => item.id === assignmentId) : null;

  if (isEditing && !existing) {
    return (
      <EmptyState
        icon={FileText}
        title="Assignment not found"
        description="It may have been deleted while you were editing."
        action={
          <button
            type="button"
            onClick={() => navigate('/admin/assignments')}
            className="btn-primary"
          >
            Back to assignments
          </button>
        }
      />
    );
  }

  const courses = getCourses(assignments);

  const handleSubmit = (values) => {
    if (isEditing) {
      updateAssignment(existing.id, values);
      showToast('Assignment updated.');
    } else {
      createAssignment(values);
      showToast('Assignment created and assigned to students.');
    }

    navigate('/admin/assignments');
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      <header>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {isEditing ? 'Edit assignment' : 'Create assignment'}
        </h2>
      </header>

      <AssignmentForm
        initialValues={existing}
        students={students}
        courses={courses}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
        submitLabel={isEditing ? 'Save changes' : 'Create assignment'}
      />
    </div>
  );
}