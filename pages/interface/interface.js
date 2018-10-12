var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp()
var grids = [  
  {
    "name": "航天锦鲤",
    "ico": "jinli.png",
    "url": "../interface/type/type?typeNumber=10&typeName=航天锦鲤"
  },
  // {
  //   "name": "国庆-意见征集",
  //   "ico": "guoqing2.png",
  //   "url": "../interface/type/type?typeNumber=11&typeName=意见征集"
  // },
  {
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
    "url": "../interface/type/type?typeNumber=6&typeName=拼车出行",   
    "click": "autuLogin1"
  },
  
  {
    "name": "群聊",
    "ico": "liao.png",
    //"url": "../interface/chatroom/chatroom",
    "click": "autuLogin"
  }

];
Page({
  data: {
    userInfo: {},
    grids: grids,
    background: [],
    backgroundDisplay: [],
    newMessageFlag: 0
  },
  onLoad: function() {
    wx.setNavigationBarTitle({ title: '航帮帮V' + app.globalData.version + ' -航天人的信息沟通看板' })
    var that = this;
    this.getBG();
     
    //initLeaveMessageDataSheet();
    //initLeaveMessage();
  },
  onShow: function () {
    var currentUser = app.globalData.currentUser;
    var that = this;
    //checkNewMessage(currentUser);
    //console.log(currentUser.openid);
    //weChatPayTest(that,currentUser.openid)
  },
  getBG: function() {
    var that = this
    var Diary = Bmob.Object.extend("borad_bg");
    var query = new Bmob.Query(Diary);
    query.descending('createdAt');
    query.find({
      success: function (results) {   
        var backgrounds = [];
        var backgroundDisplay = [];
        //console.log(results);
        
        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //console.log(object.id + ' - ' + object.get('title'));
          backgroundDisplay.push(object.get('imgurl'));
          if (object.attributes.boradBgToActivity){
            backgrounds.push({ imgurl: object.get('imgurl'), activityID: object.attributes.boradBgToActivity.id.replace(/(^\s*)|(\s*$)/g, "")});
          }else{
            backgrounds.push({ imgurl: object.get('imgurl'), activityID: 0});
          }
        }
        console.log(backgrounds);
        that.setData({ background: backgrounds, backgroundDisplay: backgroundDisplay })
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
    console.log(o);
    var targetSrc = o.target.dataset.src.imgurl;
    var targetID = o.target.dataset.src.activityID;
    console.log(targetID);
    if (targetID != 0){
          wx.navigateTo({
            url: "/pages/interface/article/detail/index?objectId="+targetID,
          });   
    }else{
        wx.previewImage({
          current: targetSrc,
          urls: this.data.backgroundDisplay,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
    }    
  }
})
function checkNewMessage(currentUser) {
  //try {
    var newMessageIDArr = new Array();
    var currentUserID = currentUser.openid;
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    query.equalTo("openid", currentUserID);
    // 查询所有数据
    query.find({
      success: function (results) {
        //console.log(results.length);
        for (var i = 0; i < results.length; i++) {
          var localLeaveMessageCount = wx.getStorageSync(results[i].id);
          if (localLeaveMessageCount != results[i].attributes.leaveMessageCount) {
            newMessageIDArr.push(results[i].id);
            
          }
          //console.log(localLeaveMessageCount);
          if (localLeaveMessageCount == null) {
            try {
              // 同步接口立即写入
              wx.setStorageSync(results[i].id, results[i].attributes.leaveMessageCount);
              console.log("第0次写入成功");
            } catch (e) {
              console.log("第0次写入失败");
            }
          }
        }
        if (newMessageIDArr.length > 0) {
          wx.showTabBarRedDot({
            index: 3
          })
        } else {
          wx.hideTabBarRedDot({
            index: 3
          })
        }
        try {
          // 同步接口立即写入
          wx.setStorageSync("newMessageIDArr", newMessageIDArr);
          console.log("第一次写入成功");
        } catch (e) {
          console.log("第一次写入失败");
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  // } catch (e) {
  //   console.log("获取留言信息失败，可能因为没有获取用户信息");
  // }
}
function weChatPayTest(that,openId){
  var that = this;
  console.log(openId);
  Bmob.Pay.wechatPay(0.01, '哇哈哈1瓶', '哇哈哈饮料，杭州生产', openId).then(function (resp) {
    console.log(resp);

    // that.setData({
    //   loading: true,
    //   dataInfo: resp
    // })

    //服务端返回成功
    var timeStamp = resp.timestamp,
      nonceStr = resp.noncestr,
      packages = resp.package,
      orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
      sign = resp.sign;

    //打印订单号
    console.log(orderId);

    //发起支付
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packages,
      'signType': 'MD5',
      'paySign': sign,
      'success': function (res) {
        //付款成功,这里可以写你的业务代码
        console.log(res);
      },
      'fail': function (res) {
        //付款失败
        console.log('付款失败');
        console.log(res);
      }
    })

  }, function (err) {
    console.log('服务端返回失败');
    console.log(err);
  });
}