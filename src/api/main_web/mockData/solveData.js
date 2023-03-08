import { reactive } from "vue";

let solveData=[
    {   
        robotName:'玄武1号',
        errorCode:'30010',
        errorSolution:'1. 没取箱，人工灭灯：海柔机器人再往该输出口送箱时，会检测到有料箱，WMS系统暂停并报异常，系统报异常，等待人工处理；2.人没灭灯（有箱/没箱）：WMS报出异常，等待人工处理（拍灭灯）；',
        errorExplain:'IWMS调用移库接口失败',
        errorLevel:'Error',  
        errorSource:'数据库',
        errorSubmit:'IWMS',
        errorSolveType:'人工自动',
        errorStatus:'处理中'  

    },
    {   
        robotName:'玄武7号',
        errorCode:'50000',
        errorSolution:'低于阈值，系统软件报警',
        errorExplain:'机器人电量低于阈值',
        errorLevel:'Warning',  
        errorSource:'机器人控制系统',
        errorSubmit:'调度软件',
        errorSolveType:'系统自动',
        errorStatus:'处理中'                     
    },
    {   
        robotName:'玄武2号',
        errorCode:'51010',
        errorSolution:'重启机械臂',
        errorExplain:'机械臂移动失败',
        errorLevel:'Fatal',  
        errorSource:'机械臂',
        errorSubmit:'示教软件',
        errorSolveType:'人工手动',
        errorStatus:'处理中'                     
    },
    {   
        robotName:'玄武6号',
        errorCode:'30010',
        errorSolution:'1. 没取箱，人工灭灯：海柔机器人再往该输出口送箱时，会检测到有料箱，WMS系统暂停并报异常，系统报异常，等待人工处理；2.人没灭灯（有箱/没箱）：WMS报出异常，等待人工处理（拍灭灯）；',
        errorExplain:'IWMS调用移库接口失败',
        errorLevel:'Error',  
        errorSource:'数据库',
        errorSubmit:'IWMS',
        errorSolveType:'人工手动',
        errorStatus:'处理中'                     
    },
    {   
        robotName:'玄武1号',
        errorCode:'54000',
        errorSolution:'1. 双层辊筒对接100%对接无失误;2. 机器人在线边无动力接驳空箱卡箱检测条件：接驳架传感系统高电平，机器人检测传感器一直低电平；处理：系统报异常，人工处理；',
        errorExplain:'卡箱异常',
        errorLevel:'Fatal',  
        errorSource:'料想接驳架',
        errorSubmit:'示教软件',
        errorSolveType:'人工自动',
        errorStatus:'处理中'                    
    },
    {   
        robotName:'玄武13号',
        errorCode:'53030',
        errorSolution:'检测二维码是否完整以及周围环境是否异常',
        errorExplain:'获取识别算法位置以及位姿异常',
        errorLevel:'Fatal',  
        errorSource:'二维码',
        errorSubmit:'示教软件',
        errorSolveType:'人工自动',
        errorStatus:'处理中'                      
    },
    {   
        robotName:'玄武8号',
        errorCode:'55000',
        errorSolution:'查看对应IO传感器的网络以及状态',
        errorExplain:'控制IO异常',
        errorLevel:'Error',  
        errorSource:'IO控制器',
        errorSubmit:'示教软件',
        errorSolveType:'系统自动',
        errorStatus:'处理中'                       
    },
    {   
        robotName:'玄武20号',
        errorCode:'52000',
        errorSolution:'查看剪式升降是否开启',
        errorExplain:'执执行任务前，剪式升降回归初始位异常，控制升降滚筒异常',
        errorLevel:'Fatal',  
        errorSource:'剪式升降',
        errorSubmit:'示教软件',
        errorSolveType:'人工自动',
        errorStatus:'处理中'                    
    },

];
const errorLevels=['Fatal','Error','Warning'];
let resultData=[];
const getSolveData = (config) => {
    const { page = 1, total = 10 ,name} = JSON.parse(config.body);
    if(name==='')
    {
        resultData=solveData;
    }
    else{
        resultData = solveData.filter(item => {
            if(item.trigger)
            {
            if ((item.robotName).toString().indexOf(name) > -1 || item.errorCode.indexOf(name) > -1 || item.solution.indexOf(name) > -1 || item.errorExplain.indexOf(name) > -1 || item.errorLevel.indexOf(name) > -1) {
                return item;
            }
            }
        })
    }
    //由危险等级排序
    let sortData=[];
    for(let i=0;i<errorLevels.length;i++)
    {
        for(let j=0;j<resultData.length;j++)
        {
            if(resultData[j].errorLevel==errorLevels[i])
            {
                sortData.push(resultData[j]);
            }
        }
    }
    const pageList = sortData.filter((item, index) => index < total * page && index >= total * (page - 1))
    return {
        code: 200,
        data: pageList,
        total:resultData.length,
    }
};

const solveErrorData=(errorData)=>{
    const {robotName,errorCode}=JSON.parse(errorData.body)
    let tempSolveData=solveData.filter(item=>item.errorCode==errorCode && item.robotName==robotName );
    if(tempSolveData.length==1)
    {    
        solveData = solveData.filter(item=>{
            if(item.errorCode!=errorCode || item.robotName!=robotName )
            {             
                return item;
            }
            else{
                item.errorStatus='已处理';
                return item;
            }
        });
        return{            
            code: 200,
            msg: 'OK',
        }
    }
    else{
        return{
            code:999,
            msg:'解决失败，请重试。',
        }
    }   
}

export default { getSolveData,solveErrorData}