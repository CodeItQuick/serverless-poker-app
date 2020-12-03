import { main } from '../src/customConnectLambda';

describe('When the event handler for my custom Lambda function is called ', () => {
    test('it should return the province when given a 506 number', () => {
        const input = {
            "event": {
                "Details": {
                    "ContactData": {
                        "Attributes": {},
                        "Channel": "VOICE",
                        "ContactId": "582db96e-19ba-4f6e-892d-4f1069701d50",
                        "CustomerEndpoint": {
                            "Address": "+15064715902",
                            "Type": "TELEPHONE_NUMBER"
                        },
                        "Description": null,
                        "InitialContactId": "582db96e-19ba-4f6e-892d-4f1069701d50",
                        "InitiationMethod": "INBOUND",
                        "InstanceARN": "arn:aws:connect:us-east-1:628132563466:instance/3f117463-2a78-40c0-b0aa-cb1f90fae9a2",
                        "LanguageCode": "en-US",
                        "MediaStreams": {
                            "Customer": {
                                "Audio": null
                            }
                        },
                        "Name": null,
                        "PreviousContactId": "582db96e-19ba-4f6e-892d-4f1069701d50",
                        "Queue": null,
                        "References": {},
                        "SystemEndpoint": {
                            "Address": "+15872085180",
                            "Type": "TELEPHONE_NUMBER"
                        }
                    },
                    "Parameters": {
                        "customerNumber": "+15064715902"
                    }
                },
                "Name": "ContactFlowEvent"
            },
            "context": {
                "callbackWaitsForEmptyEventLoop": true,
                "functionVersion": "$LATEST",
                "functionName": "dev-connect-admin-AWSConnectLambda-1NW53XLNWGBT9",
                "memoryLimitInMB": "128",
                "logGroupName": "/aws/lambda/dev-connect-admin-AWSConnectLambda-1NW53XLNWGBT9",
                "logStreamName": "2020/12/03/[$LATEST]d82bab9bdefc4adcae4213defc356981",
                "invokedFunctionArn": "arn:aws:lambda:us-east-1:628132563466:function:dev-connect-admin-AWSConnectLambda-1NW53XLNWGBT9",
                "awsRequestId": "47c54c6b-57c1-4beb-bcf9-54df916ff48c"
            }
        };
        
    });
})