const express = require('express');
const app = express();
const bodypaser = require('body-parser');
const database = require("./database/database");
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

database.authenticate().then(()=>{
    console.log("Database successfully connected!");
}).catch((msgErro)=>{
    console.log(msgErro);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodypaser.urlencoded({extended: false}));
app.use(bodypaser.json());

app.use("/", categoriesController, articlesController);

app.get("/",(req,res)=>{
    res.render("main");
});

app.listen('80',()=>{console.log("Server started successfully!");})