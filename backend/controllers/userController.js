import colors from 'colors';
import asyncHanlder from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHanlder(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.matchPassword(password)) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password.');
    }
});

// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already registered');
    }
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHanlder(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        return res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            admin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, getUserProfile };