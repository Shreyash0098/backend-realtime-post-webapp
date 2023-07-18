const express = require("express");

const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put(
  "/signUp",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter valid Email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ],
  authController.signUp
);

router.post("/login", authController.login);

router.get("/status", isAuth, authController.getStatus);

router.put("/status", isAuth, authController.updateStatus);

module.exports = router;
