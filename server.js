const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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

const jwtSecret = process.env.JWT_SECRET || 'secret';

// JWT Token Validation Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, hashedPassword], 
      (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'User registration failed' });
        }
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
        } 
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password' });
  }
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    
    try {
      const isMatch = await bcrypt.compare(password, user.password); // Compare the password with the stored hash
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
      res.json({ token, message: 'Logged in successfully' });
    } catch (error) {
      console.error('Error comparing password:', error);
      res.status(500).json({ message: 'Error during login' });
    }
  });
});

// Fetch student details
app.get('/api/student_details', (req, res) => {
  connection.query('SELECT * FROM student_enquiry', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Add student who filled admission form
app.post('/api/add_student_filled_form', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body; // Removed added_by

  if (!name || !phone || !gender || percentage === undefined) {
    return res.status(400).json({ error: 'All fields are required except Parent Phone.' });
  }

  const query = `
    INSERT INTO students_who_have_filled_admission_form (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, phone, parent_phone, gender, percentage]; // Removed added_by

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting data into students_who_have_filled_admission_form table:', err);
      return res.status(500).json({ error: 'Failed to insert data into students_who_have_filled_admission_form table.' });
    }
    res.status(200).json({ message: 'Student added successfully!' });
  });
});

// Fetch confirmed admissions
app.get('/api/confirm_admissions', (req, res) => {
  const query = 'SELECT * FROM confirm_admissions';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data from confirm_admissions:', err);
      return res.status(500).send('Failed to fetch student data');
    }
    res.json(results);
  });
});

// Confirm admission
app.post('/api/confirm_admission', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body;

  if (!name || !phone || !gender || percentage === undefined) {
    return res.status(400).json({ error: 'All fields are required except Parent Phone.' });
  }

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

// Confirm multiple admissions
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

// Delete student record
app.delete('/api/:tableName/:id', (req, res) => {
  const { tableName, id } = req.params;

  const validTables = ['students_who_have_filled_admission_form', 'confirm_admissions', 'student_enquiry'];

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

// Send message via WhatsApp API (protected by JWT)
app.post('/api/send_message', authenticateToken, async (req, res) => {
  const { contact, message } = req.body;

  const apiUrl = 'http://localhost:3000/api/sendText';
  const payload = {
    session: 'default',
    chatId: `${contact}@c.us`,
    text: message
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (response.ok) {
      res.status(200).json({ message: 'Message sent successfully', output: data });
    } else {
      res.status(response.status).json({ error: 'Failed to send message', details: data });
    }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


// Fetch students who have filled the admission form
app.get('/api/students_who_have_filled_admission_form', (req, res) => {
  connection.query('SELECT * FROM students_who_have_filled_admission_form', (err, results) => {
    if (err) {
      console.error('Error fetching data from students_who_have_filled_admission_form:', err);
      return res.status(500).send('Failed to fetch student data');
    }
    res.json(results);
  });
});

app.get('/api/students_filled_form', (req, res) => {
  const query = 'SELECT * FROM students_who_filled_admission_form';

  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    return res.status(200).json(result);
  });
});


app.post('/api/add_to_merit1', (req, res) => {
  const { students } = req.body;

  if (!students || students.length === 0) {
    return res.status(400).json({ error: 'No students to add to merit1' });
  }

  const query = `
    INSERT INTO merit1 (name, phone, parent_phone, gender, percentage)
    VALUES ?
  `;

  const values = students.map(student => [
    student.name,
    student.phone,
    student.parent_phone,
    student.gender,
    student.percentage,
  ]);

  connection.query(query, [values], (err, results) => {
    if (err) {
      console.error('Error inserting students into merit1 table:', err);
      return res.status(500).json({ error: 'Failed to add students to merit1 table' });
    }
    res.status(200).json({ message: 'Students added to merit1 table successfully' });
  });
});


// Add new student
app.post('/api/add_student', (req, res) => {
  const { name, phone, parent_phone, gender, percentage } = req.body; // Removed added_by

  const query = `
    INSERT INTO student_enquiry (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)`;

  const insertAdmissionFormQuery = `
    INSERT INTO students_who_have_filled_admission_form (name, phone, parent_phone, gender, percentage)
    VALUES (?, ?, ?, ?, ?)`; // Removed added_by

  connection.query(query, [name, phone, parent_phone, gender, percentage], (err, results) => {
    if (err) {
      console.error('Error adding student:', err);
      return res.status(500).json({ error: 'Failed to add student' });
    }

    connection.query(insertAdmissionFormQuery, [name, phone, parent_phone, gender, percentage], (err, results) => {
      if (err) {
        console.error('Error inserting data into students_who_have_filled_admission_form:', err);
        return res.status(500).json({ error: 'Failed to insert data into students_who_have_filled_admission_form table.' });
      }

      res.status(200).json({ message: 'Student added successfully!' });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
