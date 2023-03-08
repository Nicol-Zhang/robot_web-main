<template>
  <div class="findError">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.errorCode" placeholder="请输入异常码或机器人名" prop="errorCode" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onFindError">查询</el-button>
        <el-button type="primary" @click="onClearFind">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table
        :data="solveDataList"
        style="width: 100%; height: 200px"
        :cell-style="cellStyle"
        @row-dblclick="errorlShow">
      <el-table-column v-for="item in solveHeadList" :key="item.prop" :label="item.label" :prop="item.prop"
                       :min-width="item.width ? item.width : '8%'">
      </el-table-column>
      <el-table-column prop="errorLevel" label="异常等级" width="100" filter-placement="bottom-end" table-layout="fixed">
        <template #default="scope">
          <el-tag :type="tagType(scope.row.errorLevel)" disable-transitions>{{ scope.row.errorLevel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="硬触发"
          min-width="5%"
          filter-placement="bottom-end"
          table-layout="fixed">
        <template #default="scope">
          <el-switch
              width="20px" class="ml-2"
              style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
              :loading="switchLoading"
              :disabled="false"
              :before-change="()=>switchChange(scope.row)"
              v-if="scope.row.errorSolveType === '人工手动'"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination small background layout="prev, pager, next" :total="pageNum.num" class="pager mt-4"
                   @current-change="pageChange" />
  </div>
  <el-dialog v-model="detailVisible" title="Tips" width="30%" :before-close="handleClose">
    <template #header>
      <span>详细信息</span>
    </template>
    <el-form :model="detailForm" label-width="100px" size="large">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机器人名字">
            <el-input v-model="detailForm.robotName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="异常码">
            <el-input v-model="detailForm.errorCode" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="异常说明">
        <el-input type="textarea" v-model="detailForm.errorExplain" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="问题来源">
            <el-input v-model="detailForm.errorSource" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题上报">
            <el-input v-model="detailForm.errorSubmit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="处置方案">
        <el-input type="textarea" v-model="detailForm.errorSolution" />
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="解决方式">
            <el-input v-model="detailForm.errorSolveType" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="异常状态">
            <el-input v-model="detailForm.errorStatus" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="异常等级">
            <el-input v-model="detailForm.errorLevel" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    Confirm
                </el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus'
export default defineComponent({
  setup() {
    //获取当前vue句柄
    const { proxy } = getCurrentInstance();
    //列表表头
    const solveHeadList = reactive([
          {
            prop: "robotName",
            label: "机器人",
          },
          {
            prop: "errorCode",
            label: "异常码",
          },

          {
            prop: "errorExplain",
            label: "异常说明",
            width: '20%',
          },
          {
            prop: "errorSource",
            label: "问题来源方",
          },
          {
            prop: "errorSubmit",
            label: "问题上报方",

          },
          {
            prop: "errorSolution",
            label: "处置方案",
            width: '40%',
          },
          {
            prop: "errorSolveType",
            label: "解决方式",

          },
          {
            prop: "errorStatus",
            label: "异常状态",

          },
        ]
    )
    //列表数据
    const solveDataList = ref([]);
    const config = reactive({
      page: '1',
      total: '10',
      name: '',
    })
    const pageNum = reactive({
      num: '0',
    });
    //列表规则
    const getSolveData = async (configer) => {
      config.name = formInline.errorCode;
      let res = await proxy.$api.getSolveData(configer);
      solveDataList.value = res.data;
      pageNum.num = (res.total % 10) !== 0 ? Math.ceil(res.total / 10) * 10 : res.total;
    }
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
    //每行详细信息
    const detailVisible = ref(false);
    const detailForm = reactive({
      robotName: '',
      errorCode: '',
      errorExplain: '',
      errorSource: '',
      errorSubmit: '',
      errorSolution: '',
      errorSolveType: '',
      errorStatus: ''
    })
    //列表每行点击时间
    const errorlShow = (row) => {
      console.log(row);
      detailVisible.value = true;
      proxy.$nextTick(() => {
        Object.assign(detailForm, row)
      })
    }
    //改变页数
    const pageChange = (page) => {
      config.page = page;
      proxy.$api.getErrorData(config);
    }
    //查询列表
    const formInline = reactive({
      errorCode: ''
    })
    //开始查询
    const onFindError = async () => {
      config.name = formInline.errorCode;
      let res = await proxy.$api.getSolveData(config);
      solveDataList.value = res.data;
      pageNum.num = (res.total % 10) !== 0 ? Math.ceil(res.total / 10) * 10 : res.total;
    }
    //清除查询
    const onClearFind = async () => {
      config.name = '';
      let res = await proxy.$api.getSolveData(config);
      solveDataList.value = res.data;
      pageNum.num = (res.total % 10) !== 0 ? Math.ceil(res.total / 10) * 10 : res.total;
      formInline.errorCode = '';
    }

    //新建相关属性
    const isTrigger = ref(false);

    //解决问题
    const switchLoading = ref(false);

    /**
    * @desc: 切换硬触发前向后端发送解决异常请求 （proxy.$api.solveErrorData），
     * 后端返回"OK"提示用户”异常解决完成“，从后端获取solveData
     * 后端未返回"OK"向用户抛出异常
    */
    const switchChange = async (row) => {
      switchLoading.value = true;
      let res = await proxy.$api.solveErrorData(row);
      if (res.msg === 'OK') {
        return new Promise((resolve) => {
          setTimeout(() => {
            switchLoading.value = false
            ElMessage.success('异常解决完成')
            getSolveData(config);
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
    onMounted(() => {
      getSolveData(config);
    })
    return {
      //参数
      solveHeadList,
      solveDataList,
      config,
      pageNum,
      formInline,
      isTrigger,
      switchLoading,
      detailVisible,
      detailForm,

      //方法
      switchChange,
      pageChange,
      onFindError,
      onClearFind,
      tagType,
      errorlShow
    }

  }
})

</script>

<style lang="less">
.findError {
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>