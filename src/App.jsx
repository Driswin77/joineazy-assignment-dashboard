import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentAssignments from './pages/StudentAssignments';
import StudentCalendar from './pages/StudentCalendar';
import StudentSubmissions from './pages/StudentSubmissions';
import AssignmentDetails from './pages/AssignmentDetails';
import StudentProfile from './pages/StudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminAssignments from './pages/AdminAssignments';
import AdminAssignmentDetails from './pages/AdminAssignmentDetails';
import CreateAssignment from './pages/CreateAssignment';
import AdminStudents from './pages/AdminStudents';
import AdminReviews from './pages/AdminReviews';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';


function RequireAuth({ role }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return <Outlet />;
}

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<HomeRedirect />} />

              <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                  <Route element={<RequireAuth role="student" />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/assignments" element={<StudentAssignments />} />
                    <Route path="/student/assignments/:assignmentId" element={<AssignmentDetails />} />
                    <Route path="/student/calendar" element={<StudentCalendar />} />
                    <Route path="/student/submissions" element={<StudentSubmissions />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                  </Route>

                  <Route element={<RequireAuth role="admin" />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/assignments" element={<AdminAssignments />} />
                    <Route path="/admin/assignments/:assignmentId" element={<AdminAssignmentDetails />} />
                    <Route path="/admin/assignments/:assignmentId/edit" element={<CreateAssignment />} />
                    <Route path="/admin/create" element={<CreateAssignment />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/reviews" element={<AdminReviews />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  );
}