// pages/interface/facedetect/faceranking/faceranking.js
import util from '../../../../utils/util.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,//三个文件这里依次为0，1，2，其他地方一样,
    navbar : [
      {
        name: '男神榜',
        url: "/pages/interface/facedetect/facedetect"
      },
      {
        name: "女神榜",
        url: "/pages/snatch/snatch"
      },
      {
        name: "我的颜值",
        url: "/pages/interface/facedetect/facedetect"
      }
    ]
  },


  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.getData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

