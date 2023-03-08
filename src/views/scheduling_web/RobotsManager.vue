<template>
    <div class="robot-header">
      <!--type="primary"主要按钮-->
      <el-button type="primary" @click="handleAdd">+新增</el-button>
      <!-- model对应的双向绑定 -->
      <!-- 按钮的标签 -->
      <el-form :inline="true" :model="formInline">
        <el-form-item label="请输入">
          <el-input v-model="formInline.keyword" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSerch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table :data="list" style="width: 100%" height="100%">
        <el-table-column label="序号" type="index" width="120" align="center">
        </el-table-column>
        <el-table-column
          v-for="item in tableLabel"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :width="item.width ? item.width : 125"
        />
        <el-table-column label="连接">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isConnect"
              width="20px"
              class="ml-2"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :loading="switchLoading"
              :before-change="() => switchChange(scope.row)"
              :active-value="1"
              :inactive-value="0"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="180">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button type="danger" size="small" @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        background
        layout="prev, pager, next"
        :total="config.total"
        @current-change="changePage"
        class="pager mt-4"
      />
    </div>
    <!-- //新增和编辑都是一样的，在这里做一下判断 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'add' ? '新增' : '编辑'"
      width="35%"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="formRobot" ref="robotForm">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="IP"
              prop="ip"
              :rules="[{ required: true, message: 'IP是必填项' }]"
            >
              <el-input v-model="formRobot.ip" placeholder="请输入IP" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="端口"
              prop="port"
              :rules="[{ required: true, message: '端口是必填项' }]"
            >
              <el-input
                v-model.number="formRobot.port"
                placeholder="请输入端口"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="name"
              prop="name"
              :rules="[{ required: true, message: 'name是必填项' }]"
            >
              <el-input
                v-model.number="formRobot.name"
                placeholder="请输入name"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="justify-content: flex-end">
          <el-form-item>
            <el-button type="primary" @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确定</el-button
          >
        </span>
      </template> -->
    </el-dialog>
  </template>
  
  <script>
  import {
    defineComponent,
    getCurrentInstance,
    onMounted,
    ref,
    reactive,
  } from "vue";
  import { ElMessageBox, ElMessage } from "element-plus";
  export default defineComponent({
    setup() {
      const { proxy } = getCurrentInstance();
      const list = ref([]);
      //表头的设置
      const tableLabel = reactive([
        {
          prop: "ip",
          label: "IP",
          width: 200,
        },
        {
          prop: "port",
          label: "端口",
          width: 150,
        },
        {
          prop: "name",
          label: "名字",
          width: 180,
        },
      ]);
      onMounted(() => {
        getRobotData(config);
      });
      const config = reactive({
        total: 0,
        page: 1, //
        name: "",
      });
      const getRobotData = async (config) => {
        let res = await proxy.$api.getRobotData(config);
        // console.log(res);
        config.total = res.count;
        list.value = res.data.list.map((item) => {
          return item;
        });
      };
      const switchLoading = ref(false);
      const switchChange = async (row) => {
        
       switchLoading.value = true;
        let res = await proxy.$api.getChangeConnectStatusData(row);
        console.log(res);
        if (res.msg == "OK") {
          return new Promise((resolve) => {
            setTimeout(() => {
              switchLoading.value = false;
              ElMessage.success("连接状态修改完成");
              return resolve(true);
            }, 1000);
          });
        } else {
          return new Promise((_, reject) => {
            setTimeout(() => {
              switchLoading.value = false;
              ElMessage.error("连接状态修改失败，请重试");
              return reject(new Error("Error"));
            }, 1000);
          });
        }
      };
  
      const changePage = (page) => {
        // console.log(page);
        config.page = page;
        getRobotData(config);
      };
      const formInline = reactive({
        keyword: "",
      });
      const handleSerch = () => {
        config.name = formInline.keyword;
        getRobotData(config);
      };
      // 控制模态框的显示隐藏
      const dialogVisible = ref(false);
      const handleClose = (done) => {
        ElMessageBox.confirm("确定关闭吗?")
          .then(() => {
            dialogVisible.value = false;
            proxy.$refs.robotForm.resetFields();
            // 点击关闭时按X的时候会警示消失
            done();
          })
          .catch(() => {
            // catch error
          });
      };
      // 添加用户的form数据
      const formRobot = reactive({
        id: "", // 添加用户的 用户名
        ip: "",
        port: "",
        name: "",
        isConnect: "",
      });
      // 添加用户
      const onSubmit = () => {
        proxy.$refs.robotForm.validate(async (valid) => {
          if (valid) {
            if (action.value == "add") {
              let res = await proxy.$api.addRobot(formRobot); //调用接口数据
              if (res) {
                // console.log(proxy.$refs);
                dialogVisible.value = false;
                proxy.$refs.robotForm.resetFields();
                getRobotData(config);
              }
            } else {
              // 编辑的接口
  
              let res = await proxy.$api.editRobot(formRobot);
              if (res) {
                // console.log(proxy.$refs);
                dialogVisible.value = false;
                proxy.$refs.robotForm.resetFields();
                getRobotData(config);
              }
            }
          } else {
            ElMessage({
              showClose: true,
              message: "请输入正确的内容",
              type: "error",
            });
          }
        });
      };
      // 取消
      const handleCancel = () => {
        dialogVisible.value = false;
        proxy.$refs.robotForm.resetFields();
      };
      // 区分编辑和新增
      const action = ref("add");
      // 编辑用户
      const handleEdit = (row) => {
        // 浅拷贝
  
        action.value = "edit";
        dialogVisible.value = true;
        row.sex == 1 ? (row.sex = "男") : (row.sex = "女");
        proxy.$nextTick(() => {
          Object.assign(formRobot, row);
        });
      };
      // 新增用户
      const handleAdd = () => {
        action.value = "add";
        dialogVisible.value = true;
      };
      // 删除用户
      const handleDelete = (row) => {
        ElMessageBox.confirm("你确定删除吗?")
          .then(async () => {
            await proxy.$api.deleteRobot(row);
  
            ElMessage({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            getRobotData(config);
          })
          .catch(() => {
            // catch error
          });
      };
      return {
        list,
        tableLabel,
        config,
        formInline,
        dialogVisible,
        switchLoading,
        formRobot,
        action,
        onSubmit,
        handleCancel,
        handleEdit,
        handleAdd,
        handleDelete,
        handleClose,
        switchChange,
        changePage,
        handleSerch,
      };
    },
  });
  </script>
  
  <style lang="less" scoped>
  .table {
    position: relative;
    height: 520px;
    .pager {
      position: absolute;
      right: 0;
      bottom: -20px;
    }
  }
  .robot-header {
    display: flex;
    justify-content: space-between;
  }
  </style>
  