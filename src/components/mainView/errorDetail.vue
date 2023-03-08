<template>
  <el-dialog
      v-model="detailVisible"
      title="Tips"
      width="40%"
  >
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
  </el-dialog>
</template>

<script>
import {defineComponent, getCurrentInstance, reactive, ref, defineExpose, watch} from 'vue';
export default defineComponent({
  setup(){
    const { proxy } = getCurrentInstance();
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
    });
    const showErrorDetail=(error)=>{
      proxy.$nextTick(() => {
        Object.assign(detailForm, error)
      })
      detailVisible.value = true;
    };
    return{
      detailVisible,
      detailForm,
      showErrorDetail
    }
  }
})
</script>

<style scoped>

</style>