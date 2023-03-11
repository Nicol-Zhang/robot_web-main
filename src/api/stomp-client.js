/* 初始化stomp client实例*/
import {Client} from "@stomp/stompjs";
import {RMQ_ACCOUNT, RMQ_PASSWORD, RMQ_SERVER}from "@/config/rmqConfig.js"

export class StompClient{
    constructor(topic) {
        this.conf = {
            brokerURL: RMQ_SERVER,
            connectHeaders: {
                login: RMQ_ACCOUNT,
                passcode: RMQ_PASSWORD
            }
        }
        this.client = new Client(this.conf);
        this.connect()
    }
    /**@desc 建立代理连接*/
    connect(){
        const _this = this;
        this.client.onConnect((success) => {
            _this.client.subscribe(_this.topic, (msg)=>{
                //todo
            })
        })
        this.client.activate();
    }
    /**@desc 订阅消息*/
    subscribe(){

    }
    /**@desc 断开连接*/
    closeConnect(){
        this.client.onDisconnect(()=>{
            console.log("断开连接")
        })
    }
}
//创建实例

export default new StompClient(RMQ_SERVER, RMQ_ACCOUNT, RMQ_PASSWORD);