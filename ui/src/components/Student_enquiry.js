import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StudentForm from '../StudentForm';
import { FaTrash, FaUserPlus, FaEnvelope, FaCalendarAlt, FaClipboardList, FaCheckCircle } from 'react-icons/fa';

const StudentEnquiry = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [admissionDate, setAdmissionDate] = useState(null);
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/student_details');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(selectedStudents.length === students.length ? [] : students.map((student) => student.id));
  };

  const sendMessages = async (studentMessage, parentMessage, studentPhone, parentPhone) => {
    try {
      await axios.post('http://localhost:3001/api/send_message', {
        contact: `91${studentPhone}`,
        message: studentMessage,
      });
      await axios.post('http://localhost:3001/api/send_message', {
        contact: `91${parentPhone}`,
        message: parentMessage,
      });
    } catch (error) {
      console.error('Error sending messages:', error);
      throw new Error('Failed to send messages');
    }
  };

  const handleSendMessage = async () => {
    try {
      const sendPromises = selectedStudents.map(async (studentId) => {
        const student = students.find((s) => s.id === studentId);
        const parentSalutation = student.gender.toLowerCase() === 'male' ? 'Dear parent, your son' : 'Dear parent, your daughter';
        const parentMessage = `${parentSalutation} ${student.name}, ${message}`;
        await sendMessages(message, parentMessage, student.phone, student.parent_phone);
      });
      await Promise.all(sendPromises);
      alert('Messages sent successfully!');
    } catch (error) {
      setError('Failed to send messages');
    }
  };

  const addStudenttofilledform = async (student) => {
    try {
      const response = await axios.post('http://localhost:3001/api/add_student_filled_form', {
        name: student.name,
        phone: student.phone,
        parent_phone: student.parent_phone,
        gender: student.gender,
        percentage: student.percentage,
      });
      if (response.status === 200) {
        alert('Student added successfully!');
      } else {
        alert('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to insert student to the table');
    }
  };

  const deleteStudent = async (student_id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/student_enquiry/${student_id}`);
      if (response.status === 200) {
        alert('Student deleted successfully!');
        fetchStudents(); // Refresh the student list after deletion
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const deleteSelectedStudents = async () => {
    try {
      const promises = selectedStudents.map(student_id => 
        axios.delete(`http://localhost:3001/api/student_enquiry/${student_id}`)
      );
      await Promise.all(promises);
      alert('Selected students deleted successfully!');
      setSelectedStudents([]); // Clear selected students after deletion
      fetchStudents(); // Refresh the student list after deletion
    } catch (error) {
      console.error('Error deleting selected students:', error);
      alert('Failed to delete selected students');
    }
  };

  const sendAdmissionDate = async () => {
    if (!admissionDate) {
      alert('Please select a date first.');
      return;
    }

    try {
      const formattedDate = admissionDate.toLocaleDateString();
      const sendPromises = selectedStudents.map(async (studentId) => {
        const student = students.find((s) => s.id === studentId);
        const studentMessage = `${student.name}, the admission dates start from ${formattedDate}.`;
        const parentMessage = `Dear parent, the admission dates start from ${formattedDate}.`;
        await sendMessages(studentMessage, parentMessage, student.phone, student.parent_phone);
      });
      await Promise.all(sendPromises);
      alert('Admission date messages sent successfully!');
    } catch (error) {
      setError('Failed to send admission date messages');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleCustomMessage = () => {
    setShowCustomMessage(!showCustomMessage);
  };

  return (
    <div className="container-fluid bg-light py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="text-center mb-4 text-primary">
                <FaClipboardList className="mr-2" />
                Student Enquiry for Admission
              </h1>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-secondary">
                        <FaUserPlus className="mr-2" />
                        Add New Student
                      </h5>
                      <button onClick={toggleForm} className="btn btn-outline-primary btn-block mt-3">
                        {showForm ? 'Hide Form' : 'Show Form'}
                      </button>
                      {showForm && <StudentForm tableName="student_enquiry" />}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-secondary">
                        <FaEnvelope className="mr-2" />
                        Custom Message
                      </h5>
                      <button onClick={toggleCustomMessage} className="btn btn-outline-info btn-block mt-3">
                        {showCustomMessage ? 'Hide Message' : 'Compose Message'}
                      </button>
                      {showCustomMessage && (
                        <div className="mt-3">
                          <textarea
                            className="form-control mb-2"
                            rows="3"
                            placeholder="Enter your message here"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                          <button className="btn btn-primary btn-block" onClick={handleSendMessage} disabled={loading}>
                            Send Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-secondary">
                        <FaCalendarAlt className="mr-2" />
                        Admission Start Date
                      </h5>
                      <div className="input-group mt-3">
                        <DatePicker
                          selected={admissionDate}
                          onChange={(date) => setAdmissionDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Select date"
                          className="form-control"
                        />
                        <div className="input-group-append">
                          <button className="btn btn-outline-info" onClick={sendAdmissionDate} disabled={loading}>
                            Send Date
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-secondary mb-3">Student List</h5>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="thead-light">
                        <tr>
                          <th>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="selectAll"
                                checked={selectedStudents.length === students.length && students.length > 0}
                                onChange={handleSelectAll}
                              />
                              <label className="custom-control-label" htmlFor="selectAll"></label>
                            </div>
                          </th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Contact</th>
                          <th>Parent Phone</th>
                          <th>Gender</th>
                          <th>Percentage</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <tr key={student.id}>
                              <td>
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id={`student-${student.id}`}
                                    checked={selectedStudents.includes(student.id)}
                                    onChange={() => handleSelectStudent(student.id)}
                                  />
                                  <label className="custom-control-label" htmlFor={`student-${student.id}`}></label>
                                </div>
                              </td>
                              <td>{student.id}</td>
                              <td>{student.name}</td>
                              <td>{student.phone}</td>
                              <td>{student.parent_phone}</td>
                              <td>{student.gender}</td>
                              <td>{student.percentage}%</td>
                              <td>
                                <button className="btn btn-outline-success btn-sm mr-2" onClick={() => addStudenttofilledform(student)}>
                                  <FaCheckCircle className="mr-1" />
                                  Add to Filled Form
                                </button>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => deleteStudent(student.id)}>
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <button className="btn btn-danger mt-3" onClick={deleteSelectedStudents}>
                    <FaTrash className="mr-2" />
                    Delete Selected Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEnquiry;