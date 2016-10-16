<template>
  <div id="wrapper">
    <div class="header">
    <xheader :left-options="{showBack: false}">短租管家助手</xheader>
      </div>

    <router-view>
    </router-view>

    <div class="footer">
      <tab>
        <tabitem :selected="selectedTab === item" v-for="item in tabList" @click="selectTab(item)">{{ item }}</tabitem>
      </tab>
    </div>
  </div>
</template>

<script>
  import xheader from 'vux/dist/components/x-header'
  import tab from 'vux/dist/components/tab'
  import tabitem from 'vux/dist/components/tab-item'

  //app.vue的主要作用：相当于masterpage, 决定整体的页面布局， 相当于index.html的controller
  export default {
    data(){
      return {
        selectedTab: '',
        tabList: ['使用助手', '房源列表', '房态设置']
      }
    },
    components: {
      xheader,
      tab,
      tabitem
    },
    methods: {
      selectTab: function (selectedTabItem) {
        this.selectedTab = selectedTabItem;

        if (selectedTabItem === '使用助手') {
          window.router.go({
            name: 'Help'
          });
        }
        else if (selectedTabItem === '房源列表') {
          window.router.go({
            name: 'HouseList'
          });
        }
        else if (selectedTabItem === '房态设置') {
          window.router.go({
            name: 'HouseSettingList'
          });
        }
      }
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

  .vux-tab {
    background: #f7f7fa;
  }

  .hedaer{
    width: 100%;
    position:fixed;
    top:0;
    margin-top: 0;
  }

  .footer{
    width: 100%;
    position:fixed;
    bottom:0;
  }


</style>
