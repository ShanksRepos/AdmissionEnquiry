import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StudentForm from '../StudentForm';

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
    <div className="container mt-4">
      <h1 className="mt-4 text-center">Student Enquiry for Admission</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <button onClick={toggleForm} className="btn btn-outline-primary mt-3">
        {showForm ? 'Hide Form' : 'Add Student'}
      </button>
      {showForm && <StudentForm tableName="student_enquiry" />}

      <div className="mb-3">
        <button onClick={toggleCustomMessage} className="btn btn-info mt-3">
          {showCustomMessage ? 'Hide Custom Message' : 'Custom Message'}
        </button>
        {showCustomMessage && (
          <div>
            <textarea
              className="form-control mt-3 p-2 border-info"
              rows="3"
              placeholder="Enter your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-primary mt-3" onClick={handleSendMessage} disabled={loading}>
              Send Message
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="input-group mt-3">
          <DatePicker
            selected={admissionDate}
            onChange={(date) => setAdmissionDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select admission start date"
            className="form-control"
          />
          <div className="input-group-append">
            <button className="btn btn-info" onClick={sendAdmissionDate} disabled={loading}>
              Send Admission Date
            </button>
          </div>
        </div>
      </div>

      <table className="table table-hover table-bordered mt-4">
        <thead className="thead-dark">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length && students.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Parent Phone</th>
            <th>Gender</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </td>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.phone}</td>
                <td>{student.parent_phone}</td>
                <td>{student.gender}</td>
                <td>{student.percentage}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentEnquiry;
