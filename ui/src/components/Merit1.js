import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const Merit1 = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to handle file upload
  const handleFileUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to process the uploaded Excel file
  const processFile = async () => {
    if (!selectedFile) {
      alert('Please upload a file first!');
      return;
    }

    setLoading(true);
    try {
      // Read and parse the Excel file
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Extract name column from the Excel file
        const namesInExcel = worksheet.map((row) => row['name']); // Assuming 'name' is the column name

        // Fetch students from 'students_who_have_filled_admission_form'
        const response = await axios.get('http://localhost:3001/api/students_filled_form');
        const students = response.data;

        // Compare names and find matching students
        const matchedStudents = students.filter((student) =>
          namesInExcel.includes(student.name)
        );

        if (matchedStudents.length === 0) {
          setMessage('No matching students found.');
        } else {
          // Insert matched students into 'merit1' table
          await axios.post('http://localhost:3001/api/add_to_merit1', {
            students: matchedStudents,
          });
          setMessage(`${matchedStudents.length} students added to Merit1 successfully!`);
        }
      };

      fileReader.readAsBinaryString(selectedFile);
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage('Failed to process the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Merit 1 List - Upload Excel File</h2>

      <div className="form-group">
        <label htmlFor="fileUpload" className="form-label">Upload Excel File</label>
        <input
          type="file"
          id="fileUpload"
          className="form-control"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={processFile}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process File'}
      </button>

      {message && <div className="alert alert-info mt-4">{message}</div>}
    </div>
  );
};

export default Merit1;
