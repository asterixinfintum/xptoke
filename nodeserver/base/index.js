if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}

import "regenerator-runtime";
import express from "express";
import http from "http";
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

//const allowedOrigins = [`${process.env.baseurl}`, `${process.env.wwwbaseurl}`, "http://localhost:3000"];

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

const PORT = process.env.PORT || 8085;


server.listen(PORT, async (error) => {
    if (error) {
        return error;
    }

    return console.log(`server started on port here now ${PORT}`);
});