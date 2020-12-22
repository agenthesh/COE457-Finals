const { func } = require("assert-plus");
var express = require("express");

var app = express();
const port = 3000;
app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.get("/", function(req,res)
{
    res.sendFile('index.html', { root: __dirname })
});

app.get("/data", function(req, res){
    var a = req.query.a;
    var b = req.query.b;

    a++;
    b++;

    var temp = {
        a: a,
        b: b
    }

    res.send(temp);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});