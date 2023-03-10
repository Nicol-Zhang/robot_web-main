<template>
  <el-row class="common-layout">
    <!--      <el-header>
                <MainHeader></MainHeader>
            </el-header>-->
    <el-col :span="$route.name==='home' ? 14 : 24" class="main">
      <MainTags></MainTags>
      <RouterView></RouterView>
    </el-col>
    <el-col :span="$route.name==='home' ? 10 : 0">
      <MainHeader></MainHeader>
    </el-col>

  </el-row>
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
</style>