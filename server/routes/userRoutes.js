const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const user = new userController();

router.post("/register",user.register);

router.post("/login", user.login);

router.get("/find/:userId", user.findUser);

router.get("/", user.getUsers);

module.exports = router;