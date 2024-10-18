import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import Student_enquiry from './components/Student_enquiry';
import Student_who_filled_admission_form from './components/Student_who_filled_admission_form';
import ConfirmAdmissions from './components/ConfirmAdmissions';
import Register from './components/Register';
import Login from './components/Login';
import ExcelUploader from './components/Merit1';
import Merit1 from './components/Merit1';

// Higher-order component to protect routes
const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/Login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',  // Admission Enquiry should show the Student_enquiry component
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
            <Student_enquiry />  {/* Render Student_enquiry component here */}
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/student_enquiry2',  // For Students who filled Admission Form
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
           <Student_who_filled_admission_form/>  {/* Render Student_who_filled_admission_form here */}
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/merit1',  // For Students who filled Admission Form
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
           <Merit1/>  {/* Render Student_who_filled_admission_form here */}
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/ConfirmAdmissions',
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <div>
            <Navbar setIsAuthenticated={setIsAuthenticated} />
            <ConfirmAdmissions />
          </div>
        </ProtectedRoute>
      ),
    },
    {
      path: '/Register',
      element: (
        <div>
          <Register />
        </div>
      ),
    },
    {
      path: '/Login',
      element: (
        <div>
          <Login setIsAuthenticated={setIsAuthenticated} />
        </div>
      ),
    },
  ]);
  
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
