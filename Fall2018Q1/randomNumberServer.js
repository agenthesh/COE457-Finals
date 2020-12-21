const mongoose = require('mongoose');
var express = require("express");

var WebSocketServer = require('ws').Server,
    ws = new WebSocketServer({ port: 80 }),
    CLIENTS = [];

mongoose.connect('mongodb://localhost:27017/Tempratures', { useNewUrlParser: true, useUnifiedTopology: true });

var app = express();
const port = 3000;
app.use(express.static(__dirname + '/views'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

const tempSchema = new mongoose.Schema({
    temprature: Number
})

const Tempratures = mongoose.model("Tempratures", tempSchema);

ws.on('connection', function (conn) {

    console.log("new connection");
    CLIENTS.push(conn);

    setInterval(function () {
        var randomTemp = Math.floor((Math.random() * 40) + 1);
        CLIENTS.forEach(function (client) {
            client.send(randomTemp);
        })
    }, 10 * 1000);

    conn.on('message', function (message) {
        console.log('received:  %s', message);
        const tempStructure = new Tempratures({
            temprature: message
        });
        tempStructure.save();
    });

    conn.on('close', function () {
        console.log("connection closed");
        CLIENTS.splice(CLIENTS.indexOf(conn), 1);
    });
});

app.get("/", function (req, res) {
    res.sendFile('client.html', { root: __dirname })
});

app.get("/chartData", async (req, res) => {
    var tempArr = [];
    const temps = await Tempratures.find();
    temps.forEach(element => {
        tempArr.push(element.temprature);
    })
    res.send(tempArr);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});