const express = require("express");

const { signIn, signUp } = require("../controller/user.js");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signUp", signUp);

module.exports = router;
