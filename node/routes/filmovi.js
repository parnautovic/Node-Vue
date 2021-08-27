const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const {response} = require("express");
var CryptoJS = require("crypto-js");

// Koristimo pool da bi automatski aquire-ovao i release-ovao konekcije
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'filmovi'
});

// Instanciramo ruter
const route = express.Router();

// Sema za validaciju
const sema = Joi.object().keys({
    user: Joi.string().trim().min(4).max(12).required(),
    message: Joi.string().max(512).required()
});

const filmValidator = Joi.object().keys({
    Naziv: Joi.string().trim().max(100).required(),
    Godina: Joi.number().integer().min(1900).max(2021).required(),
    Zanr: Joi.string().trim().max(20).required()
});

const userValidator = Joi.object().keys({
    Username: Joi.string().trim().max(50).required(),
    Password: Joi.string().trim().min(6).required()
});

const ocenaValidator = Joi.object().keys({
    Ocena: Joi.number().integer().min(1).max(10).required(),
    Komentar: Joi.string().trim().required(),
    Ocena: Joi.number().integer().required()

});

// Middleware da parsira json request-ove
route.use(express.json());

route.post('/filmovi', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = Joi.validate(req.body, filmValidator);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string
        let query = "insert into filmovi (Naziv, Godina, Zanr) values (?, ?, ?)";
        let formated = mysql.format(query, [req.body.Naziv, req.body.Godina, req.body.Zanr]);

        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from filmovi where id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.post('/oceni/:idFilma', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = Joi.validate(req.body, ocenaValidator);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {  // Ako nisu upisemo ih u bazu
        // Izgradimo SQL query string
        let query = "insert into ocenakomentar (Ocena, Komentar, idFilma) values (?, ?, ?)";
        let formated = mysql.format(query, [req.body.Ocena, req.body.Komentar, req.params.idFilma]);

        // Izvrsimo query
        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                // Ako nema greske dohvatimo kreirani objekat iz baze i posaljemo ga korisniku
                query = 'select * from ocenakomentar where idOcene=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});



// Prikaz svih filmova
route.get('/filmovi', (req, res) => {
    // Saljemo upit bazi
    pool.query('select * from filmovi', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        else
            res.send(rows);
    });
});

// Prikaz jednog filma
route.get('/filmovi/:id', (req, res) => {
    // Saljemo upit bazi
    let query ='select * from filmovi where id = ?';
    let formated = mysql.format(query, [req.params.id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        else
            res.send(rows);
    });
});


// sve ocene za odredjen film
route.get('/ocene/:idFilma', (req, res) => {

    // Saljemo upit bazi
    let query ='select * from ocenakomentar where idFilma = ?';
    let formated = mysql.format(query, [req.params.idFilma]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);  // Greska servera
        else
            res.send(rows);
    });
});

route.post('/register', (req, res)=>{
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = Joi.validate(req.body, userValidator);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {
        let formated = mysql.format('select * from korisnici where Username = ?', [req.body.Username]);
        pool.query(formated, (err, rows) =>{
           if (err){
               res.status(400).send(err.sqlMessage);
           } else{
               if (rows.length > 0){
                   res.status(400).send("Vec postoji takav username");
               }else{
                   let query = "insert into Korisnici (Username, Password) values (?, ?)";

                   var ciphertext = CryptoJS.AES.encrypt(req.body.Password, 'secret key 123').toString();
                   console.log(ciphertext);

                   let formated = mysql.format(query, [req.body.Username, ciphertext]);

                   // Izvrsimo query
                   pool.query(formated, (err, response) => {
                       if (err)
                           res.status(500).send(err.sqlMessage);
                        else{
                            res.send(200);
                       }
                   });
               }
           }
        });

    }
});

route.post('/login', (req, res)=>{
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = Joi.validate(req.body, userValidator);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error)
        res.status(400).send(error.details[0].message);  // Greska zahteva
    else {
        var ciphertext = CryptoJS.AES.encrypt(req.body.Password, 'secret key 123').toString();

        let formated = mysql.format('select * from korisnici where Username = ? and Password =?', [req.body.Username, req.body.Password]);
        pool.query(formated, (err, rows) =>{
            if (err){
                res.status(400).send(err.sqlMessage);
            } else{
                if (rows.length == 0){
                    res.status(400).send("Pogresno korisnicko ime ili lozinka");
                }else{

                    res.status(200);

                }
            }
        });

    }
});

module.exports = route;

