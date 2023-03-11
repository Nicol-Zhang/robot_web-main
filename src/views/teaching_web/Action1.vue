<template>
    <div>
        action1
    </div>
</template>
<script>
import StompClient from '@/api/stomp-client'
export default {
  data(){
    return{
      subData: []
    }
  },
  methods:{

  },
  mounted() {
    StompClient.connect()
  }
}
</script>