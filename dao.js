"use strict";

const db = require('./db.js');
const bcrypt = require('bcrypt');

exports.getUserById = function (userId) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utente WHERE id = ?';
        db.get(sql, [userId], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({error: 'Utente non trovato.'});
            else {
                const user = {id: row.id, username: row.username}
                resolve(user);
            }
        });
    });
}

/**
 * Funzione che restituisce un utente se lo trova nel db.
 *
 * @param username username dell'utente da cercare.
 * @param password password dell'utente da cercare.
 *
 * @returns {Promise<>}
 */
exports.getUser = function (username, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM utente WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({error: 'Utente non trovato.'});
            else {
                const user = {id: row.id, username: row.username};
                let check = false;
                if (bcrypt.compareSync(password, row.password))
                    check = true;

                resolve({user, check});
            }
        });
    });
}
