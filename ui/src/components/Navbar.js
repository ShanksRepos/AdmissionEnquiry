import React from 'react'
import { NavLink } from 'react-router-dom'

 const Navbar = () => {
  return (
    <div>
      <nav>
      <NavLink className={(e)=>{return e.isActive?"red":""}}to ="/"><li>Admission Enquiry</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red":""}}to ="/student_enquiry2"><li>Students who filled Admission Form</li></NavLink>
      <NavLink className={(e)=>{return e.isActive?"red":""}}to ="/ConfirmAdmissions"><li>Confirm Admissions</li></NavLink>
      </nav>
    </div>
  )
}

export default Navbar;