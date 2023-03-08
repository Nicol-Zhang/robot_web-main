<template>
  <el-head class="header">
    <div class="l-content" @click="goBackHome()">
      <!--        <el-icon><Monitor/></el-icon>-->
      <p>元启</p>
    </div>
    <div class="r-content">
      <el-icon @click="goSolveError" :color="iconColor"><WarnTriangleFilled /></el-icon>
      <div id="angle-mark">{{manualSolve}}</div>
    </div>
  </el-head>
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
        <el-table-column label="查看详情">
          <el-icon
              @click=""
              color="#409eff"
              size="25px"><MoreFilled /></el-icon>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script>
import {defineComponent, getCurrentInstance, reactive, ref, watch} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {ElMessage, ElNotification} from 'element-plus'

export default defineComponent({
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
     * @desc: table单行样式设置
     */
    const tableRowClassName = ({row, rowIndex}) => {
      if (row.errorSolveType === "人工手动") {
        return 'warning-row'
      }else{
        return ''
      }
    }

    const switchLoading = ref(false);
    const switchChange = async (row) => {
      switchLoading.value = true;
      let res = await proxy.$api.solveErrorData(row);
      if (res.msg === 'OK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            switchLoading.value = false
            ElMessage.success('异常解决完成')
            return resolve(true)
          }, 1000)
        })
      }
      else {
        return new Promise((_, reject) => {
          setTimeout(() => {
            switchLoading.value = false
            ElMessage.error('异常解决失败，请重试')
            return reject(new Error('Error'))
          }, 1000)
        })
      }
    };

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
          //出现异常
          // ElNotification({
          //   title: '异常报告',
          //   message: `当前机器人有${haveSolveData.value}个异常，其中${manualSolve.value}个异常需要手动消除，请尽快处理`,
          //   duration: 0,
          //   type: 'error',
          //   offset: 50,
          //   onClick: () => {
          //     goSolveError();
          //   }
          // })
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
      //方法
      goBackHome,
      goSolveError,
      tagType,
      tableRowClassName,
      switchChange
    }
  },

})

</script>


<style lang="less">
.header{
  background-color: #2F54EB;
  box-shadow: 0 -16px #a4a4a4;;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  .l-content{
    cursor: pointer;
    display: flex;
    align-items: center;
    p{
      font-size: 20px;
      color: #424242;
      margin-left: 20px;
      letter-spacing: 3px;
    }
    .el-icon{
      color: white;
      font-size: 20px;
      margin:0 10px 0 10px;
    }
  }
  .r-content{
    display: flex;
    align-items: center;
    width: 20px;
    height: 20px;
    margin-right: 100px;
    .el-icon{
      font-size: 40px;
      margin-right: 20px;
      cursor: pointer;
    }
    #angle-mark{
      color: #ffffff;
      position: absolute;
      top:15px;
      right: 70px;
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