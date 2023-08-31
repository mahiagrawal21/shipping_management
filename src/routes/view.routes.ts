import express from "express";

const viewrouter = express.Router();


viewrouter.get('/', function(req, res){
    res.render('index');
})

viewrouter.get('/admin', function(req, res){
    res.render('index1');
})

viewrouter.get('/login', function(req, res){
    res.render('login');
})

viewrouter.get('/AdminSignUp', function(req, res){
    res.render('signup');
})

viewrouter.get('/message', function(req, res){
    res.render('message');
})

export default viewrouter