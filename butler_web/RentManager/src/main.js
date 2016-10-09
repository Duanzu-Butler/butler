// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'


//第一步：添加所有自定义组件
import Help from './Views/Help'
import HouseList from './Views/HouseList'
import AddPlantform from './Views/AddPlantform'
import HouseSettingList from './Views/HouseSettingList'
import HouseSetting from './Views/HouseSetting'

//第三步：注册vue router路由，创建路由实例
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
var router=new VueRouter({hashbang: false, history: true});

//第五步：注册vue resource请求
Vue.use(VueResource);

//第六步：注册vue router路由map
router.map({
  '/': {name:'Help', component: Help},
  '/Help': {name:'Help', component: Help},
  '/houselist': {name:'HouseList', component: HouseList},
  '/addplantform': {name:'AddPlantform', component: AddPlantform},
  '/housesettinglist': {name:'HouseSettingList', component: HouseSettingList},
  '/housesetting': {name:'HouseSetting', component: HouseSetting}
});

//第七步：设置默认情况下打开的页面
router.redirect({
  'name':'Help'
});

//第八步：暴露路由接口调试，用于路由跳转等全局
window.router = router;

//开启路由
router.start(App, '#app');

/* eslint-disable no-new */
new Vue({
  el: 'body',
  //第二步：注册组件到Vue
  components: {
    App,
    Help,
    HouseList,
    AddPlantform,
    HouseSettingList,
    HouseSetting
  }
})

//注册vue-resource请求可以跨域访问
// Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://duanzugj.com:8080/';
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';
