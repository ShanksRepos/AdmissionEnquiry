const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
//const fetch = require('node-fetch'); 

const app = express();
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'testing'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/api/student_details', (req, res) => {
  connection.query('SELECT * FROM student_enquiry', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/add_student_filled_form', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body;

  // Validate the incoming data
  if (!name || !phone || !gender || percentage === undefined) {
    return res.status(400).json({ error: 'All fields are required except Parent Phone.' });
  }

  // Insert the student data into the confirm_admissions table
  const query = `
    INSERT INTO students_who_have_filled_admission_form (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, phone, parent_phone, gender, percentage];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into students_who_have_filled_admission_form table:', err);
      return res.status(500).json({ error: 'Failed to insert data into students_who_have_filled_admission_form table.' });
    }
    res.status(200).json({ message: 'Student added successfully!' });
  });
});


app.get('/api/confirm_admissions', (req, res) => {
  const query = 'SELECT * FROM confirm_admissions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from students_who_have_filled_admission_form:', err);
      return res.status(500).send('Failed to fetch student data');
    }
    res.json(results);
  });
});

app.post('/api/confirm_admission', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body;

  // Validate the incoming data
  if (!name || !phone || !gender || percentage === undefined) {
    return res.status(400).json({ error: 'All fields are required except Parent Phone.' });
  }

  // Insert the student data into the confirm_admissions table
  const query = `
    INSERT INTO confirm_admissions (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, phone, parent_phone, gender, percentage];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into confirm_admissions table:', err);
      return res.status(500).json({ error: 'Failed to insert data into confirm_admissions table.' });
    }
    res.status(200).json({ message: 'Student admission confirmed successfully!' });
  });
});

app.post('/api/confirm_multiple_admissions', (req, res) => {
  const { students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ error: 'No students selected for admission confirmation.' });
  }

  const query = `
    INSERT INTO confirm_admissions (name, phone, parent_phone, gender, percentage)
    VALUES ?`;

  const values = students.map(student => [
    student.name,
    student.phone,
    student.parent_phone,
    student.gender,
    student.percentage
  ]);

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting multiple students into confirm_admissions table:', err);
      return res.status(500).json({ error: 'Failed to confirm multiple students.' });
    }
    res.status(200).json({ message: 'Students confirmed successfully!' });
  });
});

app.delete('/api/:tableName/:id', (req, res) => {
  const { tableName, id } = req.params;

  // Whitelist of valid table names to prevent SQL injection
  const validTables = ['students_who_have_filled_admission_form', 'confirm_admissions','student_enquiry']; // Add other valid tables here

  if (!validTables.includes(tableName)) {
    return res.status(400).send('Invalid table name');
  }

  const sql = `DELETE FROM ?? WHERE id = ?`;

  connection.query(sql, [tableName, id], (error, results) => {
    if (error) {
      return res.status(500).send('Error deleting record');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Record not found');
    }
    res.send('Record deleted successfully');
  });
});


app.post('/api/send_message', async (req, res) => {
  console.log('Received request body:', req.body);
  const { contact, message } = req.body;
  console.log('Received contact:', contact);

  // Define the URL for the WhatsApp API
  const apiUrl = 'http://localhost:3000/api/sendText';

  // Define the payload for the WhatsApp API
  const payload = {
    session: 'default',
    chatId: `${contact}@c.us`,  // Adjust as necessary for your contact format
    text: message
  };

  try {
    // Send the POST request to the WhatsApp API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Message sent successfully:', data);
      res.status(200).json({ message: 'Message sent successfully', output: data });
    } else {
      console.error('Error sending message:', data);
      res.status(response.status).json({ error: 'Failed to send message', details: data });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.post('/api/add_student', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body;
  
   const query = `
    INSERT INTO student_enquiry 
    (name, phone, parent_phone, gender, percentage) 
    VALUES (?, ?, ?, ?, ?)`;

   // Also insert into students_who_have_filled_admission_form
   const insertAdmissionFormQuery = `
    INSERT INTO students_who_have_filled_admission_form
    (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [name, phone, parent_phone, gender, percentage], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Failed to add student data');
      }
       // Insert into students_who_have_filled_admission_form
    connection.query(insertAdmissionFormQuery, [name, phone, parent_phone, gender, percentage], (err, results) => {
      if (err) {
        console.error('Error inserting data into students_who_have_filled_admission_form:', err);
        return res.status(500).send('Failed to add student data to the second table');
      }
      // Send success response only once
      res.status(200).send('Student data added successfully to both tables');
    });
  });
});


app.get('/api/students_who_have_filled_admission_form', (req, res) => {
  const query = 'SELECT * FROM students_who_have_filled_admission_form';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from students_who_have_filled_admission_form:', err);
      return res.status(500).send('Failed to fetch student data');
    }
    res.json(results);
  });
});

// API to insert a new student into 'students_who_have_filled_admission_form' table
app.post('/api/add_filled_admission_form_student', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body;

  // Validate the incoming data
  if (!name || !phone || !gender || percentage === undefined) {
    return res.status(400).json({ error: 'All fields are required except Parent Phone.' });
  }

  const query = `
    INSERT INTO students_who_have_filled_admission_form (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, phone, parent_phone, gender, percentage];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into table:', err);
      return res.status(500).json({ error: 'Failed to insert data into table.' });
    }
    res.json({ message: 'Student added successfully to the admission form table!' });
  });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
