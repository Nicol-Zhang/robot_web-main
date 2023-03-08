<template>
  <div class="common-layout">
    <el-container>
      <el-header>
            <MainHeader></MainHeader>
        </el-header>
      <el-container>
        <el-main>
            <MainTags></MainTags>
            <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import MainAside from'../components/mainView/mainAside.vue'
import MainHeader from'../components/mainView/mainHeader.vue'
import MainTags from '../components/mainView/mainTags.vue'
import { defineComponent } from 'vue';
export default defineComponent({
    components:{
        MainAside,
        MainHeader,
        MainTags
    }
})
</script>

<style lang="less"> 
.common-layout{
  height: 100%;
  width:100%;
  .el-container{
    width: 100%;
    height: 100%;
    .el-header{
      padding: 0px;
    }
  }

}
</style>