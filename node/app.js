const express = require('express');
const flms = require('./routes/filmovi');  // Nas ruter (REST API)
const history = require('connect-history-api-fallback');
const path = require('path');
const app = express();
require("dotenv").config();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin,Authorization, X-access-token, X-Requested-With, Content-Type, Accept");
    next();
});

// Kazemo aplikaciji da za rute koje pocinju sa '/api' koristi nas ruter
app.use('/api', flms);

const staticMiddleware = express.static(path.join(__dirname, 'dist'));

app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);

app.listen(80);
console.log("poceo da slusa na portu 80");