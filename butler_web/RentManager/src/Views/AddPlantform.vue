<template>
  <div id="container">

    <div id='divDropDown'>
      <group title="选择短租平台">
        <selector placeholder="请选择短租平台" :options="plantformList" :value.sync="selectedPlantformId"></selector>
      </group>
      <!--<popuppicker title="短租平台" :data="plantformList" :value.sync="selectedPlantform"></popuppicker>-->
    </div>

    <div id='divUserInfo'>
      <group title="输入对应平台账号信息">
        <xinput title="用户名：" placeholder="请输入平台账号" type="text" :value.sync="userAccount"></xinput>
        <xinput title="密 码：" placeholder="请输入平台密码" type="password" :value.sync="userPassword"></xinput>
      </group>
    </div>

    <div style="margin: 10px;">
      <button type="primary" style="margin-top: 5rem;" @click="testConnection">连接测试</button>
      <button type="primary" @click="joinPlantform">加入新平台</button>
    </div>


    <alert :show.sync="alertshow" title="加入新平台" button-text="关 闭">
      <p style="text-align:center;">{{alertText}}</p>
    </alert>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>
  </div>
</template>
<style>
</style>
<script>
  import loading from 'vux/dist/components/loading'
  import button from 'vux/dist/components/x-button'
  import selector from 'vux/dist/components/selector'
  import xinput from 'vux/dist/components/x-input'
  import popuppicker from 'vux/dist/components/popup-picker'
  import group from 'vux/dist/components/group'
  import alert from 'vux/dist/components/alert'

  export default{
    data(){
      return {
//        plantformList: [{key: 'my', value: '蚂蚁短租'}, {key: 'xz', value: '小猪短租'}, {key: 'tj', value: '途家'}],
        plantformList: [],
        userAccount: '',
        userPassword: '',
        selectedPlantformId: '',
        show: false,
        alertshow: false,
        alertText : '',
        loadingText: '加载中...',
        userOpenId: 'wx001',
        apiGetPlatformUrl: '/butler-api/platform/get',
        apiTestUrl: '/butler-api/user/platform/test',
        apiJoinUrl: '/butler-api/user/platform/create'
      }
    },
    components: {
      loading,
      button,
      selector,
      xinput,
      popuppicker,
      group,
      alert
    },
    methods: {
      testConnection: function() {
        this.show = true;
        var testPostUrl = this.apiTestUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId
          + '&platformAccount=' + this.userAccount + '&platformPassword=' + this.userPassword;
        debugger;
        this.$http.post(testPostUrl)
          .then(function (response) {
              var returnData = response.data;
              if (returnData.status == 200) {
                  this.alertText = '平台测试成功！';
                  this.alertshow = true;
              }
              else {
                //API返回失败编号 - 除了200之外
                this.alertText = '平台测试失败，请检查用户名及密码是否正确！';
                this.alertshow = true;
              }
              this.show = false;
            }, function (response) {
              //请求失败
            debugger;
              this.show = false;
            this.alertText = response.desc;
            this.alertshow = true;
            }
          )
          .catch(function (response) {
            //当请求出现异常，打印出对应的错误信息
            console.log(response);
            this.show = false;
          });

      },
      joinPlantform: function() {
        this.show = true;
        var joinPostUrl = this.apiJoinUrl + '?userOpenId=' + this.userOpenId + '&platformId=' + this.selectedPlantformId
          + '&platformAccount=' + this.userAccount + '&platformPassword=' + this.userPassword;
        this.$http.post(joinPostUrl)
          .then(function (response) {
              var returnData = response.data;
              if (returnData.status == 200) {
                window.router.go({
                  name: 'HouseList'
                });
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

            this.alertText = response.data.desc;
            this.alertshow = true;
            }
          )
          .catch(function (response) {
            //当请求出现异常，打印出对应的错误信息
            console.log(response);
            this.show = false;
          });

      }
    },
    ready: function () {
      //get useropenid from store state
      debugger;
      var gettedOpenId = window.store.state.useOpenId;
      if(gettedOpenId != '')
      {
        this.userOpenId = gettedOpenId;
      }

      this.show = true;
      var tpPlantformList = this.plantformList;
      this.$http.get(this.apiGetPlatformUrl)
        .then(function (response) {
          debugger;
            var returnData = response.data;
            if (returnData.status == 200) {
              //API返回成功编号200
              //更新指定平台的房源列表和平台名称
              returnData.result.forEach(function (entry) {
                var keyvalueData = new Object();
                keyvalueData.key = entry.id.toString();
                keyvalueData.value = entry.platformName;
                tpPlantformList.push(keyvalueData);
              });
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
      this.plantformList = tpPlantformList;
    }
  }
</script>
