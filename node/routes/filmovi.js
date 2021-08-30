const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const {response} = require("express");
var CryptoJS = require("crypto-js");
//const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require("cookie-parser");

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
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
    Ocena: Joi.number().min(1).max(10).required(),
    Komentar: Joi.string().trim().required(),
    idFilma: Joi.number()
});

// Middleware da parsira json request-ove
route.use(express.json());
route.use(cookieParser());

const auth = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, "123", (err, decoded) => {
        if (err) {
            return res.status(403).send({
                message: "Unauthorized!"
            });
        }
        next();
    });
};

route.post('/filmovi', auth,(req, res) => {
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
                        res.status(200).send(rows[0]);
                });
            }
        });
    }
});

route.post('/oceni/:idFilma', (req, res) => {
    // Validiramo podatke koje smo dobili od korisnika
    let { error } = Joi.validate(req.body, ocenaValidator);  // Object decomposition - dohvatamo samo gresku

    // Ako su podaci neispravni prijavimo gresku
    if (error){
        res.status(400).send(error.details[0].message);  // Greska zahteva
    }
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
route.get('/filmovi',  auth,(req, res) => {
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
route.put('/film/:id', auth,(req, res) => {
    let { error } = Joi.validate(req.body, filmValidator);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update filmovi set Naziv=?, Godina=?, Zanr=? where id=?";
        let formated = mysql.format(query, [req.body.Naziv, req.body.Godina, req.body.Zanr, req.params.id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from filmovi where id=?';
                formated = mysql.format(query, [req.params.id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.status(200).send(rows[0]);
                });
            }
        });
    }

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
                   // Create token
                   console.log(req.body.Username);
                   const token = jwt.sign({ user_id: req.body.Username }, "YOUR_SECRET_KEY");

                   let query = "insert into Korisnici (Username, Password) values (?, ?)";

                   var ciphertext =  CryptoJS.SHA256(req.body.Password).toString();

                   let formated = mysql.format(query, [req.body.Username, ciphertext]);

                   // Izvrsimo query
                   pool.query(formated, (err, response) => {
                       if (err)
                           res.status(500).send(err.sqlMessage);
                        else{

                           res.status(200).send({token: token});
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
        var ciphertext = CryptoJS.SHA256(req.body.Password).toString();

        let formated = mysql.format('select * from korisnici where Username = ? and Password =?', [req.body.Username, ciphertext]);
        pool.query(formated, (err, rows) =>{
            if (err){
                res.status(400).send(err.sqlMessage);
            } else{
                if (rows.length == 0){
                    res.status(400).send("Pogresno korisnicko ime ili lozinka");
                }else{
                    var token = jwt.sign({ id: req.body.Username}, "123", {
                        expiresIn: 86400 // 24 hours
                    });
                    // let formated = mysql.format('update korisnici set token=? where Username=?', [token, req.body.Username] )
                    res.status(200).send({token: token});
                    // pool.query(formated, (err, rows) => {
                    //     if (err) {
                    //         res.status(400).send(err.sqlMessage);
                    //     } else {
                    //
                          //  setCookie("access_token", token, 7);
                         //   res.status(200).send(token);
                         //    res
                         //        .cookie("access_token", token, {
                         //            httpOnly: true,
                         //            secure: process.env.NODE_ENV === "production",
                         //        })
                         //        .status(200)
                         //        .json({ token: "Logged in successfully 😊 👌 token: " + token });
                            // let oneDay =24*60*60;
                            // res.cookie('access_token', token, {
                            //     oneDay,
                            //     httpOnly: true,
                            //     // Forces to use https in production
                            //     secure: process.env.NODE_ENV === 'production'? true: false
                            //     }).status(200).send("ULOGOVAN");
                        // }
                    // });


                }
            }
        });

    }
});

// Brisanje poruke (vraca korisniku ceo red iz baze)
route.delete('/film/:id', (req, res) => {
    let query = 'select * from filmovi where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let poruka = rows[0];

            let query = 'delete from ocenakomentar where idFilma=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else{
                    query = 'delete from filmovi where id=?';
                    formated = mysql.format(query, [req.params.id]);
                    pool.query(formated, (err, rows)=>{
                       if (err){
                           res.status(500).send(err.sqlMessage);
                       } else{
                           res.status(200).send("Uspesno brisanje");
                       }
                    });
                }
            });




        }
    });
});

module.exports = route;

