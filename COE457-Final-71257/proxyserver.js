var express = require("express");
const mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
const { timeStamp } = require("console");
var favicon = require('serve-favicon');
var request = require('request');

mongoose.connect('mongodb://localhost:27017/Products', { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
const port = 9999;
app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(favicon(__dirname + '/64983-emoticon-sunglasses-smiley-iphone-go-emoji.png'));


const finalSchema = new mongoose.Schema({
    product: Number,
    time: Date
})

const Products = mongoose.model("Products", finalSchema);

app.get("/", function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');
    var a = req.query.a;
    var b = req.query.b;

    const url = "http://localhost:3000/data?a="+a+"&b="+b;
    request(url).pipe(res)
    

    res.cookie("message", a * b);
    const productStructure = new Products({
        product: a * b,
        time: new Date()
    });
   
    productStructure.save();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});