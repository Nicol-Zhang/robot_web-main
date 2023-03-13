<template>
  <div id="iframe-container">
    <iframe
        :src="addUrl"
        id="mobsf"
        scrolling="yes"
        frameborder="0"
        style="position:absolute; height:100%; left: 0;width: 100%"
    ></iframe>
  </div>
</template>
<script>
import { useStore } from 'vuex';
export default{
  setup(){
    const store = useStore();
    const addUrl = store.state.autoUrl
    return{
      addUrl,
    }
  }
}
</script>