/* 初始化stomp client实例
* https://stomp-js.github.io/
* */

import {Client} from "@stomp/stompjs";
import {RMQ_ACCOUNT, RMQ_PASSWORD, RMQ_SERVER}from "@/config/rmqConfig.js"

const conf = {
    brokerURL: RMQ_SERVER,
    connectHeaders: {
        login: RMQ_ACCOUNT,
        passcode: RMQ_PASSWORD
    }
};
let client = new Client(conf);

/**
* @module: src\api\stomp-client.js
* @desc: 消息订阅
* @param: topic
* @param: callback
* @return:
*/
export const connect = (topic, callback)=>{
    client.onConnect=(frame)=>{
        client.subscribe(topic, callback);
    };
    client.activate();
}

/**
* @module: src\api\stomp-client.js
* @desc: 消息发布
* @param: destination 发布主题
* @param: body 发布体
* @return:
*/
export const publishMsg=(destination, body)=>{
    client.publish({destination: destination, body: body})
}

export const disconnect=()=>{
    client.deactivate();
}