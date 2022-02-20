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
            res.redirect("/admin/categories");
        });
    }else{
        res.redirect('/admin/categories/new');
    }

});

router.get("/admin/categories",(req,res)=>{
    category.findAll({row: true}).then((categories)=>{
        res.render('admin/categories/index',{
            category: categories
        });
    });
});

router.post("/admin/categories/delete",(req,res)=>{
    var id = req.body.id

    if(id != undefined){
        if(!isNaN(id)){
            category.destroy({
                where: {id:id}
            }).then(()=>{
                res.redirect("/admin/categories");
            });
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", (req,res)=>{
    var id = req.params.id

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    category.findByPk(id).then((category)=>{
        if(category != undefined){
            res.render('admin/categories/edit',{category: category});
        }else{
            res.redirect("/admin/categories"); 
        }
    }).catch(erro => {
        res.redirect("/admin/categories");
    });
});

router.post("/admin/categories/update", (req,res)=>{
    var data = req.body.upTitle
    var id = req.body.id
    
    category.update({title: data, slug: slugify(data)},{
        where:{id:id}
    }).then(()=>{
        res.redirect("/admin/categories");
    });
});

module.exports = router;