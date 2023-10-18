const express = require('express');

const router = express.Router();

const passwordController = require('../controllers/password');

router.post("/forgotpassword", passwordController.forgotPasswordRequest);

router.get("/resetpassword/:id", passwordController.resetPassword);

router.get("/updatepassword/:resetpasswordid", passwordController.updatePassword);

module.exports = router;
