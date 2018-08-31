"use strict";
let Rx = require("rx");
const AWS = require('aws-sdk');
const SNSClient = require('simple-sns-client');
 
const sns = new AWS.SNS();
const snsClient = new SNSClient(sns);
const SNS_TOPIC = process.env.SNS_TOPIC || 'my-topic';

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
                    console.log("Pushing to SQS");
                    snsClient
                        .getTopicArn(SNS_TOPIC)
                        .then(topicArn => snsClient.publish(topicArn, 'Hello world!')); 
                    }
                
            });
        }

    
}

module.exports = SnsSampleSubscribers;
