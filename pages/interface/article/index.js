// pages/interface/article/index.js
const Bmob = require('../../../utils/bmob.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    results:[],
    currentUser: app.globalData.currentUser
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Diary = Bmob.Object.extend("activity");
      var query = new Bmob.Query(Diary);
      // query.equalTo("title", "bmob");
      // query.containedIn("title", ["Bmob", "hello", "sure"]);
      // query.ascending(列名称);
      // 查询当前数据数据
      // var ks = [{ "createdAt": { "$gte": { "__type": "Date", "iso": "2014-07-15 00:00:00" } } },
      // { "createdAt": { "$lte": { "__type": "Date", "iso": "2014-07-15 23:59:59" } } }];
      // query.equalTo("$and", ks);
      query.find({
        success: function(results) {
          
          that.setData({
            results: results
          });
        },
        error: function(error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
      
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onShareAppMessage: function () { },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})