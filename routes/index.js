const router = require('express').Router();
const passport = require('passport');
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticated');
const { validateRegistration, validateLogin } = require('../middleware/validate');

// router.get('/', (req, res) => {
//   res.send('Welcome to the CRUD Project!');
// });


// I created this route to serve as the main entry point for the application.
// It provides a simple welcome message and links to the employees and tasks sections.
router.get('/', (req, res) => {
  //#swagger.tags = ['Welcome to the Employee Task Management System!']
  try {
    const isLoggedIn = req.session.user !== undefined;
    const username = isLoggedIn ? req.session.user.username : '';
    
    res.send(`
      <h1>Welcome to the Employee Task Management System!</h1>
      <h2>Status: ${isLoggedIn ? `Logged in as ${username}` : 'Logged Out'}</h2>
      <h2>Available Routes:</h2>
      <p>Use the links below to navigate:</p>
      <ul>
        <li><a href="/employees">View Employees</a></li>
        <li><a href="/tasks">View Tasks</a></li>
        <li><a href="/api-docs">API Documentation</a></li>
        ${isLoggedIn ? '<li><a href="/logout">Logout</a></li>' : '<li><a href="/login">Login with GitHub</a></li>'}
      </ul>
    `);
  } catch (error) {
    console.error('Error serving main page:', error);
    res.status(500).json({ error: 'Internal server error while serving main page' });
  }
});

router.use('/employees', require('./employees'));

router.use('/tasks', require('./tasks'));

router.post('/register', validateRegistration, usersController.registerUser);
router.post('/login', validateLogin, usersController.loginUser);
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error logging out.' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

router.get('/login', passport.authenticate('github', (req, res) => {}));

router.get('/logout', (req, res) => {
  res.send(`
    <h1>Logout</h1>
    <p>Are you sure you want to logout?</p>
    <form action="/logout" method="POST">
      <button type="submit">Yes, Logout</button>
    </form>
    <p><a href="/">Cancel - Back to Home</a></p>
  `);
});

router.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: `Hello, ${req.session.user.username}. You are viewing a protected route!` });
});

module.exports = router;