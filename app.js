const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');
const itemsRoutes = require('./routes/itemsRoutes');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');

const app = express();

// Database URL
const dbUrl = "mongodb+srv://greenmart:greenmart123@cluster0.akeqoa2.mongodb.net/nbad-project3?retryWrites=true&w=majority";

app.set('view engine', 'ejs');

// Connection to MongoDB
mongoose.connect(dbUrl)
    .then(() => {
        console.log(`MongoDB Connected`);

        app.use(session({
            secret: 'mynameissaverylongsecret99988136612',
            resave: true,
            saveUninitialized: false,
            store: MongoStore.create({
                mongoUrl: dbUrl,
                collectionName: 'sessions'
            }),
            cookie: {
                httpOnly: true,
                maxAge: 60 * 60 * 1000
            }
        }));

        app.use(flash());


        app.use((req, res, next) => {
            res.locals.query = req.query;
            next();
        });

        app.use((req, res, next) => {
            res.locals.messages = req.flash();
            next();
        });

        app.use((req, res, next) => {
            res.locals.isAuthenticated = req.session.user ? true : false; 
            next();
        });
        
        

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.use(express.static('public'));
        app.use('/uploads', express.static('uploads'));

        app.use('/items', itemsRoutes);
        app.use('/item', itemsRoutes);
        app.use('/new', itemsRoutes);
        app.use('/users', userRoutes);
        app.use('/items', offerRoutes);
        app.use('/offers', offerRoutes);
        app.use('/itemOffers', offerRoutes);


        app.get('/', (req, res) => {
            res.render('index');
        });
        

        app.use('*', (req, res, next) => {
            const error = new Error(`Page not found: ${req.originalUrl}`);
            error.status = 404;
            next(error);
        });

        app.use((err, req, res, next) => {
            console.error(err);
            const statusCode = err.status || 500;
            res.status(statusCode).render('error', {
                message: err.message,
                statusCode: statusCode
            });
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    })
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err.message);
    });
