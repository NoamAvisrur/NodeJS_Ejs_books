var http = require('http');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/home', function(req, res) {
    fs.readFile('data/books.json','utf-8', function(err, data){
        if(err){throw new Error(err)}; 
        res.render('pages/index', {books: JSON.parse(data)});        
    });
});

app.get('/authers', function(req, res) {
    fs.readFile('data/authers.json','utf-8', function(err, data){
        if(err){throw new Error(err)}; 
        res.render('pages/authers', {authers: JSON.parse(data)});        
    });
});

app.get('/about', function(req, res) {
    fs.readFile('data/about.json','utf-8', function(err, data){
        if(err){throw new Error(err)}; 
        res.render('pages/about', {about: JSON.parse(data)});        
    });
});

app.get('/home/:id', function(req, res) {
    fs.readFile('data/books.json','utf-8', function(err, data){
        if(err){throw new Error(err)}; 
        var books = JSON.parse(data);
        var id = req.params.id;
        var i = books.findIndex(book => book.id == id);
        res.render('pages/book', {book: books[i]});        
    });
});

app.get('/authers/:id', function(req, res) {
    fs.readFile('data/authers.json','utf-8', function(err, data){
        if(err){throw new Error(err)}; 
        var authers = JSON.parse(data);
        var id = req.params.id;
        var i = authers.findIndex(auther => auther.id == id);
        res.render('pages/auther', {auther: authers[i]});        
    });
});

app.delete('/home/:id', function(req, res){ 
    fs.readFile('data/books.json','utf8', function(err, data){
        if(err){throw new Error(err)};  
        var id = req.params.id; 
        var books = JSON.parse(data);
        var i = books.findIndex(function(user){
            return user.id == id;
        });
        books.splice(i, 1);
        fs.writeFile('data/books.json',JSON.stringify(books), function(err){
            if(err){throw new Error(err)};
            res.send('deleted');    
        });
    });
});   

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});