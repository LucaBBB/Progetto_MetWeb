"use strict";

const Articolo = require('./articolo.js');
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

//  --- ARTICOLI ---

const creaArticolo = function (dbArticolo) {
    return new Articolo(dbArticolo.id, dbArticolo.titolo, dbArticolo.descrizione, dbArticolo.categoria, dbArticolo.immagine, dbArticolo.id_autore);
}

/**
 * Restituisce tutti gli articoli presenti nel db.
 *
 * @returns {Promise<>}
 */
exports.getAllArticles = function () {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM articoli';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                let articoli = rows.map(row => creaArticolo(row));
                resolve(articoli);
            }
        });
    });
}

/**
 * Restituisce un articolo dato il suo id.
 */
exports.getArticlesById = function (idArticolo) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM articoli WHERE id = ?';
        db.get(sql, idArticolo, (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({error: 'Articolo non trovato.'});
            else {
                const articolo = creaArticolo(row);
                resolve(articolo);
            }
        });
    });
}

/**
 * Inserisce un nuovo articolo nel database e restituisce l'id dell'articolo inserito.
 * "this.lastID" viene usato per restituire l'id dell'articolo.
 */
exports.addArticle = function (articolo) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO tasks(titolo, descrizione, categoria, immagine, id_autore) VALUES(?,?,?,?,?)';
        db.run(sql, [articolo.titolo, articolo.descrizione, articolo.categoria, articolo.immagine, articolo.id_autore], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}


//  ----------------
