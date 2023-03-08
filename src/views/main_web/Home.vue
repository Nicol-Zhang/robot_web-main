<template>
  <div class="homeView">
    <el-row class="homeRow">
      <TransitionGroup>
        <el-col
            v-for="(item, index) in homeComponents"
            :key="item.name"
            :span="6"
        >
          <el-card
              :body-style="{ padding: '20px', display: 'flex', alignItems: 'center', flexWarp: 'nowarp' }"
              class="homeCard"
              shadow="hover">
            <template #header>
              <div class="card-header">
<!--                <el-image :src="getImageUrl(item.name)" />-->
                <span>{{ item.label }}</span>
              </div>
              <el-icon><MoreFilled /></el-icon>
            </template>
            <div class="leftLine" v-if="item.name !== 'add'">
              <el-button text class="button" v-for="btm in buttons">
                <el-icon v-if="btm === 'Link'" :color="item.connectStatu ? 'green' : 'red'"
                         @click="connectBack(item.name)">
                  <component class="icon" :is="btm"></component>
                </el-icon>
                <el-icon v-if="btm === 'Pointer'" :color="item.connectStatu ? 'green' : 'red'" @click="handlePoint(item)">
                  <component class="icon" :is="btm"></component>
                </el-icon>
                <el-icon v-else-if="btm === 'Delete'" color="green" @click="deleteThisCard(item)">
                  <component class="icon" :is="btm"></component>
                </el-icon>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </TransitionGroup>
      <el-col :span="9" :offset="2" class="addCard">
        <el-card>
          <div @click="addHandle()" class="addDiv">
            <el-image :src="getImageUrl('add')" />
            <span>项目添加</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
import { create } from 'lodash';
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
        let children = hasChildrens.filter((item) => item.label == label);
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
      return new URL(`../../assets/${imgSrc}.jpg`, import.meta.url).href;
    }
    //软件在线状态
    const buttons = reactive(['Link', 'Pointer', 'Delete']);
    //获取软件连接状态
    const getBackStatus = async (name,symbol) => {
      let res = await proxy.$api.getBackStatus({
        name: name
      });
      if (res.msg == 'OK') {
        if(symbol!='onMounted')
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
      if(res.msg=='OK'){
        getBackStatus(name);
      }
    }
    //drawer界面
    const drawer = ref(false);
    const drawerTitle = ref('iwms');
    const handlePoint = (item) => {
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
      let isAddList = store.state.projectList.filter(item => item.label == card.label);
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
        if (element.name != 'add')
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
  .homeRow {
    display: flex;
    justify-content: flex-start;
    .addCard {
      font-size: 30px;
      .addDiv {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .el-image {
          height: 10%;
          width: 10%;
          border-radius: 50%;
          margin-right: 20px;
        }
      }
      .addDiv:hover {
        background-color: beige;
      }
    }
  }
  .el-card {
    margin: 20px;
    .leftLine {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
      .el-icon {
        font-size: 30px;
      }
    }
    .card-header {
      //background-color: #13ce66;
      border-radius: 20px;
      height: 40vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 25px;
      .el-icon {
        transform: rotate (90deg);
        font-size: 30px
      }
    /*  .el-image {
        height: 10%;
        width: 10%;
        border-radius: 50%;
        margin-right: 20px;
      }*/
    }
  }
}
.homeDrawer {
  header {
    margin: 0px;
    padding: 0px;
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