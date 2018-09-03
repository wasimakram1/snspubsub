"use strict";
const Rx = require("rx");
const AWS = require('aws-sdk');
const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET = process.env.AWS_SECRET;
const SNS_REGION = process.env.SNS_REGION;
const APPLICATION_ARN = process.env.APPLICATION_ARN;
const DEVICE_TOKEN = process.env.DEVICE_TOKEN;
const SNSClient = require('simple-sns-client');
const sns = new AWS.SNS();

class SnsSampleSubscribers{
    static setupRectorPipeline(SnsSampleEventEmitter) {
         let snsSampleSource;
        snsSampleSource = Rx.Observable.fromEvent(SnsSampleEventEmitter,
            "snsSampleEvent",
            (snsEvent) => {
                return snsEvent;
            }).publish();
        snsSampleSource.connect();
        let snsSampleSubscribers = new SnsSampleSubscribers();
        snsSampleSubscribers.subscribe(snsSampleSource);
    }

    subscribe(snsSampleSource) {
        snsSampleSource
            .filter((SnsEvent) => {
                
                //Put any fitler here, returning true for now
                return true;
            })
            .subscribe((SnsEvent) => {
                
                //put all the action here
                pushMsgToSQS();

                function pushMsgToSQS(){

                    console.log("Hello World");
                    // Set region
                    AWS.config.update({
                      // accessKeyId: AWS_KEY,
                      // secretAccessKey: AWS_SECRET,
                      region: SNS_REGION
                    });
                    
                    //Create a payload here 
                    var payload = {
                        default: 'Hello World',
                        APNS: {
                            aps: {
                                alert: 'Hello World',
                                sound: 'default',
                                badge: 1
                            }
                        }
                    };

                    // first have to stringify the inner APNS object...
                    payload.APNS = JSON.stringify(payload.APNS);
                    // then have to stringify the entire message payload
                    payload = JSON.stringify(payload);

                    
                    // For a target ARN you have to create the endpoint for it, below is the code 
                    // sns.createPlatformEndpoint({
                    //     PlatformApplicationArn: APPLICATION_ARN,
                    //     Token: DEVICE_TOKEN
                    // }, function(err, data) {
                    //     if (err) {
                    //         console.log(err.stack);
                    //         return;
                    //     }
                    //     var endpointArn = data.EndpointArn;
                   
                    //json is for json message, string message dont need any structure type 
                    sns.publish({
                        Message: payload,      // Required
                        MessageStructure: 'json',
                        TargetArn: endpointArn, // can add topic ARN or target ARN here
                    }, function(err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log('push sent');
                        console.log(data);
                    });
                    
                }
            }
        );
    }

}

module.exports = SnsSampleSubscribers;

