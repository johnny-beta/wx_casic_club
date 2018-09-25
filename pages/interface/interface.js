var Bmob = require('../../utils/bmob.js');
var common=require('../../utils/common.js');
var app = getApp()
var grids = [
  { "name": "航天置换", "ico":"zhihuan.png","url":"../sendSms/sendSms"},
   {"name":"航天团购","ico":"tuangou.png","url":"../picasa/picasa"},
   {"name":"航天宝贝","ico":"baobei.png","url":"../sendSms/sendSms","click":"autuLogin"},
   {"name":"房屋租售","ico":"zushou.png","url":"../getOpenId/getOpenId"},
   {"name":"红娘牵线","ico":"qianxian.png","url":"../pay/pay"},

   {"name":"登录","ico":"login.png","url":"../login/login"},
   {"name":"注册","ico":"reg.png","url":"../register/register"},
   
   { "name": "群聊", "ico": "liao.png", "url": "../interface/chatroom/chatroom" },
   
  
];
Page({    
    data: {        
        userInfo: {},
        grids: grids,
      background: ['http://bmob-cdn-21631.b0.upaiyun.com/2018/09/21/37e711a040c4430c8082052eae600c73.jpg', 'http://bmob-cdn-21631.b0.upaiyun.com/2018/09/21/503b2cf640663e0a80a76360ba799164.jpg', 'http://bmob-cdn-21631.b0.upaiyun.com/2018/09/21/d5d8ada140fd495680c56af776cfb621.jpg'],
    },
    onLoad:function(){
        var that = this 
  
    },
    getUserInfo:function(e){
      var userinfo = e.detail.userInfo;
      // 这里会把头像信息写入到数据库
      var user = new Bmob.User() //实例化对象
      user.getUserInfo(userinfo)
    },
    autuLogin:function(){
        common.showModal("App.js实现小程序访问则将数据写入系统User表，具体代码请查看App.js。")
    }

})