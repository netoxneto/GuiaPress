const express = require('express');
const router = express.Router();
const categories = require('../categories/Category');
const Articles = require('./Article');
const slug = require('slugify');
const adminAuth = require('../middleware/adminAuth');

router.get("/admin/articles", adminAuth, (req,res)=>{
    Articles.findAll({
        include: [{model: categories}],
        order:[['id','DESC']]
    }).then((articles)=>{
        res.render('admin/articles/index',{
            articles: articles
        });
    });
});

router.get("/admin/articles/new", adminAuth, (req,res)=>{
    categories.findAll().then((categories)=>{
        res.render('admin/articles/new',{
            categories: categories
        });
    });
});

router.post("/article/save", adminAuth, (req,res)=>{
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

router.post("/article/delete", adminAuth, (req,res)=>{
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

router.get("/admin/article/edit/:id", adminAuth,(req,res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.redirect('/admin/articles');
    }

    Articles.findByPk(id).then((article)=>{    
        categories.findAll().then((categories)=>{
            res.render('admin/articles/edit',{categories:categories,article:article});
        });
    });
});

router.post("/article/update", adminAuth,(req,res)=>{
    var id = req.body.id
    var title = req.body.title
    var body = req.body.body
    var category = req.body.category

    Articles.update({
        title:title,
        body:body,
        slug: slug(title),
        categoryId:category
    },{where:{id:id}
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect('/');
    });
});

router.get("/articles/page/:num",(req,res)=>{
    var page = req.params.num
    var offset = 0

    if(isNaN(page) || page == 1){
        offset = 0
    }else{
        offset = (parseInt(page)-1) * 4
    }

    Articles.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[['id', 'DESC']]
    }).then((articles)=>{
        var next;

        if(offset + 4 >= articles.count){
            next = false
        }else{
            next = true
        }
        var result = {page:parseInt(page), next:next, articles:articles}

        categories.findAll().then((categories)=>{
            res.render("admin/articles/page",{result:result, categories:categories});
        });
    });
});

module.exports = router;