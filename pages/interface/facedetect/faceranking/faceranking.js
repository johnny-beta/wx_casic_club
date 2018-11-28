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
    photoUrls:[]
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
  // onReachBottom: function () {
  //   this.getData()
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  previewImage: function (e) {
    var that = this;
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    that.data.currentUser = app.globalData.currentUser
    var current = e.target.dataset.src;
    var photoUrls = [];
    photoUrls.push(current);
    //console.log(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: photoUrls, // 需要预览的图片http链接列表
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    
    //weChatPayTest(that,e.target.dataset.src);
    
  }
})
function weChatPayTest(that,picSrc) {
  // console.log(openId);
  // console.log(parseFloat(amount));
  var amount = "0.01";
  Bmob.Pay.wechatPay(parseFloat(amount), '颜值排行榜', "颜值排行查看费用", that.data.currentUser.openid).then(function (resp) {

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

        var current = picSrc;
        var photoUrls = [];
        photoUrls.push(current);
        //console.log(current);
        wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: photoUrls, // 需要预览的图片http链接列表
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        //console.log(res);
        var OrderData = Bmob.Object.extend("order_data");
        var orderData = new OrderData();
        orderData.set("userOpenid", that.data.currentUser.openid);
        orderData.set("userNickName", that.data.currentUser.nickName);
        orderData.set("paymentGoods", "航帮帮赞助款");
        orderData.set("paymentDescription", "用于航帮帮推广研发");
        orderData.set("paymentAmount", amount);
        orderData.set("orderNumber", orderId);
        //添加数据，第一个入口参数是null
        orderData.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("订单成功保存");           
          },
          error: function (result, error) {
            // 添加失败
            console.log('订单保存失败');
            console.log(result);
            console.log(error);
          }
        });
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

