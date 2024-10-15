import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const isAuthenticated = localStorage.getItem('user');

  return (
    <div>
      <nav>
        <NavLink to="/">Admission Enquiry</NavLink>
        <NavLink to="/student_enquiry2">Students who filled Admission Form</NavLink>
        <NavLink to="/ConfirmAdmissions">Confirm Admissions</NavLink>
        {!isAuthenticated ? (
          <>
            <NavLink to="/Register">Register</NavLink>
            <NavLink to="/Login">Login</NavLink>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
