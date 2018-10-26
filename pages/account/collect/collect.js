//index.js
//获取应用实例
var Bmob = require('../../../utils/bmob.js');
var Bmob1 = require('../../../utils/Bmob-1.6.4.min.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 15,
    diaryList: [],
    modifyDiarys: false,
    urlArr: [{ url: '' }]
  },
  onReady: function (e) { },
  onShareAppMessage: function () { },
  onLoad: function () {
    app = getApp();
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      common.showModal('请先获取头像和昵称', "提示");
    }

  },
  noneWindows: function () {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    getList(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function (e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  inputTyping: function (e) {
    //搜索数据
    getList(this, e.detail.value);
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  }
})

/*
 * 获取数据
 */
function getList(t, k) {
  if (app.globalData.userInfo) {
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    that = t;
    var DiaryCollect = Bmob.Object.extend("diary_collect");
    var query = new Bmob.Query(DiaryCollect);
    query.equalTo("openID", app.globalData.currentUser.openid);
    query.descending('createdAt');
    query.include("diaryID");
    // 查询所有数据
    query.limit(that.data.limit);
    var mainQuery = query
    mainQuery.find({
      success: function (results) {
        //console.log(results[0]);
        // 循环处理查询到的数据
        that.setData({
          diaryList: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  }
}


