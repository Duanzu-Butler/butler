<template>
  <div id='container'>
    <div id='firstLine'>
      短租管家现支持以下短租平台：
    </div>

    <div id='plantformList'>
      <ul>
        <li v-for="item in plantFormData">
          <strong>{{ item.platformName }}</strong> : {{item.platformDesc}}
        </li>
      </ul>
    </div>

    <div id='lastLine'>
      更多平台支持，持续更新中。。。
    </div>

    <loading :show="show" :text="loadingText" class="loadingClass"></loading>
  </div>
</template>
<style>
  #container{
    height: 100%;
    margin-top: 30px;
  }

  #firstLine {
    color: #2c3e50;
    font-family: Source Sans Pro, Helvetica, sans-serif;
    text-align: left;
    margin-left: 20px;
  }

  #plantformList {
    margin-left: 40px;
    margin-top: 5px;
    font-size: 15px;
  }

  #lastLine {
    margin-left: 20px;
    margin-top: 40px;
  }

  .weui_toast{
    height:100%;
    width: 100%;
    top: 0;
  }
</style>
<script>
  import loading from 'vux/dist/components/loading'

  export default{
    data(){
      return {
        plantFormData: [],
        apiUrl: '/butler-api/platform/get',
        show: false,
        loadingText : '加载中...'
      }
    },
    methods: {
      postData: function () {

      }
    },
    components: {
      loading
    },
    ready: function () {
      //当页面加载完成之后，进行的操作
      //vue resource http请求（get请求）
      this.show = true;
      this.$http.get(this.apiUrl)
      //请求成功，处理get请求数据
        .then(function (response) {
          var returnData = response.data;
          if (returnData.status == 200) {
            //API返回成功编号200
            this.$set('plantFormData', returnData.result);
            console.log(returnData.result);
          }
          else {
            //API返回失败编号 - 除了200之外
            console.log(returnData.desc);
          }
          this.show = false;
        }, function (response) {
          //请求失败
          this.show = false;
        })
        .catch(function (response) {
          //当请求出现异常，打印出对应的错误信息
          console.log(response);
          this.show = false;
        });
    }
  }
</script>
