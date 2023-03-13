<template>
  <div
      :class="$route.name==='home'?'header':'thumbnail-header'"
  >
    <div v-if="haveSolveData" class="r-content">
      <el-icon @click="goSolveError" :color="iconColor"><WarnTriangleFilled /></el-icon>
      <div id="angle-mark">{{manualSolve}}</div>
    </div>
  </div>
  <el-drawer
      class="warning-box"
      v-model="warningVisible"
      size="35%"
      :row-style="{height:'200px'}"
  >
    <template #header>
      <div class="warning-title">
        <div>
          <el-icon color="#FB4E4E" :size="20" ><CircleCloseFilled /></el-icon>
          异常报告</div>
        <span>
          当前机器人有{{haveSolveData}}个异常，其中{{manualSolve}}个异常需要手动消除，请尽快处理！
        </span>
      </div>
    </template>
    <template #default>
      <el-table
          :data="errorData"
          style="width: 100%"
          :row-style="{height:'80px'}"
          :row-class-name="tableRowClassName"
          @row-click="errorShow"
      >
        <el-table-column
            label="异常等级"
            width="100"
            filter-placement="bottom-end"
            table-layout="fixed"
        >
          <template #default="scope">
            <el-tag
                :type="tagType(scope.row.errorLevel)"
                disable-transitions>
              {{ scope.row.errorLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="errorSolveType" label="处理方式"></el-table-column>
        <el-table-column prop="robotName" label="机器人"></el-table-column>
        <el-table-column prop="errorSource" label="来源方"></el-table-column>
        <el-table-column label="硬触发">
          <template #default="scope">
            <el-switch
                width="20px" class="ml-2"
                style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
                :loading="switchLoading"
                :before-change="()=>switchChange(scope.row)"
                v-if="scope.row.errorSolveType === '人工手动'"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </el-drawer>
  <ErrorDetail ref="detail"></ErrorDetail>
</template>

<script>
import {defineComponent, getCurrentInstance, reactive, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {ElMessage, ElNotification} from 'element-plus'
import ErrorDetail from "./errorDetail.vue"
import {Client} from "@stomp/stompjs"

export default defineComponent({
  components:{
    ErrorDetail
  },
  setup(){
    const{proxy} = getCurrentInstance();
    const router = useRouter();
    const store = useStore();
    const config=reactive({
      page:'1',
      total:'10',
      name:'',
    })
    const iconColor=ref('white');
    const errorData = ref(null);
    const haveSolveData=ref(0);
    const manualSolve=ref(0);
    const detail = ref(null);
    const switchLoading = ref(false);


    //获取列表当前行的高亮显示
    const tagType = (errorLevel) => {
      switch (errorLevel) {
        case 'Warning':
          return 'info'
        case 'Error':
          return 'warning'
        case 'Fatal':
          return 'danger'
      }
    }
    /**
     * @desc: 人工处理异常高亮显示
     */
    const tableRowClassName = ({row, rowIndex}) => {
      if (row.errorSolveType === "人工手动") {
        return 'warning-row'
      }else{
        return ''
      }
    }

    const MQ_SERVICE=ref("ws://10.10.109.32:15674/ws") ;// ws服务地址
    const MQ_USERNAME =ref("test")// 连接用户名
    const MQ_PASSWORD=ref("test") //  连接密码
    let client ;
    const errorTopic = ref();
    const solveDataTopic = ref();

    /**@desc 初始化客户端 创建连接*/
    const initRabbitMQ = ()=>{
      let conf = {
        brokerURL: MQ_SERVICE, // 登录账户的用户名和密码
        connectHeaders: {
          login: MQ_USERNAME,
          passcode: MQ_PASSWORD
        }
      };
      // 初始化客户端
      this.client = new Client(conf);
      client.onConnect=(x) => {
        this.client.publish(
            {destination: "test", body: "Hello, STOMP"}
        )
        client.subscribe(errorTopic, responseCallback);//订阅异常队列
        client.subscribe(solveDataTopic, solveCallback );//订阅异常处理队列
      }
      client.activate()
    }

    /**@desc 订阅回调*/
    const responseCallback=(frame)=>{
      //todo
      console.log(frame)
    }
    const solveCallback=(frame)=>{
      console.log(frame)
    }
    /**@desc 硬处理*/
    const switchChange = (row) => {
      switchLoading.value = true;
      /*todo undefined*/
      client.publish({});
    };

    /**@desc 打開異常提示*/
    const errorShow = (row) => {
      detail.value.showErrorDetail(row);
    }

    //监测错误数据
    let getSolveTimer = setInterval(async() => {
      let res= await proxy.$api.getSolveData(config);
      errorData.value=res.data;
      manualSolve.value=res.data.filter(item=>item.errorSolveType==='人工手动').length;
      haveSolveData.value=res.data.length;
    }, 1000);
    //跳转异常处理主页
    const goSolveError=()=>{
      if(haveSolveData.value>0){
        store.commit('addTag',{
          path: '/error/solveError',
          name: 'solveError',
          label: '异常处理',
          icon: 'check',
        })
        router.push({
          name:'solveError'
        })
      }
      else{
        ElNotification({
          title: '消息',
          message: '当前机器人无异常',
          duration: 2000,
          type: 'info',
          offset: 50,
        })
      }
    }
    //返回home主页
    const goBackHome=()=>{
      router.push({name:'home'});
    }

    //侦听异常数据
    const warningColorTimer = ref(null);
    const warningVisible = ref(false);
    watch(haveSolveData,(newValue,oldValue)=>{
      if(newValue>0)
      {
        if(warningColorTimer.value==null)
        {
          warningColorTimer.value = setInterval(() => {
            iconColor.value = iconColor.value === 'white' ? 'red' : 'white';
          }, 200);
          warningVisible.value = true;
        }
      }
      else{
        clearInterval(warningColorTimer.value);
        iconColor.value = iconColor.value === 'white' ? 'white' : 'white';
        warningColorTimer.value=null;
        ElNotification.closeAll();
        ElNotification({
          title: '成功',
          message: '机器人异常处理成功',
          duration: 3000,
          type:'success',
          offset:50,
        })
      }
    },{immediate:false});

    return{
      //属性
      iconColor,
      warningVisible,
      errorData,
      manualSolve,
      haveSolveData,
      switchLoading,
      detail,
      //方法
      goBackHome,
      goSolveError,
      tagType,
      tableRowClassName,
      switchChange,
      errorShow,
      initRabbitMQ
    }
  },
  mounted() {
    this.initRabbitMQ();
  }

})

</script>


<style lang="less">
.header{
  background: linear-gradient( #2F54EB, #5a62f9);
  backdrop-filter: blur(5px);
  box-shadow: 0 -16px #a4a4a4;;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .r-content{
    position: relative;
    width: 6vw;
    height: 6vw;
    margin: 0 auto;
    .el-icon{
      position: absolute;
      font-size: 40px;
      margin-left: 40%;
      cursor: pointer;
    }
    #angle-mark{
      color: #ffffff;
      position: absolute;
      top: 0;
      right: 0;
    }
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
.thumbnail-header{
  width: 10vw;
  .r-content{
    position: relative;
    display: flex;
    flex-direction: row;
    right: 0;
    width: 3vw;
    height: 3vw;
    .el-icon{
      font-size: 25px;
      margin: 30% 0 0 40%;
      cursor: pointer;
    }
    #angle-mark{
      color: #414040;
      position: absolute;
      top:2px;
      right: 0;
    }
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
.warning-box{
  .warning-title{
    div{
      font-size: 18px;
      font-weight: bolder;
      height: 20px;
      margin: 20px;
      .el-icon{
        margin: 5px;
      }
    }
    span{
      margin-left: 20px;
    }
  }
  .el-table {
    .warning-row{
      --el-table-tr-bg-color: var(--el-color-warning-light-9);
      animation: swirl 100ms infinite linear;
      @keyframes swirl{
        from{
          border: 1px solid orange;
        }
        to{
          border: 4px solid orange;
        }
      }

    }
  }
}

</style>