<template>
  <el-row v-if="$route.name==='home'" class="common-layout">
    <!--      <el-header>
                <MainHeader></MainHeader>
            </el-header>-->
    <el-col :span="14" class="main">
      <RouterView></RouterView>
    </el-col>
    <el-col :span="10">
      <MainHeader></MainHeader>
    </el-col>
  </el-row>
  <div v-else class="sub-layout">
    <div class="sub-main">
      <MainTags></MainTags>
      <RouterView></RouterView>
    </div>
    <div class="sub-header">
      <MainHeader></MainHeader>
    </div>
  </div>
</template>

<script>
import MainAside from'../components/mainView/mainAside.vue'
import MainHeader from'../components/mainView/mainHeader.vue'
import MainTags from '../components/mainView/mainTags.vue'
import {defineComponent, ref} from 'vue';
import {useRouter} from "vue-router";
export default defineComponent({
  components:{
    MainAside,
    MainHeader,
    MainTags
  },
})
</script>

<style lang="less">
.common-layout{
  height: 100%;
  width:100%;
}
.sub-layout{
  position:relative;
  height: 100%;
  width:100%;
  .sub-main{
    height: 100%;
    width: 100%;
  }
  .sub-header{
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
  }
}
</style>