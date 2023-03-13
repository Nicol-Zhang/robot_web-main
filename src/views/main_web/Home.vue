<template>
  <div></div>
  <div class="homeView">
    <div id="promptText">
      <div>请选择应用</div>
      <span>或点击
        <svg x="1678341947511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3974" width="20" height="20"><path d="M720 112a192 192 0 1 0 0 384 192 192 0 0 0 0-384z m-128 192a128 128 0 1 1 256 0 128 128 0 0 1-256 0zM128 192a64 64 0 0 1 64-64h224a64 64 0 0 1 64 64v224a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V192z m64 0v224h224V192H192zM128 608a64 64 0 0 1 64-64h224a64 64 0 0 1 64 64V832a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V608z m64 0V832h224V608H192zM544 608a64 64 0 0 1 64-64H832a64 64 0 0 1 64 64V832a64 64 0 0 1-64 64H608a64 64 0 0 1-64-64V608z m64 224H832V608H608V832z" fill="#409eff" fill-opacity=".9" p-id="3975"></path></svg>
        按钮添加应用
      </span>
    </div>
    <el-row class="homeRow">
      <TransitionGroup>
        <el-col
            v-for="(item, index) in homeComponents"
            :key="item.name"
            :span="6"
        >
          <img
              v-if="mask === item.label"
              class="del-btn"
              @click="deleteThisCard(item)"
              src="../../assets/recycle.png"
              v-click-outside="handleClickOutside"
              alt=""/>
          <div
              class="homeCard"
              :class="mask===item.label?'mask':''"
              @mousedown="onTouchStart(item)"
              @mouseup="onTouchEnd(item)"
          >
            <el-image :src="getImageUrl(item)"/>
          </div>
          <div class="card-header">
            <span>{{item.label}}</span>
          </div>
        </el-col>
      </TransitionGroup>
    </el-row>
    <el-button type="primary" @click="addHandle()" class="add-btn" plain>
      <svg x="1678341947511" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3974" width="20" height="20"><path d="M720 112a192 192 0 1 0 0 384 192 192 0 0 0 0-384z m-128 192a128 128 0 1 1 256 0 128 128 0 0 1-256 0zM128 192a64 64 0 0 1 64-64h224a64 64 0 0 1 64 64v224a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V192z m64 0v224h224V192H192zM128 608a64 64 0 0 1 64-64h224a64 64 0 0 1 64 64V832a64 64 0 0 1-64 64H192a64 64 0 0 1-64-64V608z m64 0V832h224V608H192zM544 608a64 64 0 0 1 64-64H832a64 64 0 0 1 64 64V832a64 64 0 0 1-64 64H608a64 64 0 0 1-64-64V608z m64 224H832V608H608V832z" fill="#409eff" fill-opacity=".9" p-id="3975"></path></svg>
    </el-button>
  </div>
  <div class="homeDrawer">
    <el-drawer v-model="drawer" direction="btt">
      <template #header="{ close, titleId, titleClass }">
        <el-header>{{ drawerTitle }}</el-header>
        <el-button :type="isEdit?'success':''" @click="isEdit = !isEdit">
          <p v-if="isEdit">完成</p>
          <p v-else>编辑</p>
        </el-button>
      </template>
      <el-main>
        <el-row>
          <el-col :span="3" v-for="item in chooseChildren(drawerTitle)" :offset="1">
            <el-card shadow="always" class="childCard">
              <el-button text @click="selectMenu(item)" v-if="drawerTitle !== '项目添加'">{{ item.label }} </el-button>
              <el-button text @click="addProjectCard(item)" v-else>{{ item.label }} </el-button>
            </el-card>
          </el-col>
          <el-col v-show="drawerTitle==='项目添加'" :span="3" :offset="1">
            <el-card shadow="always" class="childCard">
              <el-button @click="createDialog=true;isEdit=false" text>
                <svg x="1678694501144" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6292" width="20" height="20"><path d="M972.8 460.8c-30.72 0-51.2-20.48-51.2-51.2V153.6c0-30.72-20.48-51.2-51.2-51.2H153.6c-30.72 0-51.2 20.48-51.2 51.2v716.8c0 30.72 20.48 51.2 51.2 51.2h256c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2H102.4c-56.32 0-102.4-46.08-102.4-102.4V102.4C0 46.08 46.08 0 102.4 0h819.2c56.32 0 102.4 46.08 102.4 102.4v307.2c0 30.72-20.48 51.2-51.2 51.2z" fill="#707070" p-id="6293"></path><path d="M665.6 768h307.2c30.72 0 51.2 20.48 51.2 51.2s-20.48 51.2-51.2 51.2h-307.2c-30.72 0-51.2-20.48-51.2-51.2s20.48-51.2 51.2-51.2z m153.6-153.6c30.72 0 51.2 20.48 51.2 51.2v307.2c0 30.72-20.48 51.2-51.2 51.2s-51.2-20.48-51.2-51.2v-307.2c0-30.72 20.48-51.2 51.2-51.2z" fill="#707070" p-id="6294"></path></svg>
                <p style="margin-left: 5px">新建应用</p>
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-drawer>
  </div>
  <!--用户自定义应用配置  -->
  <el-dialog v-model="createDialog" width="30%" title="创建应用">
    <el-form label-width="70px" label-position="right">
      <el-form-item label="应用名称">
        <el-input v-model="newApp.label"></el-input>
      </el-form-item>
      <el-form-item label="URL">
        <el-input v-model="newApp.url"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin-left: 40%">
      <el-button type="info" @click="createDialog=false">取消</el-button>
      <el-button type="primary" @click="createApp">创建</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {ClickOutside, ElMessage, ElNotification} from 'element-plus';
import { defineComponent, getCurrentInstance, onBeforeMount, onMounted, onUpdated, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const getInitialItems = () => store.state.projectList;
    const homeComponents = ref(getInitialItems());//主页显示的应用
    const createDialog = ref(false);
    const isEdit = ref(false);//项目添加列表是否为编辑状态
    let newApp = reactive({label:null,url:null})

    /**@desc 创建应用*/
    const createApp = ()=>{
      if (newApp.label===null || newApp.label===null){
        ElMessage("请完整填写应用信息")
        return
      }
      store.commit('createProject', newApp);
      createDialog.value=false;
      proxy.$nextTick(()=>{
        Object.assign(newApp, {label:null,url:null});
      })
    }
    //是否有chidren
    const noChildren = () => {
      return homeComponents.filter((item) => !item.children)
    };

    const chooseChildren = (label) => {
      if (label !== '项目添加') {
        let hasChildrens = homeComponents.value.filter((item) => item.children);
        let children = hasChildrens.filter((item) => item.label === label);
        return children[0].children;
      }
      else {
        return addCardList;
      }
    };

    let timer = ref(null);
    let mask = ref('');
    const onTouchStart = (item)=>{
      clearTimeout(timer);
      timer = setTimeout(()=>{
        mask.value = item.label;
        timer = 0;
      }, 1000)
    }
    const onTouchEnd = (item)=>{
      clearTimeout(timer);
      if (timer!==0){
        handlePoint(item);
      }
    }
    //列表选择函数
    const selectMenu = (item) => {
      if (isEdit){
        if ('selfDefined' in item){

        }else {
          ElMessage('默认用于不支持编辑！')
        }
      }else{
        store.commit('addTag', item);
        router.push({ name: item.name });
      }
    }

    /**@desc 获取本地图片*/
    let getImageUrl = (item) => {
      let imgSrc;
      if ('selfDefined' in item){
        imgSrc = "autoApp";
      }else {
        imgSrc = item.name;
      }
      return new URL(`../../assets/${imgSrc}.png`, import.meta.url).href;
    }
    //软件在线状态
    const buttons = reactive(['Link', 'Pointer', 'Delete']);

    //获取软件连接状态
    const getBackStatus = async (name,symbol) => {
      let res = await proxy.$api.getBackStatus({
        name: name
      });
      if (res.msg === 'OK') {
        if(symbol!=='onMounted')
        {
          homeComponents.value.some(item => {

            if (item.name === name) {
              item.connectStatu = res.back;
              if (item.connectStatu) {
                ElMessage.success(`${name}连接成功`);
              }
              else {
                ElMessage.error(`${name}断开连接`);
              }
              return true;
            }
          })
        }
      }
    };
    //连接软件
    const connectBack = async(name) => {
      let res = await proxy.$api.connectBack({
        name:name
      })
      if(res.msg==='OK'){
        getBackStatus(name);
      }
    }

    /**@desc 取消删除按钮显示*/
    const handleClickOutside = (e)=>{
      if ( e.target.className!=="homeCard mask"){
        mask.value=null;
      }
    }

    //drawer界面
    const drawer = ref(false);
    const drawerTitle = ref('iwms');
    //打开界面应用
    const handlePoint = (item) => {
      //判断是否为自定义应用
      if ('selfDefined' in item){
        store.commit('changeAutoUrl', item.url);
        store.commit('addTag', item);
        router.push({ name: item.name });
      }else{
        drawerTitle.value = item.label;
        drawer.value = true;
      }
    }
    //删除card
    const deleteThisCard = (card) => {
      store.commit('deleteProject', card);
      homeComponents.value=getInitialItems();
      mask.value=null;
    }

    //添加页面
    const addCardList = store.state.addCardList;
    const addHandle = () => {
      drawerTitle.value = '项目添加';
      drawer.value = true;
    }
    //添加card
    const addProjectCard = (card) => {
      let isAddList = store.state.projectList.filter(item => item.label === card.label);
      if (isAddList.length > 0) {
        ElNotification({
          title: '消息',
          message: '当前项目已经存在',
          duration: 2000,
          type: 'info',
          offset: 50,
        })
      } else {
        store.commit('addProject', card);
      }
    }
    onMounted(() => {
      homeComponents.value.forEach(element => {
        if (element.name !== 'add')
          getBackStatus(element.name,'onMounted')
      });
    });
    return {
      //属性
      homeComponents,
      buttons,
      drawer,
      drawerTitle,
      mask,
      createDialog,
      newApp,
      isEdit,
      //方法
      selectMenu,
      noChildren,
      getImageUrl,
      connectBack,
      handlePoint,
      chooseChildren,
      addHandle,
      deleteThisCard,
      addProjectCard,
      onTouchStart,
      onTouchEnd,
      handleClickOutside,
      createApp
    }
  },
  directives: {ClickOutside},
})

</script>

<style lang="less">
.homeView {
  position: absolute;
  margin:0 auto;
  padding: 3vw;
  left: 3vw;
  bottom: 28vh;
  width: 50vw;
  color: #424242;
  #promptText{
    font-size: 30px;
    color: #6e6e6e;
    margin-bottom: 30px;
    font-weight: bolder;
    div{
      margin-bottom: 10px;
    }
    span{
      font-size: 18px;
      font-weight: initial;
    }
  }
  .add-btn{
    height: 40px;
    width: 40px;
    border-radius: 50%;
    position: absolute;
    //top: 50px;
    right: 0;
    bottom: -40px;
  }
  .homeRow {
    display: flex;
    justify-content: flex-start;
    .el-col {
      margin-top: 30px;
    }

  }
  .del-btn{
    width: 45px;
    height: 40px;
    position:absolute;
    margin: 1.7vw 0 0 3vw;
    z-index: 1002;
    animation: bounce 0.4s linear infinite;
    @keyframes bounce{
      0% {
        transform:rotate(-30deg);

      }
      25% {
        transform:rotate(0);
      }
      50% {
        transform:rotate(30deg);

      }
      75% {
        transform:rotate(0);
      }
      100% {
        transform:rotate(-30deg);
      }
    }
  }
  .homeCard {
    padding: 20px;
    display: flex;
    background-color: #475cf3;
    height: 6vw;
    width: 6vw;
    border-radius: 30%;
    margin: 0 0 15px 20px;
    .el-icon {
      transform: rotate (90deg);
      font-size: 30px
    }
  }
  .mask{
    filter: blur(5px) grayscale(100%);
  }
  .el-popover{
    z-index: 1000;
    .btn-bar{
      display: flex;
      flex-direction: column;
      div{
        text-align: center;
        gap: 10px;
      }
    }
  }
  .card-header {
    text-align: left;
    justify-content: center;
    font-size: 14px;
    margin-left: 15%;
    letter-spacing: 1px;
    font-weight: bolder;
  }
}


.homeDrawer {
  header {
    margin: 0;
    padding: 0;
    background-color: #003399;
    font-size: 20px;
    color: aliceblue;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-header {
      margin-left: 30px;
    }
  }
  .childCard {
    margin-bottom: 10px;
    text-align: center;
    cursor: pointer;
    .el-button {
      width: 100%;
      height: 100%;
      font-size: 20px;
    }
  }
}
</style>