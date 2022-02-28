const express = require('express');
const app = express();
const bodypaser = require('body-parser');
const database = require("./database/database");

const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

const categoryTable = require('./categories/Category');
const articleTable = require('./articles/Article');
const res = require('express/lib/response');

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
    articleTable.findAll({order:[['updatedAt','DESC']], limit: 4}).then((articles)=>{
        categoryTable.findAll().then((categories)=>{
            res.render("index",{articles:articles, categories:categories});
        });
    });
});

app.get("/article/:slug",(req,res)=>{
    var slug = req.params.slug
    articleTable.findOne({where:{slug:slug}})
        .then((articles)=>{
            if(articles != undefined){
                categoryTable.findAll().then((categories)=>{
                    res.render("articles",{articles:articles, categories:categories});
                });
            }else{
                res.redirect("/");
            }
        }).catch(erro =>{
            res.redirect("/")
        });
});

app.get("/categories/:slug",(req,res)=>{
    var slug = req.params.slug
    categoryTable.findOne({
        where: {slug:slug},
        include:[{model: articleTable}]
    }).then(category =>{
        if(category != undefined){
            categoryTable.findAll().then(categories =>{
                res.render("index", {articles: category.articles, categories:categories})
            });
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect("/");
    });
});

app.listen('80',()=>{console.log("Server started successfully!");})