"use strict";


let snsEvent = require("../events/SnsEvent");


//sendCancellation
let events = require("events");
let EventEmitter = events.EventEmitter;
let snsEventEmitter = new EventEmitter();
let SnsSampleSubscribers = require("../reactors/SnsSampleSubscribers");
SnsSampleSubscribers.setupRectorPipeline(snsEventEmitter);



class SnsClient{
    
	testSnsPush(callback){
		//Emmit en event and return whenever an event come 
    	let message = {"name":"sampleMessage"};
    	snsEventEmitter.emit("snsSampleEvent",new snsEvent(message));
    	return callback(null, {"status":"success", "message":"pushed event successfully"});
 }
}

module.exports = SnsClient;
