// pages/interface/facedetect/faceranking/faceranking.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
const Bmob1 = require('../../../../utils/Bmob-1.6.4.min.js')
import util from '../../../../utils/util.js';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // currentTab: 0,//三个文件这里依次为0，1，2，其他地方一样,
    navbar : [
      {
        name: '男神榜',
        url: "/pages/interface/facedetect/faceranking/faceranking?currentTab=0"
      },
      {
        name: "女神榜",
        url: "/pages/interface/facedetect/faceranking/faceranking?currentTab=1"
      },
      {
        name: "我的颜值",
        url: "/pages/interface/facedetect/facedetect"
      }
    ],
    beautyList:{},
  },

  onLoad: function (e) {

    var that = this;
    if (e.currentTab){
      that.setData({
        currentTab: e.currentTab
      });
    }
    var BeautyRankingList = Bmob.Object.extend("beauty_ranking_list");
    var beautyRankingList = new Bmob.Query(BeautyRankingList);
    // 查询所有数据
    beautyRankingList.include("userDetail");
    if (that.data.currentTab == 0)
      beautyRankingList.equalTo("gender", "Male");
    else if (that.data.currentTab == 1)
      beautyRankingList.equalTo("gender", "Female");
    beautyRankingList.descending("score");
    beautyRankingList.find({
      
      success: function (beautyRankingListResults) {
        //console.log(beautyRankingListResults);
        that.setData({
          beautyList: beautyRankingListResults
        });

      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
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

