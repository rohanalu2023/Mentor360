const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../controller/auth');
const Content = require('../models/content');
const User = require('../models/User');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const content = await Content.find();
    res.render('dashboard', { content, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Dashboard-student
router.get('/dashboard-student', ensureAuthenticated, async (req, res) => {
  try {
    const content = await Content.find();
    res.render('dashboard-student', { content, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Add new opportunity
router.post('/dashboard/add', ensureAuthenticated, async (req, res) => {
  try {
    const { title, category, description, name, email, phone, pictureUrl } = req.body;
    const newContent = new Content({
      title,
      category,
      description,
      name,
      email,
      phone,
      pictureUrl
    });

    const savedContent = await newContent.save();

    if (savedContent) {
      res.send('<script>alert("New content added successfully!"); window.location="/dashboard";</script>');
    } else {
      res.status(500).send('Failed to save the content.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Edit opportunity page
router.get('/dashboard/edit/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {
    const content = await Content.findById(id);
    res.render('editOpportunity', { content });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Update opportunity
router.post('/dashboard/edit/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {
    const { title, category, description, name, email, phone, pictureUrl } = req.body;

    const updatedContent = await Content.findByIdAndUpdate(id, {
      title,
      category,
      description,
      name,
      email,
      phone,
      pictureUrl
    }, { new: true });

    if (updatedContent) {
      res.redirect('/dashboard');
    } else {
      res.status(500).send('Failed to update the content.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// Delete opportunity

router.post('/dashboard/delete/:id', ensureAuthenticated, async (req, res) => {
  const id = req.params.id;

  try {
    await Content.findByIdAndDelete(id);
    res.status(200).json({ message: 'Opportunity deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/users/login'); // Redirect to the login page after logout
  });
});

// Add Opportunity route
router.get('/views/addopportunity', (req, res) => {
  res.render('addopportunity'); 
});

// About Us route
router.get('/views/aboutUs', (req, res) => {
  res.render('aboutUs'); 
});
module.exports = router;


// About Us route - no back button
router.get('/views/aboutUs-nobackbtn', (req, res) => {
  res.render('aboutUs-nobackbtn'); 
});

// About Us route - student
router.get('/views/aboutUs-student', (req, res) => {
  res.render('aboutUs-student'); 
});

module.exports = router;

