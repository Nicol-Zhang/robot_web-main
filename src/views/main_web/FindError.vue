<template>
    <div class="addErrorDiv">
        <el-button type="primary" @click="openAddError">+ 新增</el-button>      
        <el-form :inline="true" :model="formInline" class="demo-form-inline" >
            <el-form-item >
                <el-input v-model="formInline.errorCode" placeholder="请输入异常码" prop="errorCode" />
            </el-form-item>   
            <el-form-item>
                <el-button type="primary" @click="onFindError">查询</el-button>
                <el-button type="primary" @click="onClearFind">清空</el-button> 
            </el-form-item>
        </el-form>
    </div>
    <div class="table">
        <el-table :data="errorDataList" style="width: 100%; heigth:200px"  :cell-style="cellStyle"  >
            <el-table-column 
            v-for="item in errorHeadList"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.width ? item.width : '5%'"         
            >             
            </el-table-column>
            <el-table-column
              prop="errorLevel"
              label="异常等级"
              width="100"          
              filter-placement="bottom-end"
            >
              <template #default="scope">
                <el-tag
                  :type="tagType(scope.row.errorLevel)"
                  disable-transitions
                  >{{ scope.row.errorLevel }}</el-tag
                >
              </template>
            </el-table-column>        
            <el-table-column label='操作' min-width="10%">
                <!-- 插槽 -->
                <template #default="scope"> 
                    <el-button type="primary" size="small" @click="editErrorData(scope.row)">编辑</el-button>
                    <el-button type="primary" size="small" @click="deleteErrorData(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination 
        small
        background 
        layout="prev, pager, next" 
        :total="pageNum.num" 
        class="pager mt-4"
        @current-change="pageChange" />
    </div>
    <div class="errorDialog">
        <el-dialog
    v-model="dialogVisible"
    :title="eidtOrAdd.key==='add'? '新建异常' : '编辑异常'"
    width="30%"
    :before-close="handleClose"
  >
    <div class="addFormDiv" >
        <el-form :model="addFormData" label-width="120px" ref="addForm" :rules="errorFormRules">
            <el-form-item label="序号"  prop="id">
                <el-col :span="12">
                <el-input v-model="addFormData.id" placeholder="随意填写id" :disabled="eidtOrAdd.key=='add' ? false : true" />
            </el-col>
            </el-form-item>
            <el-form-item label="异常码"  prop="errorCode" >
                <el-col :span="12">
                <el-input v-model="addFormData.errorCode" placeholder="异常码不可重复"/>
            </el-col>              
            </el-form-item>
            <el-form-item label="处置方案" prop="solution" >
                <el-input v-model="addFormData.solution" type="textarea" />
            </el-form-item>
            <el-form-item label="异常说明" prop="errorExplain">
                <el-input v-model="addFormData.errorExplain" type="textarea" />
            </el-form-item>
            <el-form-item label="异常等级"  prop="errorLevel">
                <el-select v-model="addFormData.errorLevel" placeholder="请选择异常等级">
                    <el-option label="Warning" value="Warning" />
                    <el-option label="Error" value="Error" />
                    <el-option label="Fatal" value="Fatal" />
                </el-select>
            </el-form-item>
            <el-form-item label="触发状态"  prop="trigger">
                <el-switch
                v-model="isTrigger"
                width="20px"
                class="ml-2"
                style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
                disabled
              />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addErrorData(addFormData)">确认</el-button>
                 <el-button type="info" @click="cannelAdd">取消</el-button>
            </el-form-item>
        </el-form>
    </div>   
  </el-dialog>
    </div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive ,ref} from 'vue';
import{ElMessageBox,ElMessage} from 'element-plus'
export default defineComponent({
    setup(){
        //获取当前vue句柄
        const {proxy} = getCurrentInstance();
        //列表表头
        const errorHeadList = reactive([
            {
                prop: "id",
                label: "序号",
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
                width:'40%',
            }, 
            {
                prop: "errorSolveType",
                label: "解决方式",
                
            },
            {
                prop: "errorStatus",
                label: "异常状态",

            },
            // {
            //     prop: "errorLevel",
            //     label: "异常等级",
            //     width: 125,
            // },
        ]
        )
        //列表数据
        const errorDataList = ref([]);     
        const config=reactive({
            page:'1',
            total:'10',
            name:'',
        })
        const pageNum=reactive({
            num:'0',
        });
        //列表规则
        const errorFormRules=({
            id:[
                { required: true, message: 'id为必填项', trigger: 'blur' },
            ],
            errorCode:[              
                { required: true, message: '异常码为必填项', trigger: 'blur' },           
            ],
            errorLevel:[              
                { required: true, message: '异常等级为必填项', trigger: 'blur' },           
            ],
            errorExplain:[              
                { required: true, message: '异常说明为必填项', trigger: 'blur' },           
            ],
            solution:[              
                { required: true, message: '处置方案为必填项', trigger: 'blur' },           
            ],
        })
        const getErrorData = async(configer)=>{
            config.name=formInline.errorCode;
            let res=await proxy.$api.getErrorData(configer);
            errorDataList.value=res.data;
            pageNum.num= (res.total%10) !==0 ? Math.ceil(res.total/10)*10 : res.total;
        }
        //获取列表当前行的高亮显示
        const tagType=(errorLevel)=>{
            switch (errorLevel){
                case 'Warning':
                    return 'info'
                case 'Error':
                    return 'warning'
                case 'Fatal':
                    return 'danger'
            }
        }
        //改变页数
        const pageChange=(page)=>{
            config.page=page;
            getErrorData(config);
        }
        //查询列表
        const formInline=reactive({
            errorCode:''
        })
        //开始查询
        const onFindError=async()=>{          
            config.name=formInline.errorCode;
            let res=await proxy.$api.getErrorData(config);
            errorDataList.value=res.data;
            pageNum.num= (res.total%10) !==0 ? Math.ceil(res.total/10)*10 : res.total;
        }
        //清楚查询
        const onClearFind=async()=>{
            config.name='';
            let res=await proxy.$api.getErrorData(config);
            errorDataList.value=res.data;
            pageNum.num= (res.total%10) !==0 ? Math.ceil(res.total/10)*10 : res.total;
            formInline.errorCode='';
        }

        //新建相关属性
        const dialogVisible=ref(false);
        const isTrigger=ref(false);
        const openAddError=()=>{
            eidtOrAdd.key='add'
            dialogVisible.value=true;
        }
        const addFormData=reactive({
            id:'',
            errorCode:'',
            solution:'',
            errorExplain:'',
            errorLevel:'',
            trigger:false,            
        })
        //新建异常
        const addErrorData = (newErrorData) => {
        
            proxy.$refs.addForm.validate(async (vaild) => {
                if (vaild) {
                    let res;
                    if(eidtOrAdd.key==='add')
                    {
                        res = await proxy.$api.addErrorData(newErrorData);                    
                    }
                    else
                    {
                        res = await proxy.$api.changeErrorData(newErrorData);
                    }
                    if (res.msg === 'OK') {
                        getErrorData(config);
                        dialogVisible.value = false;
                        proxy.$refs.addForm.resetFields();
                    }
                }
            })
        }
        //左上角关闭时
        const handleClose = (done) => {
            ElMessageBox.confirm('确定取消添加机器人异常吗?')
                .then(() => {
                    proxy.$refs.addForm.resetFields();
                    done()
                })
                .catch(() => {
                    // catch error
                })
        }
        //取消添加时
        const cannelAdd=()=>{
            proxy.$refs.addForm.resetFields();
            dialogVisible.value=false;
        }
        //编辑和新增标志位
        const eidtOrAdd=reactive({
            key:'add',   
        })
        //编辑功能
        const editErrorData=(item)=>{
            eidtOrAdd.key='edit';
            dialogVisible.value=true;
            proxy.$nextTick(()=>{
                Object.assign(addFormData,item)
            })           
        }
        //删除功能
        const deleteErrorData=async(item)=>{
            let res = await proxy.$api.deleteErrorData(item);
            getErrorData(config);
        }
        onMounted(()=>{
            getErrorData(config);          
        })
        return{
            //参数
            errorHeadList,
            errorDataList,
            config,
            pageNum,
            formInline,
            dialogVisible,
            addFormData,
            errorFormRules,
            eidtOrAdd,
            isTrigger,

            //方法
            pageChange,
            onFindError,
            onClearFind,
            tagType,
            addErrorData,
            handleClose,
            cannelAdd,
            openAddError,
            editErrorData,
            deleteErrorData,
            // solveError
        }

    }
})

</script>

<style lang="less">
.addErrorDiv{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

</style>