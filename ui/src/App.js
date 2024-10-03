import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import  Navbar  from './components/Navbar';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Student_enquiry from './components/Student_enquiry';
import Student_who_filled_admission_form from './components/Student_who_filled_admission_form';
import ConfirmAdmissions from './components/ConfirmAdmissions';

const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<div><Navbar/><Student_enquiry/></div>
    },
    {
      path:"/student_enquiry2",
      element:<div><Navbar/><Student_who_filled_admission_form/></div>
    },
    {
      path:"/ConfirmAdmissions",
      element:<div><Navbar/><ConfirmAdmissions/></div>
    }
  ])
  return (
    <div>
      <RouterProvider router = {router}/>
    </div>
  );
};

export default App;
