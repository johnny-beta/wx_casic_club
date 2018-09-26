var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
var grids = [{
    "name": "航天置换",
    "ico": "zhihuan.png",
    "url": "../interface/type/type"
  },
  {
    "name": "航天团购",
    "ico": "tuangou.png",
    "url": "../interface/type/type"
  },
  {
    "name": "航天宝贝",
    "ico": "baobei.png",
   
    "click": "autuLogin"
  },
  {
    "name": "房屋租售",
    "ico": "zushou.png",
    "url": "../interface/type/type"
  },
  {
    "name": "红娘牵线",
    "ico": "qianxian.png",
    "url": "../interface/type/type"
  },
  {
    "name": "登录",
    "ico": "login.png",
    "url": "../interface/type/type"
  },
  {
    "name": "注册",
    "ico": "reg.png",
    "url": "../interface/type/type"
  },
  {
    "name": "群聊",
    "ico": "liao.png",
    "url": "../interface/chatroom/chatroom"
  }

];
Page({
  data: {
    userInfo: {},
    grids: grids,
    background: ['http://bmob-cdn-21631.b0.upaiyun.com/2018/09/25/1ee585d74019bc7780e315a40dfa212a.png', ]
  },
  onLoad: function() {
    var that = this

  },
  getUserInfo: function(e) {
    var userinfo = e.detail.userInfo;
    // 这里会把头像信息写入到数据库
    var user = new Bmob.User() //实例化对象
    user.getUserInfo(userinfo)
  },
  autuLogin: function() {
    common.showModal("测试按钮")
  }

})