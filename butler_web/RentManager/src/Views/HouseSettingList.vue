<template>
  <div id="container" class="timeline-list">
    <timeline :color="color" v-for="item in houseData">
      <timeline-item v-for="houseNum in item.houseList.length+1">
        <div :class="[houseNum === 0 ? 'firstItem' : 'normalItem']">
          {{ houseNum ==0 ? item.platformName : item.houseList[houseNum-1].houseName}}
        </div>
        <div class="buttonArea">
          <button type="default" :class="[houseNum === 0 ? 'btnHideClass' : 'btnShowClass']"
                  @click="setHourseStatus(item.platformId,item.houseList[houseNum-1].houseId, item.houseList[houseNum-1].houseName)">设置房态
          </button>
        </div>
      </timeline-item>
    </timeline>


    <loading :show="show" :text="loadingText" class="loadingClass"></loading>
  </div>
</template>

<style>

  .timeline-list .firstItem {
    color: rgb(4, 190, 2);
  }

  .timeline-list .normalItem {
    display: inline;
  }

  .vux-timeline-item-content {
    margin-left: 10px;
    /*display: inline;*/
  }

  .timeline-list .buttonArea {
    /*display: inline;*/
    text-align: right;
    display: inline;
    float:right;
  }


  .timeline-list .btnShowClass {
    width: 80px;
    font-size: 10px;
    margin-top: -10px;
    display: inline;
  }

  .timeline-list .btnHideClass {
    display: none;
  }

  .weui_toast {
    height: 100%;
    width: 100%;
    top: 0;
  }
</style>

<script>
  import Timeline from 'vux/dist/components/timeline'
  import TimelineItem from 'vux/dist/components/timeline-item'
  import button from 'vux/dist/components/x-button'
  import loading from 'vux/dist/components/loading'

  export default{
    data(){
      return {
        houseData: [],
        selectedHouseId: '',//选中指定的平台id
        selectedHouseName: '',
        userOpenId: 'wx001',
        apiUrl: '/butler-api/user/platform/getAll',
        show: false,
        loadingText: '加载中...'
      }
    },
    components: {
      Timeline,
      TimelineItem,
      button,
      loading
    },
    methods: {
      setHourseStatus: function (plantformId, houseId, houseName) {
        window.router.go({
          name: 'HouseSetting',
          query: {
              plantformId: plantformId,
              houseId: houseId,
              houseName: houseName
          }

        });
      }
    },
    ready: function () {
      this.show = true;
      var getAllUrl = this.apiUrl + '?userOpenId=' + this.userOpenId;
      this.$http.get(getAllUrl)
        .then(function (response) {
            var returnData = response.data;
            if (returnData.status == 200) {
              //API返回成功编号200
              //更新指定平台的房源列表和平台名称
              this.$set('houseData', returnData.result);
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
    }
  }
</script>


