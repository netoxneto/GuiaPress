const express = require('express');
const router = express.Router();
const category = require('./Category');
const slugify = require('slugify');

router.get("/admin/categories/new", (req,res)=>{
    res.render('admin/categories/new');
});

router.post("/categories/save", (req,res)=>{
    var data = req.body.title

    if(data != undefined){
        category.create({
            title: data,
            slug: slugify(data)
        }).then(()=>{
            res.redirect("/");
        });
    }else{
        res.redirect('/admin/categories/new');
    }

});

module.exports = router;