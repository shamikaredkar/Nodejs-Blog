// app.js
require('dotenv').config();

const express = require('express');
const http = require ('http');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const connectDB = require('./server/config/db');
const session = require('express-session');
const isActiveRoute = require('./server/helpers/routeHelpers'); // Import the helper function
const app = express();
const PORT = 3000 || process.env.PORT;

// Connect to database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}));
app.use(express.static('public'));
app.use(methodOverride('_method'));

// Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.locals.isActiveRoute = isActiveRoute; // Make helper function available globally

// Routes
app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

