const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const adminAuth = require('../middleware/adminAuth');

router.get("/admin/users", adminAuth,(req,res)=>{
    User.findAll({raw: true}).then(users =>{
        res.render('admin/users/index',{users:users});
    });
});

router.post("/users/delete", adminAuth,(req,res)=>{
    var id = req.body.id

    User.destroy({where:{id:id}}).then(()=>{
        res.redirect('/admin/users');
    });
});

router.get("/users/signup",(req,res)=>{
    res.render("admin/users/create");
});

router.post("/users/new",(req,res)=>{
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email:email}}).then((user)=>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(()=>{
                res.redirect('/admin/users');
            }).catch(err =>{
                res.redirect('/');
            });

        }else{
            res.redirect('/admin/users/create')
        }
    });
});

router.get("/users/login",(req,res)=>{
    res.render("admin/users/login");
});

router.post("/authenticate",(req,res)=>{
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email:email}}).then((user)=>{
        if(user != undefined){
            var correct = bcrypt.compareSync(password,user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            }else{
                res.redirect('/users/login');
            }
        }else{
            res.redirect('/users/login');
        }
    });
});

router.get("/logout",(req,res)=>{
    req.session.user = undefined;
    res.redirect("/");
});

module.exports = router