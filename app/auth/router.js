const router = require('express').Router();
const authController = require('./controller');

router.post('/register', authController.register);

module.exports = router;