let backData=[
    {
        name:'iwms',
        isConnect:true,
    },
    {
        name:'teaching',
        isConnect:false,
    },
    {
        name:'scheduling',
        isConnect:false,
    },
    {
        name:'error',
        isConnect:false,
    }, 
]

const getBackStatus=(config)=>{
    const {name} = JSON.parse(config.body);
    //开始向相关软件发送请求 看是否连接
    if(name){
        let isFind = backData.some(item=>{
            if(item.name == name)
            {
                item.isConnect=item.isConnect;
                return item.isConnect
            }     
        })
        if(isFind)
        {
            return{
                name:name,
                code:200,
                back:isFind,
                msg:'OK'
            }
        }
        else{
            return{
                name:name,
                code:200,
                back:isFind,
                msg:'OK'
            }
        }
    }
    else{
        return{
            name:name,
            code:200,
            back:isFind,
            msg:'请求异常'
        }
    }

}
const connectBack=(back)=>{
    const {name} = JSON.parse(back.body);
    if(name){
        let isFind = backData.some(item=>{
            if(item.name == name)
            {
                item.isConnect=!item.isConnect;
                return true;
            }     
        });
        if(isFind)
        {
            return{
                name:name,
                code:200,
                back:isFind,
                msg:'OK'
            }
        }
        else{
            return{
                name:name,
                code:200,
                back:isFind,
                msg:'OK'
            }
        }
    }
    else{
        return{
            name:name,
            code:200,
            back:isFind,
            msg:'请求异常'
        }
    }
}

export default{getBackStatus,connectBack}