<template>
    <div class="aside">
            <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#003399"
            text-color="#fff"
            active-text-color="black"
          >
          <el-sub-menu index="./home" >
              <template #title>
                <el-icon><Guide /></el-icon>
                <!-- <span @click="selectMenu({path: '/home',name: 'home',label: '首页',icon: 'home'})">机器人管理</span> -->
                <span>机器人管理</span>
              </template>
              <el-sub-menu :index="item.path" v-for="item in hasChildren()" :key ="item.path" >              
                <template #title>
                    <el-icon>
                        <component class="icon" :is="item.icon"></component>
                    </el-icon>
                    <span >{{item.label}}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.path" @click="selectMenu(subItem)">
                        <component class="icon" :is="subItem.icon"></component>
                    <span>{{subItem.label}}</span>  
                       </el-menu-item>
                </el-menu-item-group>           
            </el-sub-menu>
              <el-menu-item :index="item.path" v-for="item in noChildren()" :key="item.key " @click="selectMenu(item)" >
                <el-icon>
                        <component class="icon" :is="item.icon"></component>
                </el-icon>
                <span >{{ item.label }}</span>
             </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </div>
</template>

<script>
import { defineComponent } from 'vue';
import{ useStore}from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup(){
        //全局变量
        const router = useRouter();
        const store = useStore();
        //左侧aside的列表
        const asideList=store.state.asideList;
        //是否有chidren
        const noChildren = () => {
            return asideList.filter((item) => !item.children)
        };
        const hasChildren = () => {
            return asideList.filter((item) => item.children)
        };    
        //列表选择函数
        const selectMenu=(item)=>{
            store.commit('addTag',item);
            router.push({name:item.name});
        }
        return{
            asideList,
            selectMenu,
            noChildren,
            hasChildren,
        }
    }
})

</script>

<style lang="less">
.aside{
    background-color: #003399;
    height: 100%;
    width: 100%;
    border-radius: 10px;
    .el-menu{
        border-right: 0px;
    }
    .el-menu-item {
        .el-icon{
            color: rgb(145, 18, 170);
        }
    }
    .icon{
        width: 15px;
        height: 15px;
        margin-right: 5px;
    }
}

</style>