import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentForm = ({ tableName }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    parent_phone: '',
    gender: '',
    percentage: ''
  });

  const navigate = useNavigate();

  // Function to refresh the page
  const handleRefresh = () => {
    navigate(0); // This will refresh the current route
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone numbers
    if (!/^\d{10}$/.test(formData.phone)) {
      alert('Please enter a valid 10-digit student phone number.');
      return;
    }
    if (formData.parent_phone && !/^\d{10}$/.test(formData.parent_phone)) {
      alert('Please enter a valid 10-digit parent phone number.');
      return;
    }

    try {
      // Determine the endpoint based on the tableName prop
      const endpoint =
        tableName === 'student_enquiry'
          ? 'http://localhost:3001/api/add_student'
          : 'http://localhost:3001/api/add_student_who_filled_admission_form';

      const response = await axios.post(endpoint, formData);
      if (response.status === 200) {
        alert('Student data added successfully!');
        setFormData({
          name: '',
          phone: '',
          parent_phone: '',
          gender: '',
          percentage: ''
        });

        // Refresh the page after successful submission
        handleRefresh();
      }
    } catch (error) {
      console.error('Error adding student data:', error);
      alert('Failed to add student data');
    }
  };

  return (
    <div className="container">
      <h2>Add Student Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Parent Phone</label>
          <input
            type="text"
            className="form-control"
            name="parent_phone"
            value={formData.parent_phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select
            className="form-control"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Percentage</label>
          <input
            type="number"
            className="form-control"
            name="percentage"
            value={formData.percentage}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>
    </div>
  );
};

export default StudentForm;
