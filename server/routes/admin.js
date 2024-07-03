const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User.js');
const adminLayout = '../views/layouts/admin'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

//GET/CHECK-LOGIN MIDDLEWARE
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({message: 'Unauthorized'});
    };
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(err) {
        console.error(err);
        return res.status(401).json({message: 'Unauthorized'});

    }
};


//GET/ADMIN/LOGIN
router.get('/admin', async (req, res) => {
    try {
        const locals = {
        title: "Admin",
        description: "Simple blog with Nodejs, express & MongoDB"
        }
        res.render('admin/index', {locals, layout: adminLayout});
    } catch (err) {
        console.error(err);
    }
});


//POST/ADMIN/CHECK-LOGIN
router.post('/admin', async (req, res) => {
    try {

        const {username, password} = req.body;
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Invalid Credentials'});
        }
        const token = jwt.sign({userID: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err);
    }
});

//POST/ADMIN/REGISTER
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({username, password: hashPassword});
            res.status(201).json({message: 'User created successfully', user});
        }catch (err) {
            if (err.code === 11000){
                res.status(409).json({message: 'User already registered'});
            }
            res.status(500).json({message: 'Internal Server Error'});
        }
    } catch (err) {
        console.error(err);
    }
});


//GET/ADMIN - DASHBOARD
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
        const locals = {
        title: "Dashboard",
        description: "Simple blog with Nodejs, express & MongoDB"
        }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals, data, layout: adminLayout
        });
    }catch {
        console.error(err);
    }
});

//GET/ADMIN/CREATE-POST
router.get('/add-post', authMiddleware, async (req, res) => {

    try {
        const locals = {
        title: "Add Post",
        description: "Simple blog with Nodejs, express & MongoDB"
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals, layout: adminLayout
        });
    }catch {
        console.error(err);
    }
});

//POST/ADMIN/CREATE-POST
router.post('/add-post', authMiddleware, async (req, res) => {

    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });
            await Post.create(newPost);
            res.redirect('/dashboard');

        }catch (err) {
            console.error(err);
        }
    }catch {
        console.error(err);
    }
});

//GET/EDIT-POST:ID
router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        const locals = {
        title: "Edit Post",
        description: "Simple blog with Nodejs, express & MongoDB"
        }
        const data = await Post.findOne({_id: req.params.id});
        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        });
    }catch(err) {
        console.error(err);
    }
});

//PUT/EDIT POST
router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAT: Date.now()
        });
        res.redirect(`/edit-post/${req.params.id}`);
    }catch {
        console.error(err);
    }
});

//DELETE/ADMIN-DELETE-POST
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try{
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard')
    }catch(err) {
        console.log(err);
    }
});

//GET/ADMIN-LOGOUT
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
});

module.exports = router;