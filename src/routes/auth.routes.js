const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  userController,
} = require("../controllers/auth.controller");

///API Controlllers
router.post("/register", registerController);
router.get("/user", userController);
router.post("/login", loginController);

module.exports = router;
