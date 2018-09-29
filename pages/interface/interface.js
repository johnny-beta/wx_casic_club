var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
var grids = [  
  {
    "name": "国庆-晒照专区",
    "ico": "guoqing.png",
    "url": "../interface/type/type?typeNumber=10&typeName=晒照专区"
  },
  {
    "name": "国庆-意见征集",
    "ico": "guoqing2.png",
    "url": "../interface/type/type?typeNumber=11&typeName=意见征集"
  },{
    "name": "航天置换",
    "ico": "zhihuan.png",
    "url": "../interface/type/type?typeNumber=1&typeName=航天置换"
  },
  {
    "name": "航天漫步",
    "ico": "login.png",
    "url": "../interface/type/type?typeNumber=2&typeName=航天漫步"
  },
  {
    "name": "航天宝贝",
    "ico": "baobei.png",
    "url": "../interface/type/type?typeNumber=3&typeName=航天宝贝"
  },
  {
    "name": "房屋租售",
    "ico": "zushou.png",
    "url": "../interface/type/type?typeNumber=4&typeName=房屋出租"
  },
  {
    "name": "鹊桥征友",
    "ico": "qianxian.png",
    "url": "../interface/type/type?typeNumber=5&typeName=鹊桥征友"
  },
  {
    "name": "拼车出行",
    "ico": "car.png",
    "url": "../interface/type/type?typeNumber=6&typeName=拼车出行" ,   
    "click": "autuLogin1"
  },
  
  {
    "name": "群聊",
    "ico": "liao.png",
    "click": "autuLogin"
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
    query.descending('createdAt');
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
  },
  autuLogin1: function () {
    common.showModal("请详细阅读 我的-免责条款里的内容！")
  },
  preImg: function(o) {
    console.log(o)
    wx.previewImage({
      current: '',
      urls: this.data.background,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  }
})