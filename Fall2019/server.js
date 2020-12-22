var express = require("express");
var mqtt = require('mqtt')
const mongoose = require('mongoose');
var client  = mqtt.connect('ws://192.168.1.5:9001')

var app = express();
const port = 3000;
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

mongoose.connect('mongodb://localhost:27017/Tempratures', { useNewUrlParser: true, useUnifiedTopology: true });

const tempSchema = new mongoose.Schema({
    temprature: Number
})

const Tempratures = mongoose.model("Tempratures", tempSchema);

app.get("/", function(req,res)
{
    res.sendFile('index.html', { root: __dirname })
})

app.post("/saveCurrentWeather", function(req, res)
{
    console.log("Post Data: "+req.body.temp);
    var test = req.body.temp;
    const tempStructure = new Tempratures({
        temprature: parseInt(test)
    });
    tempStructure.save();
});

app.get("/getCurrentWeather", async(req, res) => 
{
    const tempscount = await Tempratures.countDocuments();
    const temps = await Tempratures.find().skip(tempscount-1);
    var tempToSend = {
        temp: ""
    };

    temps.forEach(element => {
        tempToSend.temp = element.temprature;
    })

    console.log("temps issss "+ tempToSend.temp);
    res.send(tempToSend);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});


client.on('connect', function () {
    console.log("connected to MQTT");
  client.subscribe('71257/sharjah/weather', function (err) {
  })
})
 
client.on('message', function (topic, message) {
  // message is Buffer
    console.log(message.toString())

    const tempStructure = new Tempratures({
        temprature: parseInt(message)
    });
    tempStructure.save().then(function(){
        console.log("saved to mongo");
    });
})