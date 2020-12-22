const APIurl = "http://api.openweathermap.org/data/2.5/weather?lat=21.3463&lon=95.4209&units=metric&appid=7f9e2a5054b3a3090368d00f61049aaf";
var wsbroker = "192.168.1.5";  //mqtt websocket enabled broker
var wsport = 9001 // port for above
// create client using the Paho library
var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));

client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    console.log(message.destinationName, ' -- ', message.payloadString);
};

var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topic, you can add multile lines of these
        client.subscribe("71257/sharjah/weather", { qos: 1 });

        setInterval(getApiData(), 20 * 1000);

        //use the below if you want to publish to a topic on connect
        message = new Paho.MQTT.Message("Hello from the browser");
        message.destinationName = "test/test";
        client.send(message);
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};

function init() {
    client.connect(options);
}

const apiData = function (data) {
    console.log(data);
}

function getApiData() {
    $.get(APIurl, function (data) {

        message = new Paho.MQTT.Message(data.main.temp.toString());
        message.destinationName = "71257/sharjah/weather";
        client.send(message);

        $("#weatherReading").text(data.main.temp);

        console.log("Temp = " + data.main.temp);
    });
}



$(document).ready(function () {
    $("#saveVal").click(function () {
        $.post("/saveCurrentWeather", { temp: $("#weatherReading").html()}, function () {
            console.log("posted");
        });
    });

    $("#getVal").click(function () {
        $.get("/getCurrentWeather", function (data) {
            console.log("posted");
            $("#currentWeatherDB").text("Current Value of Weather in Mongo is: "+ data.temp);
        });
    });

});



