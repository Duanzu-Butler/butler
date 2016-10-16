<template>
  <div>
    <full-calendar :events="fcEvent" lang="zh"></full-calendar>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>
  </div>
</template>
<style>
  .available {
    text-align: left;
    font-size: 20px;
    color: rgb(4, 190, 2);
    white-space: normal;
    height: 78px;
    background-color: red;

  }

  /*.event-box{*/
  /*height: 78px;*/
  /*white-space:normal;*/
  /*background-color: red;*/
  /*}*/

  .event-item {
    height: 78px;
    white-space: nowrap;
    background-color: red;
  }

</style>
<script>
  import fullCalendar from 'vue-fullcalendar'
  import loading from 'vux/dist/components/loading'

  //let demoEvents = []

  export default{
    data(){
      return {
        fcEvent: [],
        getHouseStatusApiUrl: '/butler-api/user/platform/house/get',
        userOpenId: 'wx001',
        selectedPlantformId: '',
        houseId: '',
        searchMonth: '',
        show: false,
        loadingText: '加载中...',
        apiReturnData: []
      }
    },
    components: {
      fullCalendar,
      loading
    },
    ready: function () {
      this.houseId = getQueryStringByName("houseId");
      this.houseName = getQueryStringByName("houseName");
      this.selectedPlantformId = getQueryStringByName("plantformId");

      //clear house status first
      //demoEvents = [];

      //get useropenid from store state
      var gettedOpenId = window.store.state.useOpenId;
      if(gettedOpenId != '')
      {
        this.userOpenId = gettedOpenId;
      }

      this.show = true;
      var vm = this;

      //1.获取房源动态列表
      //获取当天日期YYYY-MM-DD
      this.searchMonth = getNowFormatDate();
      var getHouseStatusUrl = this.getHouseStatusApiUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId
        + '&houseId=' + this.houseId + '&searchMonth=' + this.searchMonth;
      this.$http.post(getHouseStatusUrl)
        .then(function (response) {
            var returnData = response.data;
            if (returnData.status == 200) {
              //API返回成功编号200
              //更新指定平台的房源列表和平台名称
              this.$set('apiReturnData', returnData.result);

              debugger;
              if (this.apiReturnData != null && this.apiReturnData.length > 0) {
                //2.遍历房源动态列表添加到日历控件中
                this.apiReturnData.forEach(function (entry) {
                  var houseStatusDate = entry.date;
                  var houseNum = entry.houseNum;
                  var housePrice = entry.housePrice;
                  var houseStatus = entry.houseStatus;
                  var josoObject = {};
                  //当房源状态为0的时候，代表当前房屋是关闭状态，需要在日历控件中展示出来
                  if (houseStatus == '0') {
                    josoObject = {title: '关闭', start: houseStatusDate, end: houseStatusDate};
                    vm.fcEvent.push(josoObject);
                  }
                  josoObject = {title: houseNum.toString() + '间', start: houseStatusDate, end: houseStatusDate};
                  vm.fcEvent.push(josoObject);
                  josoObject = {title: housePrice.toString(), start: houseStatusDate, end: houseStatusDate};
                  vm.fcEvent.push(josoObject);

                });

                this.fcEvent = vm.fcEvent;
              }
            }
            else {
              //API返回失败编号 - 除了200之外
              console.log(returnData.desc);

            }
            this.show = false;
          }, function (response) {
            //请求失败
            this.show = false;
          }
        )
        .catch(function (response) {
          //当请求出现异常，打印出对应的错误信息
          console.log(response);
          this.show = false;
        });

//      var obj = {title: '关闭', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);
//      obj = {title: '2间', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);
//      obj = {title: '500', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);

    },
    events : {
      'changeMonth' (start, end, current) {
        console.log('changeMonth', start, end, current);
      },
      'eventClick' (day, jsEvent){
        dayClick(day);
      }
    }
  }
  //this.$dispatch('eventClick', day, dayClick);

  function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
      return "";
    }
    return decodeURI(result[1]);
  }

  function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }

  function dayClick(date) {
    debugger;
     console.log(date);
  }
</script>
