<template>
  <div id='container'>
    <div id='firstLine'>
      {{houseName}}
    </div>

    <group>
      <calendar :value.sync="startDate" title="起始日期："></calendar>
      <calendar :value.sync="endDate" title="结束日期："></calendar>
    </group>

    <group>
      <xnumber title="房源数：" placeholder="可供出租房源数" :min="0" :value="roomNum" @on-change='houseNumChange'></xnumber>
      <xnumber title="价 格：" placeholder="房源价格" :min="0" :value="price" :step="10" @on-change='housePriceChange'></xnumber>
    </group>

    <group>
      <selector placeholder="设置房源状态" :options="houseStatusList" :value.sync="houseStatus"></selector>
    </group>

    <div style="margin: 10px;">
      <button type="primary" @click="updateHouseStatus">更新房态</button>
    </div>

    <alert :show.sync="alertshow" title="设置房源房态" button-text="关 闭">
      <p style="text-align:center;">{{alertText}}</p>
    </alert>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>
  </div>
</template>
<style>
  #container{
    height: 100%;
    margin-top: 10px;
  }

  #firstLine {
    text-align: left;
    margin-left: 20px;
    font-size: 20px;
    color: rgb(4, 190, 2);
  }
</style>

<script>

  import calendar from 'vux/dist/components/calendar'
  import xnumber from 'vux/dist/components/x-number'
  import loading from 'vux/dist/components/loading'
  import group from 'vux/dist/components/group'
  import selector from 'vux/dist/components/selector'
  import button from 'vux/dist/components/x-button'
  import alert from 'vux/dist/components/alert'

  export default{
    data(){
      return {
        houseId: '',
        houseName: '默认房源名称',
        startDate: '',
        endDate: '',
        roomNum: 0,
        price: 0,
        status: '',
        houseStatusList: [{key: '1', value: '可租'}, {key: '0', value: '不可租'}],
        houseStatus: '',
        updateApiUrl: 'butler-api/user/platform/house/update',
        alertshow: false,
        alertText : '',
        show: false,
        loadingText: '房态设置中...',
        userOpenId: 'wx001',
        selectedPlantformId: ''
      }
    },
    components: {
      calendar,
      xnumber,
      loading,
      group,
      selector,
      button,
      alert
    },
    ready: function () {
      this.houseId = getQueryStringByName("houseId");
      this.houseName = getQueryStringByName("houseName");
      this.selectedPlantformId = getQueryStringByName("plantformId");

      //get useropenid from store state
      var gettedOpenId = window.store.state.useOpenId;
      if(gettedOpenId != '')
      {
        this.userOpenId = gettedOpenId;
      }
    },
    methods: {
      updateHouseStatus : function () {
        this.show = true;
        var updateHousePostUrl = this.updateApiUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId
          + '&houseId=' + this.houseId + '&startDate=' + this.startDate + '&endDate=' + this.endDate + '&houseNum=' + this.roomNum
          + '&houseStatus=' + this.houseStatus + '&housePrice=' + this.price;
        debugger;
        this.$http.post(updateHousePostUrl)
          .then(function (response) {
              var returnData = response.data;
              if (returnData.status == 200) {
                this.alertText = '房源房态设置成功！';
                this.alertshow = true;
              }
              else {
                //API返回失败编号 - 除了200之外
                this.alertText = returnData.desc;
                this.alertshow = true;
              }
              this.show = false;
            }, function (response) {
              //请求失败
              this.show = false;
              this.alertText = response.desc;
              this.alertshow = true;
            }
          )
          .catch(function (response) {
            //当请求出现异常，打印出对应的错误信息
            console.log(response);
            this.show = false;
            this.alertText = response.desc;
            this.alertshow = true;
          });
      },

      houseNumChange: function (val) {
        this.roomNum = val;
      },

      housePriceChange: function (val) {
        this.price = val;
      }
    }
  }

  function getQueryStringByName(name){
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
    if(result == null || result.length < 1){
      return "";
    }
    return decodeURI(result[1]);
  }
</script>
