// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var app = getApp();
Page({
  data: {
    rows: {},
    nickName:""
  },
  onShareAppMessage: function () { },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数

   // console.log(e.objectId)
    var objectId = e.objectId;
    var that = this;
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    var nickName = "航帮帮";
    query.get(objectId, {
      success: function (resultDiary) {

        var User = Bmob.Object.extend("_User");
        var queryUser = new Bmob.Query(User);
        if (resultDiary.attributes.openid){
          queryUser.equalTo("openid", resultDiary.attributes.openid);
          queryUser.find({
            success: function (results) {
              console.log(results);
              nickName = results[0].attributes.nickName;
              that.setData({
                rows: resultDiary,
                nickName: nickName
              }) 
            },
            error: function (error) {
              console.log("查询失败: " + error.code + " " + error.message);
            }
          });
        }else{
          that.setData({
            rows: resultDiary,
            nickName: nickName
          }) 
        }
         
      },
      error: function (result, error) {
        console.log("查询失败");
      }
    });
 
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
    console.log(o)
    wx.previewImage({
      current: '',
      urls: [that.data.rows.get('imgurl')],
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  // copy:function(e){
  //   var that = this;
  //   console.log(that);
  //   wx.setClipboardData({
  //     data: that.data.rows.attributes.content,
  //     success:function(res){
  //       wx.showToast({
  //         title: '复制成功',
  //       })
  //     }
  //   });
  // }
})
