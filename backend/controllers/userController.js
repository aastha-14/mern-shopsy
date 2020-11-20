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
    if (user && (await user.matchPassword(password))) {
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
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json('User already registered');
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
        }
    } catch (error) {
        if (error) res.status(400).json(error);
    }
};

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHanlder(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                admin: user.isAdmin,
            });
        }
    } catch (error) {
        res.status(404);
        throw new Error('User not found');
    }

});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHanlder(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        return res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            admin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, getUserProfile, updateUserProfile };