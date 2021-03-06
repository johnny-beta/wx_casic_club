// pages/index/detail/index.js
var Bmob = require('../../../../utils/bmob.js');
const WxParse = require('../../../../utils/wxParse/wxParse.js');

Page({
  data: {
    rows: {},
    imgArr:[]
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数

    //console.log(e.objectId)
    var objectId = e.objectId;
    var that = this;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }

    var Diary = Bmob.Object.extend("activity");
    var query = new Bmob.Query(Diary);

    query.get(objectId, {
      success: function (result) {
        WxParse.wxParse('content', 'html', result.get("content"), that);
        that.setData({
          rows: result,
          imgArr:[result.cover]
        })
        // The object was retrieved successfully.        
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
  },
  returnHome: function () {
    wx.switchTab({
      url: '/pages/interface/interface',
    })
  },
  bindClickImg: function (e) {
    wx.previewImage({
    //  current: imageArr[selecIndex],  // 当前显示图片的http链接，注意这里不能放本地图片
    //  urls: imageArr,                 // 需要预览的图片http链接列表，注意这里不能放本地图片
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },  
  preImg: function (o) {
    var that = this
    wx.previewImage({
      current: '',
      urls: [that.data.rows.get('cover')]
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})