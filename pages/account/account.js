var Bmob = require('../../utils/bmob.js');
var Bmob1 = require('../../utils/Bmob-1.6.4.min.js');
var common = require('../../utils/common.js');
var app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tipStatus: false
  },
  onLoad: function() {

    wx.setNavigationBarTitle({ title: '航帮帮V' + app.globalData.version + ' -航天人的信息沟通看板' })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    

  },
  onShow: function () {
    var that = this;
    checkNewMessage(that);
  },
  about: function(e) {
    common.showModal('航帮帮V'+app.globalData.version+'是海淀永定路地区生活类信息沟通的看板，您有好的建议可以通过本页面的“反馈建议”功能或座机87811联系，感谢您的使用！');
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    Bmob1.User.upInfo(e.detail.userInfo)
  }
})
function checkNewMessage(that){
  //留言提醒
  try {
    // 同步接口立即返回值
    var newMessageIDArr = wx.getStorageSync("newMessageIDArr");
    //console.log(newMessageIDArr);
    if (newMessageIDArr.length > 0) {
      that.setData({
        newMessageFlag: true
      })
      wx.showTabBarRedDot({
        index: 3
      })
    } else {
      that.setData({
        newMessageFlag: false
      })
      wx.hideTabBarRedDot({
        index: 3
      })
    }
    console.log("第二次读取成功");
  } catch (e) {
    console.log('第二次读取失败')
  }
}