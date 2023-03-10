<template>
  <div class="solveHead">
    <el-tag
        v-for="(tag,index) in tagList"
        :key="tag.name"
        :closable="tag.name !=='home'"
        :disable-transitions="false"
        size="large"
        :effect="$route.name === tag.name ? 'dark': 'palin'"
        @click="changeTag(tag)"
        @close="closeTag(tag, index)"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import {useStore} from 'vuex'
export default defineComponent({
  setup(){
    const store=useStore();
    const router=useRouter();
    const route = useRoute();
    //获取当前界面
    let tagList=store.state.tagList;
    //点击事件
    const changeTag=(tag)=>{
      router.push({name:tag.name})
    }
    //关闭事件
    const closeTag=(tag,index)=>{
      store.commit('deleteTag',tag);
      if(tag.name !== route.name)
      {
        return;
      }
      let length=tagList.length;
      //做第一个判断
      if(index === length)
      {
        router.push({name:tagList[index-1].name});
      }else{
        router.push({name:tagList[index].name})
      }
    }
    return{
      //属性
      tagList,
      //方法
      changeTag,
      closeTag
    }
  }
})
</script>
<style lang="less">
.solveHead{
  margin-left: 20px;
  .el-tag{
    margin: 10px 10px 30px 0;
    cursor: pointer;
  }
}


</style>