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
    res.render('dashboard', { Content, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
