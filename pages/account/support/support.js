var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
const Bmob1 = require('../../../utils/Bmob-1.6.4.min.js') 
var app = getApp();
var amount;
Page({
  data: {
    userInfo: {},
    checkMoneyFlag1: false,
    checkMoneyFlag2: false,
    checkMoneyFlag3: false,
    checkMoneyFlag4: false,
    amount: 0,
    thankPageFlag: false
  },
  onLoad: function () {
    var that = this;
    
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    
    that.data.currentUser = app.globalData.currentUser
    console.log(that.data.currentUser);
    that.setData({
      userInfo: that.data.currentUser
    })
  },
  requestPayment:function(e){
    var that = this;
    //console.log(that.data.currentUser)
    weChatPayTest(that);
  },
  amountInput: function (e) {
    amount = e.detail.value;
    //console.log(amount);
  },
  chooseMoney:function(e){
    var that = this;
   // console.log(e.target);
    amount = 0;
    var chooseMoneyId = e.target.dataset.id;
    //console.log(chooseMoneyId);
    //console.log(!that.data.checkMoneyFlag1);
    switch (chooseMoneyId){
      case "1":
        that.setData({
          checkMoneyFlag1: !that.data.checkMoneyFlag1,
          checkMoneyFlag2: false,
          checkMoneyFlag3: false,
          checkMoneyFlag4: false
        });
        amount = e.target.dataset.value;
        weChatPayTest(that);
        break;
      case "2":
        that.setData({
          checkMoneyFlag1: false,
          checkMoneyFlag2: !that.data.checkMoneyFlag2,
          checkMoneyFlag3: false,
          checkMoneyFlag4: false
        })
        amount = e.target.dataset.value;
        weChatPayTest(that);
        break;
      case "3":
        that.setData({
          checkMoneyFlag1: false,
          checkMoneyFlag2: false,
          checkMoneyFlag3: !that.data.checkMoneyFlag3,
          checkMoneyFlag4: false
        })
        amount = e.target.dataset.value;
        weChatPayTest(that);
        break;
      case "4":
        that.setData({
          checkMoneyFlag1: false,
          checkMoneyFlag2: false,
          checkMoneyFlag3: false,
          checkMoneyFlag4: !that.data.checkMoneyFlag4
        })
        amount = 0;
        break;
    }

    //console.log(amount);

  },
  continueSupport:function(){
    var that = this;
    that.setData({
      thankPageFlag: false
    });
  },
  returnHome:function(){
      wx.switchTab({
        url: '/pages/interface/interface',
      })   
  }

})
function weChatPayTest(that) {
  // console.log(openId);
  // console.log(parseFloat(amount));
  Bmob.Pay.wechatPay(parseFloat(amount), '航帮帮赞助款', "用于航帮帮推广研发", that.data.currentUser.openid).then(function (resp) {
    //console.log(resp);

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
            that.setData({
              thankPageFlag: true,
              amount: amount
            })
          },
          error: function (result, error) {
            // 添加失败
            console.log('订单保存失败');
            that.setData({
              checkMoneyFlag1: false,
              checkMoneyFlag2: false,
              checkMoneyFlag3: false,
              checkMoneyFlag4: false
            })
          }
        });
      },
      'fail': function (res) {
        //付款失败
        console.log('付款失败');
        console.log(res);
        that.setData({
          checkMoneyFlag1: false,
          checkMoneyFlag2: false,
          checkMoneyFlag3: false,
          checkMoneyFlag4: false
        })
      }
    })

  }, function (err) {
    console.log('服务端返回失败');
    console.log(err);
  });
}