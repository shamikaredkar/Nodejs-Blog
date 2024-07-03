const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


//GET/HOME
router.get('', async (req, res) => {
    try {
        const locals = {
        title: "Nodejs Blog",
        description: "Simple blog with Nodejs, express & MongoDB"
        }

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{$sort: {createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {locals, data, current: page, nextPage: hasNextPage ? nextPage : null, currentRoute: '/'});
    } catch (err) {
        console.error(err);
    }
});

// router.get('', async (req, res) => {
//     const locals = {
//         title: "Nodejs Blog",
//         description: "Simple blog with Nodejs, express & MongoDB"
//     }

//     try {
//         const data = await Post.find();
//         res.render('index', {locals, data});
//     } catch (err) {
//         console.error(err);
//     }

//POST
router.get('/post/:id', async (req, res) => {
    try {
        const locals = {
        title: "Nodejs Blog",
        description: "Simple blog with Nodejs, express & MongoDB"
        }

        let slug = req.params.id;
        const data = await Post.findById({_id: slug});
        res.render('post', {locals, data, currentRoute: `/post/${slug}`});
    } catch (err) {
        console.error(err);
    }
});

//SEARCH
router.post('/search', async (req, res) => {
    try {
        const locals = {
        title: "Nodejs Blog",
        description: "Simple blog with Nodejs, express & MongoDB"
        }

        let searchTerm = req.body.searchTerm || ""; // Provide a default value
        const searchNoSpecialCharacters = searchTerm.replace(/[^a-zA-Z0-9]/g, "")


        const data = await Post.find({
            $or : [
                {
                    title: { $regex: new RegExp(searchNoSpecialCharacters, 'i')},
                    body: { $regex: new RegExp(searchNoSpecialCharacters, 'i')}

                }
            ]
        });
        res.render('search', {locals, data, currentRoute: '/search'});
    } catch (err) {
        console.error(err);
    }
});

//GET/ABOUT
router.get('/about', (req, res) => {
    res.render('about', {currentRoute: '/about'});
});










//POST
// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         }
//     ])
// }
// insertPostData();




module.exports = router;