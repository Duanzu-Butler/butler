<template>
  <div>
    <full-calendar :events="fcEvent" lang="zh"></full-calendar>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>

    <alert :show.sync="alertshow" title="房态日历" button-text="关 闭">
      <p style="text-align:center;">{{alertText}}</p>
    </alert>
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
  import alert from 'vux/dist/components/alert'

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
        apiReturnData: [],
        alertshow: false,
        alertText: '',
      }
    },
    components: {
      fullCalendar,
      loading,
      alert
    },
    ready: function () {
      this.houseId = getQueryStringByName("houseId");
      this.houseName = getQueryStringByName("houseName");
      this.selectedPlantformId = getQueryStringByName("plantformId");

      //get useropenid from store state
      var gettedOpenId = window.store.state.useOpenId;
      if (gettedOpenId != '') {
        this.userOpenId = gettedOpenId;
      }

      this.show = true;
      var vm = this;

      //1.获取房源动态列表
      //获取当天日期YYYY-MM-DD
      //this.searchMonth = getNowFormatDate();
      this.searchMonth = getFormatDate(new Date());
      queryDataByMonth(this);

//      var getHouseStatusUrl = this.getHouseStatusApiUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId
//        + '&houseId=' + this.houseId + '&searchMonth=' + this.searchMonth;
//      this.$http.post(getHouseStatusUrl)
//        .then(function (response) {
//            var returnData = response.data;
//            if (returnData.status == 200) {
//              //API返回成功编号200
//              //更新指定平台的房源列表和平台名称
//              this.$set('apiReturnData', returnData.result);
//
//              //debugger;
//              if (this.apiReturnData != null && this.apiReturnData.length > 0) {
//                //先清空房源日历列表
//                vm.fcEvent = [];
//
//                //2.遍历房源动态列表添加到日历控件中
//                this.apiReturnData.forEach(function (entry) {
//                  var houseStatusDate = entry.date;
//                  var houseNum = entry.houseNum;
//                  var housePrice = entry.housePrice;
//                  var houseStatus = entry.houseStatus;
//                  var josoObject = {};
//                  //当房源状态为0的时候，代表当前房屋是关闭状态，需要在日历控件中展示出来
//                  if (houseStatus == '0') {
//                    josoObject = {title: '关闭', start: houseStatusDate, end: houseStatusDate};
//                    vm.fcEvent.push(josoObject);
//                  }
//                  josoObject = {title: houseNum.toString() + '间', start: houseStatusDate, end: houseStatusDate};
//                  vm.fcEvent.push(josoObject);
//                  josoObject = {title: housePrice.toString(), start: houseStatusDate, end: houseStatusDate};
//                  vm.fcEvent.push(josoObject);
//
//                });
//
//                this.fcEvent = vm.fcEvent;
//              }
//            }
//            else {
//              //API返回失败编号 - 除了200之外
//              this.alertText = returnData.desc;
//              this.alertshow = true;
//              console.log(returnData.desc);
//
//            }
//            this.show = false;
//          }, function (response) {
//            //请求失败
//            this.show = false;
//            this.alertText = response.desc;
//            this.alertshow = true;
//          }
//        )
//        .catch(function (response) {
//          //当请求出现异常，打印出对应的错误信息
//          console.log(response);
//          this.show = false;
//          this.alertText = response.desc;
//          this.alertshow = true;
//        });

//      var obj = {title: '关闭', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);
//      obj = {title: '2间', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);
//      obj = {title: '500', start: '2016-10-2', end: '2016-10-2'};
//      demoEvents.push(obj);
    },
    events: {
      'changeMonth' (start, end, current) {
        this.searchMonth = current;
        debugger;
        if (this.houseId != '') // 第一次触发的时候，页面还没有ready, 对应的querystring信息还没拿到
          queryDataByMonth(this);
        //console.log('changeMonth', start, end, current);
      },
      'dayClick' (day, jsEvent){
        selectDate(getFormatDate(day), this);
        //console.log('dayClick', day, jsEvent);
      },
      'eventClick' (event, jsEvent, pos){
        selectDate(event.start, this);
        //console.log('eventClick', event, jsEvent);
      }
    }
  }

  function queryDataByMonth(vm) {
    debugger;
    var getHouseStatusUrl = vm.getHouseStatusApiUrl + '?userOpenId=' + vm.userOpenId + '&platformId=' + vm.selectedPlantformId
      + '&houseId=' + vm.houseId + '&searchMonth=' + vm.searchMonth;
    vm.$http.post(getHouseStatusUrl)
      .then(function (response) {
          var returnData = response.data;
          if (returnData.status == 200) {
            //API返回成功编号200
            //更新指定平台的房源列表和平台名称
            vm.$set('apiReturnData', returnData.result);

            //debugger;
            if (vm.apiReturnData != null && vm.apiReturnData.length > 0) {
              //先清空房源日历列表
              vm.fcEvent = [];

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

              //this.fcEvent = vm.fcEvent;
            }
          }
          else {
            //API返回失败编号 - 除了200之外
            vm.alertText = returnData.desc;
            vm.alertshow = true;
            console.log(returnData.desc);

          }
          vm.show = false;
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
        vm.show = false;
        vm.alertText = response.desc;
        vm.alertshow = true;
      });
  }

  function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
      return "";
    }
    return decodeURI(result[1]);
  }

  function getFormatDate(date) {
    //var date = new Date();
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

  function selectDate(date, vm) {
    var result = vm.apiReturnData.filter(function (obj) {
      return obj.date == date;
    });

    debugger;
    var queryDate = date;
    var roomNum = '0';
    var price = '0';
    var status = '';
    if (result != null && result.length > 0) {
      var fcevent = result[0];
      roomNum = fcevent.houseNum;
      price = fcevent.housePrice;
      status = fcevent.houseStatus;
    }
    else {
      vm.alertText = "请设置当月可用日期对应房态";
      vm.alertshow = true;
      return;
    }

    window.router.go({
      name: 'HouseSetting',
      query: {
        plantformId: vm.selectedPlantformId,
        houseId: vm.houseId,
        houseName: vm.houseName,
        queryDate: queryDate,
        rommNum: roomNum,
        price: price,
        status: status
      }
    });
  }
</script>
