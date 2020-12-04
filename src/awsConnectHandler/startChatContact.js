var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION});
var connect = new AWS.Connect();

exports.handler = (event, context, callback) => awsConnectHandler(event, context, callback);

export function awsConnectHandler(event, context, callback) {
    console.log("Received event: " + JSON.stringify(event));
    var body = JSON.parse(event.body || event);

    return startChatContact(body).then((startChatResult) => {
        callback(null, buildSuccessfulResponse(startChatResult));
    }).catch((err) => {
        console.log("caught error " + err);
        callback(null, buildResponseFailed(err));
    });
};

function startChatContact(body) {
    
    var contactFlowId = "";
    if(body.hasOwnProperty('ContactFlowId')){
        contactFlowId = body["ContactFlowId"];
    }
    console.log("CF ID: " + contactFlowId);
    
    var instanceId = "";
    if(body.hasOwnProperty('InstanceId')){
        instanceId = body["InstanceId"];
    }
    console.log("Instance ID: " + instanceId);

    instanceId = "3f117463-2a78-40c0-b0aa-cb1f90fae9a2";
    contactFlowId = "966137ea-6e94-489d-ae85-c9d51c2ba38e";

    return new Promise(function (resolve, reject) {
        var startChat = {
            "InstanceId": instanceId == "" ? process.env.INSTANCE_ID : instanceId,
            "ContactFlowId": contactFlowId == "" ? process.env.CONTACT_FLOW_ID : contactFlowId,
            "Attributes": {
                "customerName": body["ParticipantDetails"]["DisplayName"]
            },
            "ParticipantDetails": {
                "DisplayName": body["ParticipantDetails"]["DisplayName"]
            }
        };

        connect.startChatContact(startChat, function(err, data) {
            if (err) {
                console.log("Error starting the chat.");
                console.log(err, err.stack);
                reject(err);
            } else {
                console.log("Start chat succeeded with the response: " + JSON.stringify(data));
                resolve(data);
            }
        });

    });
}

function buildSuccessfulResponse(result) {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : true,
            'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        body: JSON.stringify({
            data: { startChatResult: result }
        })
    };
    console.log("RESPONSE" + JSON.stringify(response));
    return response;
}

function buildResponseFailed(err) {
    const response = {
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials' : true,
            'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        body: JSON.stringify({
            data: {
                "Error": err
            }
        })
    };
    return response;
}