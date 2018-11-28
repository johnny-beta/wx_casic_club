// pages/interface/facedetect/faceranking/faceranking.js
var Bmob = require('../../../../utils/bmob.js');
var common = require('../../../../utils/common.js');
const Bmob1 = require('../../../../utils/Bmob-1.6.4.min.js')
import util from '../../../../utils/util.js';
var app = getApp();
var superVipFlag = false;
var vipFlag = false;
var vipPhotoArray = new Array();
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
    photoUrls:[],
    userInfo: {},
    vipSelectItem: [
      { name: 'vip', value: '支付0.3元看单张大图' },
      { name: 'superVip', value: '支付3.0元看全榜大图', checked: 'true' },
    ],
    selectMoney:"3.0",
    paymentFlag:false,
    selectedPic:"",
    selectedOpenid:"",
  },

  onLoad: function (e) {
    var that = this;
    if (e.currentTab){
      that.setData({
        currentTab: e.currentTab
      });
    }
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }

    that.data.currentUser = app.globalData.currentUser
    //console.log(that.data.currentUser);
    that.setData({
      userInfo: that.data.currentUser
    });
    //console.log(that.data.userInfo);
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
  onShow: function () {
    var that = this;
    superVipFlag = false;
    vipFlag = false;
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }

    that.data.currentUser = app.globalData.currentUser
    that.setData({
      userInfo: that.data.currentUser
    });

    var RankingVip = Bmob.Object.extend("rankingVip");
    var queryRankingVip = new Bmob.Query(RankingVip);
    queryRankingVip.equalTo("vipType", "superVip");
    queryRankingVip.equalTo("vipOpenid", that.data.currentUser.openid);
    // 查询所有数据
    queryRankingVip.find({
      success: function (queryRankingVipResults) {
        if (queryRankingVipResults.length > 0)
          superVipFlag=true;
      },
      error: function (error) {
        console.log("超级会员查询失败: " + error.code + " " + error.message);
      }
    });

    var RankingVip1 = Bmob.Object.extend("rankingVip");
    var queryRankingVip1 = new Bmob.Query(RankingVip1);
    queryRankingVip1.equalTo("vipType", "vip");
    queryRankingVip1.equalTo("vipOpenid", that.data.currentUser.openid);
    // 查询所有数据
    queryRankingVip1.find({
      success: function (queryRankingVipResults) {
        //console.log(queryRankingVipResults);
        if (queryRankingVipResults.length > 0){
          let vipPhotoArrayTemp = new Array();
          for (let i = 0; i < queryRankingVipResults.length;i++){
            vipPhotoArrayTemp.push(queryRankingVipResults[i].attributes.targetOpenid);
          }
          vipPhotoArray = vipPhotoArrayTemp;
          vipFlag = true;
        }
        //console.log(vipPhotoArray);
      },
      error: function (error) {
        console.log("超级会员查询失败: " + error.code + " " + error.message);
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
    //判断是否获取头像和昵称
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    } else {
      common.showModal('请点击我的颜值中的微信logo获取头像才可以看大图哦，颜值测试在首页航天SHOW模块', "提示");
      return;
    };
    
    that.data.selectMoney = "3.0";
    //console.log(e.target.dataset.src);
    that.data.selectedPic = e.target.dataset.src.beautifulPic;
    that.data.selectedOpenid = e.target.dataset.src.openid;

    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    that.data.currentUser = app.globalData.currentUser;
    
    if (superVipFlag) {
      showPhoto(that.data.selectedPic)
    } else if (vipFlag){
      if(vipPhotoArray.indexOf(that.data.selectedOpenid) != -1){
        showPhoto(that.data.selectedPic);
      } else {
        that.setData({
          paymentFlag: true
        });
      }    
    } else {
      that.setData({
        paymentFlag: true
      });
    }
    
    
    //weChatPayTest(that,e.target.dataset.src);
    
  },
  continueSupport: function () {
    var that = this;
    if (that.data.selectMoney == "0.3"){
      weChatPayVip(that, "0.3");
    } else if (that.data.selectMoney == "3.0"){
      weChatPaySuperVip(that, "3.0") 
    }
  },
  returnHome: function () {
    var that = this;
    that.setData({
      paymentFlag: false
    });
  },
  radioChange:function (e){
    var that = this;
    if (e.detail.value == "vip"){
      that.data.selectMoney = "0.3";
    } else if (e.detail.value == "superVip"){
      that.data.selectMoney = "3.0";
    }
  }
});
function showPhoto(selectedPic){
  var current = selectedPic;
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
}

function weChatPayVip(that,amount) {
  // console.log(openId);
  // console.log(parseFloat(amount));
  Bmob.Pay.wechatPay(parseFloat(amount), '颜值排行榜', "普通会员查看费用", that.data.currentUser.openid).then(function (resp) {

    //服务端返回成功
    var timeStamp = resp.timestamp,
      nonceStr = resp.noncestr,
      packages = resp.package,
      orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
      sign = resp.sign;

    //打印订单号
    //console.log(orderId);

    //发起支付
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packages,
      'signType': 'MD5',
      'paySign': sign,
      'success': function (res) {

        //付款成功,这里可以写你的业务代码
        
        //console.log(res);
        var OrderData = Bmob.Object.extend("order_data");
        var orderData = new OrderData();
        
        orderData.set("userOpenid", that.data.currentUser.openid);
        orderData.set("userNickName", that.data.currentUser.nickName);
        orderData.set("paymentGoods", "颜值排行榜");
        orderData.set("paymentDescription", "普通会员查看费用");
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

        var RankingVip = Bmob.Object.extend("rankingVip");
        var rankingVip = new RankingVip();
        rankingVip.set("vipType", "vip");
        rankingVip.set("vipPic", that.data.currentUser.userPic);
        rankingVip.set("vipOpenid", that.data.currentUser.openid);
        rankingVip.set("vipNickName", that.data.currentUser.nickName);
        rankingVip.set("targetOpenid", that.data.selectedOpenid);
        rankingVip.set("orderNumber", orderId);

        
        //添加数据，第一个入口参数是null
        rankingVip.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            vipFlag = true;
            that.setData({
              paymentFlag: false
            });
            console.log("会员订单成功保存");
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

function weChatPaySuperVip(that, amount) {
  // console.log(openId);
  // console.log(parseFloat(amount));

  Bmob.Pay.wechatPay(parseFloat(amount), '颜值排行榜', "超级会员查看费用", that.data.currentUser.openid).then(function (resp) {

    //服务端返回成功
    var timeStamp = resp.timestamp,
      nonceStr = resp.noncestr,
      packages = resp.package,
      orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
      sign = resp.sign;

    //打印订单号
    //console.log(orderId);

    //发起支付
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': packages,
      'signType': 'MD5',
      'paySign': sign,
      'success': function (res) {

        //付款成功,这里可以写你的业务代码

        //console.log(res);
        var OrderData = Bmob.Object.extend("order_data");
        var orderData = new OrderData();

        orderData.set("userOpenid", that.data.currentUser.openid);
        orderData.set("userNickName", that.data.currentUser.nickName);
        orderData.set("paymentGoods", "颜值排行榜");
        orderData.set("paymentDescription", "超级会员查看费用");
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

        var RankingVip1 = Bmob.Object.extend("rankingVip");
        var rankingVip1 = new RankingVip1();
        rankingVip1.set("vipType", "superVip");
        rankingVip1.set("vipPic", that.data.currentUser.userPic);
        rankingVip1.set("vipOpenid", that.data.currentUser.openid);
        rankingVip1.set("vipNickName", that.data.currentUser.nickName);
        rankingVip1.set("orderNumber", orderId);


        //添加数据，第一个入口参数是null
        rankingVip1.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            superVipFlag = true;
            that.setData({
              paymentFlag: false
            });
            console.log("会员订单成功保存");
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

