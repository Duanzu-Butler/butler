<template>
  <div id="container" class="timeline-list">
    <timeline :color="color" v-for="item in houseData">
      <timeline-item v-for="houseNum in item.houseList.length+1">
        <div :class="[houseNum === 0 ? 'firstItem' : 'normalItem']">
          {{ houseNum ==0 ? item.platformName : item.houseList[houseNum-1].houseName}}
        </div>
        <div class="buttonArea">
          <button type="default" :class="[houseNum === 0 ? 'btnShowClass' : 'btnHideClass']"
                  @click="freshPlantformData(item.platformId)">更新
          </button>
          <button type="warn" :class="[houseNum === 0 ? 'btnShowClass' : 'btnHideClass']"
                  @click="deletePlantformData(item.platformId)">退出
          </button>
        </div>
      </timeline-item>
    </timeline>


    <div style="margin: 10px;">
      <button type="primary" @click="joinPlantform">加入新平台</button>
    </div>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>

    <alert :show.sync="alertshow" title="维护平台房源" button-text="关 闭">
      <p style="text-align:center;">{{alertText}}</p>
    </alert>
  </div>
</template>

<style>

  .timeline-list .firstItem {
    color: rgb(4, 190, 2);
    /*margin-left: 3rem;*/
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
  import alert from 'vux/dist/components/alert'

  export default{
    data(){
      return {
        houseData: [],
        selectedPlantformId: '',//选中指定的平台id
        userOpenId: 'wx001',
        apiUrl: '/butler-api/user/platform/getAll',
        apiUpdateUrl: '/butler-api/user/platform/get',
        apiDeleteUrl: '/butler-api/user/platform/delete',
        show: false,
        loadingText: '加载中...',
        alertshow: false,
        alertText : '',
        houseName: ''
      }
    },
    components: {
      Timeline,
      TimelineItem,
      button,
      loading,
      alert
    },
    methods: {
      freshPlantformData: function (plantformId) {
        this.selectedPlantformId = plantformId;
        this.show = true;
        var updatePostUrl = this.apiUpdateUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId;
        this.$http.post(updatePostUrl)
          .then(function (response) {
              var returnData = response.data;
              if (returnData.status == 200) {
                //API返回成功编号200
                //更新指定平台的房源列表和平台名称
                this.houseData.every(function (entry, entryIndex) {
                  if (entry.platformId == returnData.result.platformId) {
                    entry.plantformName = returnData.result.plantformName;
                    entry.houseList = returnData.result.houseList;

                    //return current each scope
                    return false;
                  }
                });

                this.alertText = '平台房源更新成功！';
                this.alertshow = true;
              }
              else {
                //API返回失败编号 - 除了200之外
                console.log(returnData.desc);
                this.alertText = returnData.desc;
                this.alertshow = true;
              }
              this.show = false;
            }, function (response) {
              //请求失败
              this.show = false;
              this.alertText = '服务器请求失败，请稍后再试！';
              this.alertshow = true;
            }
          )
          .catch(function (response) {
            //当请求出现异常，打印出对应的错误信息
            console.log(response);
            this.show = false;
            this.alertText =  '服务器请求失败，请稍后再试！';;
            this.alertshow = true;
          });

      },
      deletePlantformData: function (plantformId) {
        var vm = this;
        this.selectedPlantformId = plantformId;
        this.show = true;
        var deletePostUrl = this.apiDeleteUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId;
        this.$http.post(deletePostUrl)
          .then(function (response) {
            var returnData = response.data;
            if (returnData.status == 200) {
              //API返回成功编号200, 从页面数据中删除指定data
              this.houseData.every(function (entry, entryIndex) {
                if (entry.platformId == vm.selectedPlantformId) {
                  debugger;
                  //delete vm.houseData[entryIndex];
                  vm.houseData.splice(entryIndex, 1);
                  //return current each scope
                  return false;
                }
              });
              this.houseData = vm.houseData;
              this.alertText = '退出平台成功！';
              this.alertshow = true;
            }
            else {
              //API返回失败编号 - 除了200之外
              console.log(returnData.desc);
              this.alertText = returnData.desc;
              this.alertshow = true;
            }
            this.show = false;
          }, function (response) {
            //请求失败
            this.show = false;
            this.alertText =  '服务器请求失败，请稍后再试！';;
            this.alertshow = true;
          })
          .catch(function (response) {
            //当请求出现异常，打印出对应的错误信息
            console.log(response);
            this.show = false;
            this.alertText =  '服务器请求失败，请稍后再试！';;
            this.alertshow = true;
          });
      },
      joinPlantform: function () {
        window.router.go({
          name: 'AddPlantform'
        });
      }
    },
    ready: function () {
      //从请求的url中获取微信userOpenId - after deploy to weixin, will use following code
      var gettedOpenId = getQueryStringByName("userOpenId");
      if(gettedOpenId != '')
      {
        this.userOpenId = gettedOpenId;
      }
      //get useropenid from store state
//      var gettedOpenId = window.store.state.useOpenId;
//      if(gettedOpenId != '')
//      {
//        this.userOpenId = gettedOpenId;
//      }

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

  function getQueryStringByName(name){
    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
    if(result == null || result.length < 1){
      return "";
    }
    return decodeURI(result[1]);
  }
</script>
