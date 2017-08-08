var http = require('http');
var fs = require('fs');
var express = require('express');
var ejs = require('ejs');
var util = require('util');
var bodyParser = require("body-parser");

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/books', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/books.json', 'utf-8')
    .then(function(data){
        res.render('pages/index', {
            books: JSON.parse(data),
            staticPath: req.protocol + '://' + req.get('host')
        });
    }).catch(function(err){
        console.error(err);
    });
});

app.get('/authers', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/authers.json','utf-8')
    .then(function(data){
        res.render('pages/authers', {
            authers: JSON.parse(data),
            staticPath: req.protocol + '://' + req.get('host')
        });        
    }).catch(function(err){
        console.error(err);
    })
});

app.get('/about', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/about.json','utf-8')
    .then(function(data){
        res.render('pages/about', {
            about: JSON.parse(data),
            staticPath: req.protocol + '://' + req.get('host')
        });        
    }).catch(function(err){
        console.error(err);
    })
});

app.get('/books/:id', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/books.json','utf-8')
    .then(function(data){ 
        var books = JSON.parse(data);
        var id = req.params.id;
        var i = books.findIndex(book => book.id == id);
        res.render('pages/book', {
            book: books[i],
            staticPath: req.protocol + '://' + req.get('host')
        });        
    }).catch(function(err){
        console.error(err);
    });
});

app.get('/authers/:id', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/authers.json','utf-8')
    .then(function(data){
        var authers = JSON.parse(data);
        var id = req.params.id;
        var i = authers.findIndex(auther => auther.id == id);
        res.render('pages/auther', {
            auther: authers[i],
            staticPath: req.protocol + '://' + req.get('host')
        });        
    }).catch(function(err){
        console.error(err);
    });
});

app.get('/cart', function(req, res) {
    var readFile = util.promisify(fs.readFile);
    readFile('data/cart.json', 'utf-8')
    .then(function(data){
        res.render('pages/cart', {
            books: JSON.parse(data),
            staticPath: req.protocol + '://' + req.get('host')
        });
    }).catch(function(err){
        console.error(err);
    });
});

app.post('/books/:id', function(req, res){
    var readFile = util.promisify(fs.readFile);
    readFile('data/books.json','utf-8')
    .then(function(data){ 
        var books = JSON.parse(data);
        var id = req.params.id;
        var i = books.findIndex(book => book.id == id);
        return books[i];
    }).then(function(book){
        fs.readFile('data/cart.json', 'utf-8', function(err, data){
        var cart_books = JSON.parse(data);
        cart_books.push(book);
            fs.writeFile('data/cart.json',JSON.stringify(cart_books), function(err){
            res.send('added to cart');    
            });
        });  
    }).catch(function(err){
        console.error(err);
    })        
})

app.post('/books', function(req, res){
    var readFile = util.promisify(fs.readFile);
    readFile('data/books.json','utf-8')
    .then(function(data){ 
        var books = JSON.parse(data);
        var id = (books[books.length-1].id)+1;
        books.push({
           id: id,
           name: req.body.name,
           auther: req.body.auther,
           img: req.body.img,
           about: req.body.about
        });
        fs.writeFile('data/books.json',JSON.stringify(books), function(err){
            res.status(200).send('book added');    
        });            
    });
});

app.delete('/cart/:id', function(req, res){ 
    var readFile = util.promisify(fs.readFile);
    readFile('data/cart.json','utf8')
    .then(function(data){ 
        var id = req.params.id; 
        var books = JSON.parse(data);
        var i = books.findIndex(function(user){
            return user.id == id;
        });
        books.splice(i, 1);
        return books;
    }).then(function(books){
        fs.writeFile('data/cart.json',JSON.stringify(books), function(err){
            res.send('deleted');    
        });
    }).catch(function(err){
        console.error(err);
    })
});   

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});