import { reactive } from "vue";
import FileSaver from "file-saver";


let errorData=(
    [
        {
            id:'1',
            errorCode:'55040',
            errorSolution:'查看辊筒传感与IO控制器的有线连接是否断开，连接后程序自动重连',
            errorExplain:'辊筒的传感、IO控制器有线连接的连接异常',
            errorLevel:'Error',
            errorSource:'双层辊筒传感',
            errorSubmit:'示教软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理',
        },
        {
            id:'2',
            errorCode:'40010',
            errorSolution:'重启海柔机器人，将海柔机器人开关旁的钥匙从自动拨到恢复再拨到自动',
            errorExplain:'海柔机器人与ESS系统失去连接(长期)',
            errorLevel:'Fatal',
            errorSource:'海柔机器人',
            errorSubmit:'IWMS',
            errorSolveType:'人工自动',
            errorStatus:'已处理',
        },
        {
            id:'3',
            errorCode:'40020',
            errorSolution:'如在补料高峰期持续3分钟上报服务器连接失败，重启海柔机器人，将海柔机器人开关旁的钥匙从自动拨到恢复再拨到自动',
            errorExplain:'海柔机器人与ESS系统失去连接(短期)',
            errorLevel:'Error',
            errorSource:'海柔机器人',
            errorSubmit:'IWMS',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'4',
            errorCode:'40030',
            errorSolution:'检查双层辊筒线下层料箱是否到位，未到位需要手动将料箱推到辊筒线内测传感器正上方可以识别到的位置',
            errorExplain:'海柔机器人报识别一维码失败错误(深浅问题)',
            errorLevel:'Fatal',
            errorSource:'双层辊筒传感',
            errorSubmit:'IWMS',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'5',
            errorCode:'30000',
            errorSolution:'确定出库货位是否已有料箱占据，如工作站货位被占据需重新选择工作站货位进行出库',
            errorExplain:'IWMS调用出库接口失败',
            errorLevel:'Error',
            errorSource:'数据库',
            errorSubmit:'IWMS',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'6',
            errorCode:'30010',
            errorSolution:'1. 检查工作站货位是否有料箱未取走，取走料箱后系统自动恢复；2.工作站货位没有料箱，但未拍灭灯，拍灭灯后系统自动恢复；',
            errorExplain:'IWMS调用移库接口失败',
            errorLevel:'Error',
            errorSource:'数据库',
            errorSubmit:'IWMS',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'7',
            errorCode:'50010',
            errorSolution:'等待复合机器人控制软件与调度软件重新建立通信连接，如长期宕机，需联系相关工程师检查网络和软件系统',
            errorExplain:'复合机器人断开连接',
            errorLevel:'Warning',
            errorSource:'机器人控制系统',
            errorSubmit:'调度软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'8',
            errorCode:'50000',
            errorSolution:'机器人电量低于阈值，及时充电',
            errorExplain:'机器人电量低于阈值',
            errorLevel:'Warning',
            errorSource:'机器人控制系统',
            errorSubmit:'调度软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'9',
            errorCode:'54000',
            errorSolution:'检查接驳架上的料箱是否到位，料箱复位后，系统自动恢复',
            errorExplain:'机器人在线边无动力接驳空箱时卡箱',
            errorLevel:'Fatal',
            errorSource:'料箱接驳架',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'10',
            errorCode:'51000',
            errorSolution:'查看机械臂是否开启',
            errorExplain:'执行任务前，机械臂回归初始位异常',
            errorLevel:'Fatal',
            errorSource:'机械臂',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'11',
            errorCode:'52000',
            errorSolution:'查看剪式升降是否开启',
            errorExplain:'执执行任务前，剪式升降回归初始位异常，控制升降滚筒异常',
            errorLevel:'Fatal',
            errorSource:'剪式升降',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'12',
            errorCode:'52010',
            errorSolution:'查看拉线编码器接是否连接',
            errorExplain:'执行任务前，剪式升降回归初始位异常，查询拉线编码器当前位置异常',
            errorLevel:'Fatal',
            errorSource:'拉线编码器',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'13',
            errorCode:'53000',
            errorSolution:'1.查看相机是否连接；2.查看周围环境是否异常；3.查看相机曝光；4.检查二维码是否完整；',
            errorExplain:'图像采集异常',
            errorLevel:'Fatal',
            errorSource:'相机',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'14',
            errorCode:'53010',
            errorSolution:'1.查看相机是否连接；2.查看周围环境是否异常；3.查看相机曝光；4.检查二维码是否完整；',
            errorExplain:'二维码识别算法异常',
            errorLevel:'Fatal',
            errorSource:'二维码',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'15',
            errorCode:'53020',
            errorSolution:'料盒被人为操作，比对任务信息与料盒对应信息',
            errorExplain:'筛选符合要求的二维码坐标异常',
            errorLevel:'Fatal',
            errorSource:'二维码',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'16',
            errorCode:'53030',
            errorSolution:'1.查看相机是否连接；2.查看周围环境是否异常；3.查看相机曝光；4.检查二维码是否完整；',
            errorExplain:'获取识别算法位置以及位姿异常',
            errorLevel:'Fatal',
            errorSource:'二维码',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'17',
            errorCode:'53040',
            errorSolution:'调整抓取料盒位姿，料盒左右距离过大，不易放到九宫格里',
            errorExplain:'串口相机距离补偿太大,超过设定阀值65',
            errorLevel:'Fatal',
            errorSource:'串口相机',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'18',
            errorCode:'54010',
            errorSolution:'检查接驳架上的料箱是否到位，料箱复位后，系统自动恢复',
            errorExplain:'料箱取料异常，增量上升后，依旧检测不到信号',
            errorLevel:'Fatal',
            errorSource:'料箱接驳架',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'19',
            errorCode:'55000',
            errorSolution:'1.查看对应IO控制器的网络状态；2.查看控制系统的网络状态；',
            errorExplain:'控制IO异常',
            errorLevel:'Error',
            errorSource:'IO控制器/控制系统',
            errorSubmit:'示教软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'20',
            errorCode:'55010',
            errorSolution:'调整抓取料盒位姿，触发夹具传感器',
            errorExplain:'机械臂IO获取超时',
            errorLevel:'Error',
            errorSource:'夹具传感器',
            errorSubmit:'示教软件',
            errorSolveType:'人工自动',
            errorStatus:'已处理'
        },
        {
            id:'21',
            errorCode:'55020',
            errorSolution:'剪式升降可能被人为放入料箱，需要进行数据库比对',
            errorExplain:'IO状态参数不匹配',
            errorLevel:'Error',
            errorSource:'剪式升降',
            errorSubmit:'示教软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'22',
            errorCode:'55030',
            errorSolution:'1.查看卷帘门或玻璃门IO控制器的网络状态；2.查看机器人的网络状态；',
            errorExplain:'控制卷帘门IO失败或者控制玻璃门IO失败',
            errorLevel:'Error',
            errorSource:'IO控制器/机器人',
            errorSubmit:'示教软件',
            errorSolveType:'系统自动',
            errorStatus:'已处理'
        },
        {
            id:'23',
            errorCode:'51010',
            errorSolution:'重启机械臂',
            errorExplain:'机械臂移动失败',
            errorLevel:'Fatal',
            errorSource:'机械臂',
            errorSubmit:'示教软件',
            errorSolveType:'人工手动',
            errorStatus:'已处理'
        },
    ]
);
let resultData=reactive[{}];

const getErrorData = (config) => {
    const { page = 1, total = 10 ,name} = JSON.parse(config.body);
    if(name==='')
    {
        resultData=errorData;
    }
    else{
        resultData = errorData.filter(item => {
            if ((item.id).toString().indexOf(name) > -1 || item.errorCode.indexOf(name) > -1 || item.solution.indexOf(name) > -1 || item.errorExplain.indexOf(name) > -1 || item.errorLevel.indexOf(name) > -1) {
                return item;
            }
        })
    }
    const pageList = resultData.filter((item, index) => index < total * page && index >= total * (page - 1))
    return {
        code: 200,
        data: pageList,
        total:resultData.length,
    }
};

const addErrorData = (newData)=>{
    var { id, errorCode ,solution,errorExplain,errorLevel} = JSON.parse(newData.body);
    id = (id===errorData.length+1) ? id  : errorData.length+1;
   //判断是否唯一
    var isReErrocode = errorData.filter(item => item.errorCode === errorCode)
    if (isReErrocode.length <= 0) {
        errorData.push({
            id: id,
            errorCode: errorCode,
            errorExplain: errorExplain,
            errorLevel: errorLevel,
            solution: solution,
            trigger:false
        })
        // var saveJson = JSON.stringify(errorData, null, 4);
        // const blob = new Blob([saveJson], { type: 'application/json' });
        // FileSaver.saveAs(blob, './errorData.json');
        return {
            code: 200,
            msg: 'OK',
        }
    }
    else {
        return {
            code: 999,
            msg: '异常码已存在，请检查后重新提交',
        }
    }
}
const changeErrorData = (changeData)=>{
    var { id, errorCode ,solution,errorExplain,errorLevel,trigger} = JSON.parse(changeData.body);
   //判断是否唯一
    var isHave = errorData.some(item=>{
        if(item.id === id)
        {
            item.errorCode=errorCode;
            item.errorExplain=errorExplain;
            item.errorLevel=errorLevel;
            item.solution=solution;
            item.trigger=trigger;
            return true;
        }
    });
    if(isHave)
    {
        // var saveJson = JSON.stringify(errorData, null, 4);
        // const blob = new Blob([saveJson], { type: 'application/json' });
        // FileSaver.saveAs(blob, './errorData.json');
        return {
            code:200,
            msg:'OK'
        }
    }else{
        return {
            code:999,
            msg:'编辑有误，请重新编辑'
        }
    }
}
const deleteErrorData =(deleteData)=>{
    var { id, errorCode ,solution,errorExplain,errorLevel} = JSON.parse(deleteData.body);
    errorData=errorData.filter(item=>item.errorCode!==errorCode);
    errorData=errorData.map((item,index)=>
    {
        item.id=index+1;
        return item;
    });
    return{
        code:200,
        msg:'OK'
    }
}

const solveError=(solveData)=>{
    var { id, errorCode ,solution,errorExplain,errorLevel} = JSON.parse(solveData.body);
   
}



export default{getErrorData,addErrorData,changeErrorData,deleteErrorData,solveError}