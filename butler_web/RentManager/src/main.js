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
import HouseCalendar from './Views/HouseCalendar'

//第三步：注册vue router路由，创建路由实例
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

//注册vuex,用于状态管理
import Vuex from 'vuex'

Vue.use(Vuex);
Vue.use(VueRouter);
var router=new VueRouter({hashbang: false, history: true});

//第五步：注册vue resource请求
Vue.use(VueResource);

//第六步：注册vue router路由map
router.map({
  '/rentmanager/': {name:'Help', component: Help},
  '/rentmanager/Help': {name:'Help', component: Help},
  '/rentmanager/houselist': {name:'HouseList', component: HouseList},
  //'rentmanager?forward=houselist': {name:'HouseList', component: HouseList},
  '/rentmanager/addplantform': {name:'AddPlantform', component: AddPlantform},
  '/rentmanager/housesettinglist': {name:'HouseSettingList', component: HouseSettingList},
  //'rentmanager?forward=housesettinglist': {name:'HouseSettingList', component: HouseSettingList},
  '/rentmanager/housesetting': {name:'HouseSetting', component: HouseSetting},
  '/rentmanager/housecalendar': {name: 'HouseCalendar', component: HouseCalendar}
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
    HouseSetting,
    HouseCalendar
  }
});

//注册vue-resource请求可以跨域访问
// Vue.http.headers.common['Access-Control-Allow-Origin'] = 'http://duanzugj.com:8080/';
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';




function getQueryStringByName(name){
  var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
  if(result == null || result.length < 1){
    return "";
  }
  return decodeURI(result[1]);
}

//创建一个对象来保存应用启动时的初始状态
const store = new Vuex.Store({
  state: {
    useOpenId:"wx001"//微信的初始openid
  },
  mutations: {
    setOpenId (state, value) {
      state.useOpenId = value;
    }
  }
})

window.store = store;

window.store.commit('setOpenId', getQueryStringByName("userOpenId"));




