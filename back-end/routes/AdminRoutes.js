const express = require('express');
const router = express.Router();
const { adminLogin } = require('../controller/AdminLoginController.js');
const adminAuth = require('../middleware/AdminAuthMiddleWare.js');

// Admin login route
router.post('/login', adminLogin);

// Protected admin route 
router.get('/dashboard', adminAuth, (req, res) => {
  
});


module.exports = router;