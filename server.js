// imports
const express = require('express');
const morgan = require('morgan');
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao');
const Articolo = require('./articolo.js');
const path = require('path');
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session');

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        dao.getUser(username, password).then(({user, check}) => {
            if (!user) {
                return done(null, false, {message: 'Username non corretta.'});
            }
            if (!check) {
                return done(null, false, {message: 'Password non corretta.'});
            }
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    dao.getUserById(id).then(user => {
        done(null, user);
    });
});

// init express
const app = express();
const port = 3000;

// set-up logging
app.use(morgan('tiny'));

// check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({"statusCode": 401, "message": "not authenticated"});
}

// process body content as JSON
app.use(express.json());

// set up the 'client' component as a static website
app.use(express.static('client'));

// set up the session
app.use(session({
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// init passport
app.use(passport.initialize());
app.use(passport.session());

// === REST API endpoints ===/

// GET /articoli
app.get('/api/articoli', isLoggedIn, (req, res) => {
    dao.getArticles()
        .then((articoli) => res.json(articoli))
        .catch((err) => {
            res.status(500).json({
                errors: [{'msg': err}],
            });
        });
});


// GET /articoli/<idArticolo>
app.get('/api/articolo/:idArticolo', isLoggedIn, (req, res) => {
    dao.getArticlesById(req.params.taskId)
        .then((articolo) => {
            if(articolo.error){
                res.status(404).json(articolo);
            } else {
                res.json(articolo);
            }
        })
        .catch((err) => {
            res.status(500).json({
                errors: [{'param': 'Server', 'msg': err}],
            });
        });
});

// POST /articoli
app.post('/api/articoli', isLoggedIn, (req,res) => {
    const articolo = req.body;
    articolo.id_autore = req.user.id;
    dao.addArticle(articolo)
        .then((id) => res.status(201).header('Location', `/articoli/${id}`).end())
        .catch((err) => res.status(503).json({ error: err }));

});

// activate server
app.listen(port, () => console.log('Searver is listening at http://localhost:3000'));