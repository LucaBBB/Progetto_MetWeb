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