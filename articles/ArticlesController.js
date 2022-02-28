const express = require('express');
const router = express.Router();
const categories = require('../categories/Category');
const Articles = require('./Article');
const slug = require('slugify');
const article = require('./Article');

router.get("/admin/articles", (req,res)=>{
    Articles.findAll({
        include: [{model: categories}],
        order:[['id','DESC']]
    }).then((articles)=>{
        res.render('admin/articles/index',{
            articles: articles
        });
    });
});

router.get("/admin/articles/new", (req,res)=>{
    categories.findAll().then((categories)=>{
        res.render('admin/articles/new',{
            categories: categories
        });
    });
});

router.post("/article/save", (req,res)=>{
    var title = req.body.title
    var article = req.body.body
    var category =req.body.category

    if(title, article, category != undefined){
        Articles.create({
            title: title,
            body: article,
            slug: slug(title),
            categoryId: category
        }).then(()=>{
            res.redirect('/admin/articles');
        });
    }else{
        res.redirect('/admin/articles/new');
    }
});

router.post("/article/delete", (req,res)=>{
    var id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            Articles.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect('/admin/articles');
            });
        }else{
            res.redirect('/admin/articles');
        }
    }else{
        res.redirect('/admin/articles');
    }
});

router.get("/admin/article/edit/:id",(req,res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Articles.findOne({where:{id:id}}).then((article)=>{    
        categories.findAll().then((categories)=>{
            res.render('admin/articles/edit',{categories:categories,article:article});
        });
    });
});



module.exports = router;