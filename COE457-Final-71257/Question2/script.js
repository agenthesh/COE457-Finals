var activityData;
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
        client.subscribe("bored/activity", { qos: 1 });
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};

function init() {
    client.connect(options);
}


$(document).ready(function () {
    $("#boredButton").click(function () {

        $.get("https://www.boredapi.com/api/activity/", function(data)
        {
            activityData = data;
            $("#imageDiv").prepend($('<img>',{id:'theImg',src:"https://textoverimage.moesif.com/image?image_url=https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/bbyoda-1575303784.jpeg?resize=980:*&text="+ data.activity}))
        
            $("#typeP").html(data.type)
            $("#participantsP").html(data.participants)

            message = new Paho.MQTT.Message(data.activity);
            message.destinationName = "bored/activity";
            client.send(message);

        });



        
    });

});