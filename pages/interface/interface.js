var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
var grids = [{
    "name": "航天置换",
    "ico": "zhihuan.png",
    "url": "../interface/type/type?typeNumber=1"
  },
  {
    "name": "航天团购",
    "ico": "tuangou.png",
    "url": "../interface/type/type?typeNumber=2"
  },
  {
    "name": "航天宝贝",
    "ico": "baobei.png",
    "url": "../interface/type/type?typeNumber=3",
    "click": "autuLogin"
  },
  {
    "name": "房屋租售",
    "ico": "zushou.png",
    "url": "../interface/type/type?typeNumber=4"
  },
  {
    "name": "红娘牵线",
    "ico": "qianxian.png",
    "url": "../interface/type/type?typeNumber=5"
  },
  {
    "name": "登录",
    "ico": "login.png",
    "click": "autuLogin"
  },
  {
    "name": "注册",
    "ico": "reg.png",
    "click": "autuLogin"
  },
  {
    "name": "群聊",
    "ico": "liao.png",
    "url": "../interface/type/type?typeNumber=6"
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
    this.getBG();
  },

  getBG: function() {
    var that = this
    var Diary = Bmob.Object.extend("borad_bg");
    var query = new Bmob.Query(Diary);
    query.find({
      success: function (results) {   
        var backgrounds = []  
        
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //console.log(object.id + ' - ' + object.get('title'));
          backgrounds.push(object.get('imgurl'))
        }
        that.setData({ background: backgrounds })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  onShareAppMessage: function () { },
  getUserInfo: function(e) {
    var userinfo = e.detail.userInfo;
    // 这里会把头像信息写入到数据库
    var user = new Bmob.User() //实例化对象
    user.getUserInfo(userinfo)
  },
  autuLogin: function() {
    common.showModal("暂未开放！")
  }

})