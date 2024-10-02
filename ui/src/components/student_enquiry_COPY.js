import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import StudentForm from '../StudentForm';

const Student_enquiry = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [admissionDate, setAdmissionDate] = useState(null);
  
    useEffect(() => {
      fetchStudents();
    }, []);
  
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/student_details');
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const handleSelectStudent = (student_id) => {
      setSelectedStudents((prevSelected) =>
        prevSelected.includes(student_id)
          ? prevSelected.filter(id => id !== student_id)
          : [...prevSelected, student_id]
      );
    };
  
    const handleSelectAll = () => {
      if (selectedStudents.length === students.length) {
        setSelectedStudents([]);
      } else {
        setSelectedStudents(students.map(student => student.student_id));
      }
    };
  
    const sendMessages = async (studentMessage, parentMessage, studentPhone, parentPhone) => {
      try {
        // Send message to student
        await axios.post('http://localhost:3001/api/send_message', {
          contact: `91${studentPhone}`,
          message: studentMessage,
        });
  
        // Send message to parent
        await axios.post('http://localhost:3001/api/send_message', {
          contact: `91${parentPhone}`,
          message: parentMessage,
        });
      } catch (error) {
        console.error('Error sending messages:', error);
      }
    };
  
    const handleSendMessage = async () => {
      try {
        for (const student_id of selectedStudents) {
          const student = students.find(s => s.student_id === student_id);
          const parentSalutation = student.gender.toLowerCase() === 'male' ? 'Dear parent, your son' : 'Dear parent, your daughter';
          const parentMessage = `${parentSalutation} ${student.name}, ${message}`;
  
          await sendMessages(message, parentMessage, student.phone, student.parent_phone);
        }
        alert('Messages sent successfully!');
      } catch (error) {
        console.error('Error sending messages:', error);
        alert('Failed to send messages');
      }
    };
  
    // const sendMeritStatus = async (meritField) => {
    //   try {
    //     for (const student_id of selectedStudents) {
    //       const student = students.find(s => s.student_id === student_id);
    //       const meritValue = student[meritField];
    //       let studentMessage = '';
    //       let parentMessage = '';
  
    //       if (meritValue === 0) {
    //         studentMessage = `${student.name}, you are not selected in ${meritField} list, wait for the next merit result.`;
    //       } else {
    //         studentMessage = `Congratulations ${student.name}, you have been selected in ${meritField} list. Please visit the college for further admission process.`;
  
    //         const parentSalutation = student.gender.toLowerCase() === 'male' ? 'Dear parent, your son' : 'Dear parent, your daughter';
    //         parentMessage = `${parentSalutation} ${student.name} has been selected in ${meritField} list. Please visit the college for further admission process.`;
    //       }
  
    //       await sendMessages(studentMessage, parentMessage, student.phone, student.parent_phone);
    //     }
    //     alert('Merit status messages sent successfully!');
    //   } catch (error) {
    //     console.error('Error sending merit status messages:', error);
    //     alert('Failed to send merit status messages');
    //   }
    // };
  
    const sendAdmissionDate = async () => {
      if (!admissionDate) {
        alert('Please select a date first.');
        return;
      }
  
      try {
        for (const student_id of selectedStudents) {
          const student = students.find(s => s.student_id === student_id);
          const formattedDate = admissionDate.toLocaleDateString();
  
          const studentMessage = `${student.name}, the admission dates start from ${formattedDate}.`;
          const parentSalutation = 'Dear parent';
          const parentMessage = `${parentSalutation}, the admission dates start from ${formattedDate}.`;
  
          await sendMessages(studentMessage, parentMessage, student.phone, student.parent_phone);
        }
        alert('Admission date messages sent successfully!');
      } catch (error) {
        console.error('Error sending admission date messages:', error);
        alert('Failed to send admission date messages');
      }
    };
  
    const [showForm, setShowForm] = useState(false);
  
    const toggleForm = () => {
      setShowForm(!showForm);
    };
  return (
    <div>
           <button onClick={toggleForm} className="btn btn-secondary mt-3">
        {showForm ? 'Hide Form' : 'Add Student'}
      </button>
      {showForm && <StudentForm />}
      <h1 className="mt-4">Student Details</h1>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="3"
          placeholder="Enter your message here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSendMessage}>
          Send Message
        </button>
      </div>

      <div className="mb-3">
        {/* <button className="btn btn-info mt-3" onClick={() => sendMeritStatus('merit_1')}>
          Send Merit 1 Status
        </button>
        <button className="btn btn-info mt-3" onClick={() => sendMeritStatus('merit_2')}>
          Send Merit 2 Status
        </button>
        <button className="btn btn-info mt-3" onClick={() => sendMeritStatus('merit_3')}>
          Send Merit 3 Status
        </button> */}
        <div className="mt-3">
          <DatePicker
            selected={admissionDate}
            onChange={(date) => setAdmissionDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select admission start date"
            className="form-control"
          />
          <button className="btn btn-info mt-3" onClick={sendAdmissionDate}>
            Send Admission Date
          </button>
        </div>
      </div>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Student ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Parent Phone</th>
            <th>Gender</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.student_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.student_id)}
                    onChange={() => handleSelectStudent(student.student_id)}
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
              <td colSpan="10" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    
  )
}

export default Student_enquiry;