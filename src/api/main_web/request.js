import axios from "axios";
import config  from "../../config/index";
import { ElMessage} from 'element-plus';
const NETWORK_ERROR ='网络请求异常，请稍后重试....';

//创建一个axios实力对象
const service = axios.create({
    baseURL:config.baseApi
})

//在请求之前做一些事情
service.interceptors.request.use((req)=>{
    //可以自定义header
    //jwt-token认证的时候
    return req;
})

//请求以后做一些事
service.interceptors.response.use((res)=>{
    const{code,data,msg}=res;
    //视情况而定
    if(data.code===200){
        return data;
    }else{
        //网络请求错误
        ElMessage.error(data.msg || NETWORK_ERROR);
        return Promise.reject(data.msg || NETWORK_ERROR);
    }
})

//封装核心函数
function request(options){
    options.method = options.method || 'get';
    if(options.method.toLowerCase()==='get')
    {
        options.params=options.data;
    }
    //对mock处理
    let isMock =config.mock;
    if(typeof options.mock !=='undefined')
    {
        isMock=options.mock;
    }
    //对线上环境做处理
    if(config.env==='prod'){
        //不使用mock机会
        service.defaults.baseURL=config.baseApi
    }
    else{
        service.defaults.baseURL=isMock ? config.mockApi :config.baseApi;   
    }
    return service(options);
}
export default {request};