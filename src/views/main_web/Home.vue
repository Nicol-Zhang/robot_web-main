<template>
  <div class="homeView">
    <el-row class="homeRow">
      <TransitionGroup>
        <el-col
            v-for="(item, index) in homeComponents"
            :key="item.name"
            :span="6"
        >
          <div
              class="homeCard"
              @click=handlePoint(item)
          >
            <el-image :src="getImageUrl(item.name)" />
<!--            <el-popover :width="100" trigger="click">
              <template #reference>
                <el-button style="margin-right: 16px" text>
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
              </template>
              <div class="btn-bar">
                <div @click="deleteThisCard(item)" style="border-bottom: 1px solid #808080">删除</div>
                <div @click="connectBack(item.name)">
                  <el-icon v-if="btm === 'Link'" :color="item.connectStatu ? 'green' : 'red'">
                    <component class="icon" :is="btm"></component>
                  </el-icon>
                  连接
                </div>
              </div>

            </el-popover>-->

            <!--            <div class="leftLine" v-if="item.name !== 'add'">-->
            <!--              <el-button text class="button" v-for="btm in buttons">-->
            <!--                <el-icon v-if="btm === 'Link'" :color="item.connectStatu ? 'green' : 'red'"-->
            <!--                         @click="connectBack(item.name)">-->
            <!--                  <component class="icon" :is="btm"></component>-->
            <!--                </el-icon>-->

            <!--              </el-button>-->
            <!--            </div>-->
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
    <el-drawer v-model="drawer" direction="btt" :before-close="handleClose">
      <template #header="{ close, titleId, titleClass }">
        <el-header>{{ drawerTitle }}</el-header>
        <el-button type="info" @click="drawer=false">
          <el-icon class="el-icon--left" color="white">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </template>
      <el-main>
        <el-row>
          <el-col :span="3" v-for="item in chooseChildren(drawerTitle)" :offset="1">
            <el-card shadow="always" class="childCard">
              <el-button text @click="selectMenu(item)" v-if="drawerTitle !== '项目添加'">{{ item.label }} </el-button>
              <el-button text @click="addProjectCard(item)" v-if="drawerTitle === '项目添加'">{{ item.label }} </el-button>
            </el-card>
          </el-col>
        </el-row>
        <!-- <el-button v-for="item in chooseChildren(drawerTitle)"  color="#626aef" class="childButtons">
          {{ item.label }}
        </el-button> -->
      </el-main>
    </el-drawer>
  </div>
</template>

<script>
import { ElMessage, ElNotification } from 'element-plus';
import { defineComponent, getCurrentInstance, onBeforeMount, onMounted, onUpdated, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const { proxy } = getCurrentInstance();
    const getInitialItems = () => store.state.projectList;
    const homeComponents = ref(getInitialItems());
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
    //列表选择函数
    const selectMenu = (item) => {
      store.commit('addTag', item);
      router.push({ name: item.name });
    }
    let getImageUrl = (imgSrc) => {
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

            if (item.name == name) {
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
    //drawer界面
    const drawer = ref(false);
    const drawerTitle = ref('iwms');

    const handlePoint = (item) => {
        //todo
        // window.open('http://10.50.5.35:1314/',"_blank");
        drawerTitle.value = item.label;
        drawer.value = true;
    }
    //删除card
    const deleteThisCard = (card) => {
      store.commit('deleteProject', card);
      homeComponents.value=getInitialItems();
      console.log(homeComponents.value);
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
    }
  }
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
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .el-header {
      margin-left: 30px;
    }
  }
  .childCard {
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