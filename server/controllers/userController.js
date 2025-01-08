const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

class userController {

    createToken = (_id) => {
        const jwt_key = process.env.JWT_SECRET_KEY;
        return jwt.sign({ _id }, jwt_key, { expiresIn: "3d" });
    }

    register = async (req, res) => {
        try {
            const { name, email, password } = req.body;
            let user = await userModel.findOne({ email });

            if (user) return res.status(400).json("User already exist...");
            if (!name || !email || !password) return res.status(400).json("Please fill all fields");

            if (!validator.isEmail(email)) return res.status(400).json("Invalid email");
            if (!validator.isStrongPassword(password)) return res.status(400).json("Password must be strong");

            user = new userModel({ name, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            await user.save();

            const token = this.createToken(user._id);

            res.status(200).json({
                _id: user._id, name, email, token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    login = async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await userModel.findOne({ email });

            if (!user) return res.status(400).json("User not found");

            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) return res.status(400).json("Invalid password");

            const token = this.createToken(user._id);

            res.status(200).json({
                _id: user._id, name: user.name, email, token
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    findUser = async (req, res) => {
        const userId = req.params.userId;

        try {
            const user = await userModel.findById(userId);

            if (!user) return res.status(400).json("User not found");

            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    getUsers = async (req, res) => {
        try {
            const users = await userModel.find();
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }
}


module.exports = userController;