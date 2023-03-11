/*封装ws请求处理*/
import StompClient from '@/api/stomp-client'

/**
* @module: src\api\stomp.js
* @desc: 订阅
* @param: topic 目的地
* @return: msg.body 订阅消息体
*/
export const subscribeData = (topic)=>{
    StompClient.subscribe(topic, (msg)=>{
        return msg.body;
    })
}
/**
* @module: src\api\stomp.js
* @desc: 发布
* @param: topic 发布目的地
* @param: body 发布消息体
* @return:
*/
export const publishData = (topic, body)=>{
    let pubData = {destination: topic, body: body}
    StompClient.publish(pubData)
}