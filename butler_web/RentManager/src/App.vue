<template>
  <div id="wrapper">
    <xheader :left-options="{showBack: false}">短租管家助手</xheader>

    <router-view>
    </router-view>
  </div>
</template>

<script>
  import xheader from 'vux/dist/components/x-header'

  //app.vue的主要作用：相当于masterpage, 决定整体的页面布局， 相当于index.html的controller
  export default {
    components:{
      xheader
    }
  }
</script>

<style>
  @import '~vux/dist/vux.css';

  html {
    height: 100%;
  }

  body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #fbf9fe;
  }

  #wrapper {
    height: 100%;
    width: 100%;
  }

</style>
