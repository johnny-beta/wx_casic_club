var Bmob = require('../../utils/bmob.js');
const Bmob1 = require('../../utils/Bmob-1.6.4.min.js') 
var common = require('../../utils/common.js');
import NumberAnimate from "../../utils/NumberAnimate"
var app = getApp()
var grids = [
  {
    "name": "航天SHOW",
    "ico": "liao.png",
    "url": "/pages/interface/facedetect/faceranking/faceranking?currentTab=0"
  },
  // {
  //   "name": "国庆-意见征集",
  //   "ico": "guoqing2.png",
  //   "url": "../interface/type/type?typeNumber=11&typeName=意见征集"
  // },
  {
    "name": "航天置换",
    "ico": "zhihuan.png",
    "url": "../interface/type/type?typeNumber=1&typeName=航天置换"
  },
  {
    "name": "航天漫步",
    "ico": "login.png",
    "url": "../interface/type/type?typeNumber=2&typeName=航天漫步"
  },
  {
    "name": "航天宝贝",
    "ico": "baobei.png",
    "url": "../interface/type/type?typeNumber=3&typeName=航天宝贝"
  },
  {
    "name": "房屋租售",
    "ico": "zushou.png",
    "url": "../interface/type/type?typeNumber=4&typeName=房屋出租"
  },
  // {
  //   "name": "鹊桥征友",
  //   "ico": "qianxian.png",
  //   "url": "../interface/type/type?typeNumber=5&typeName=鹊桥征友"
  // },
  {
    "name": "拼车出行",
    "ico": "car.png",
    "url": "../interface/type/type?typeNumber=6&typeName=拼车出行",
    "click": "autuLogin1"
  },

  // {
  //   "name": "群聊",
  //   "ico": "liao.png",
  //   //"url": "../interface/chatroom/chatroom",
  //   "click": "autuLogin"
  // }

];
Page({
  data: {
    userInfo: {},
    grids: grids,
    background: [],
    backgroundDisplay: [],
    newMessageFlag: 0,
    jinLiPeopleNumber: 0,
    biddocument:"",
    bottomDisplay:false,
    rangkingGender:false
  },
  onLoad: function () {
    var app = getApp()
    wx.setNavigationBarTitle({ title: '航帮帮V' + app.globalData.version + ' -航天人的信息沟通看板' })
    var that = this;
    this.getBG();
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    var currentUser = app.globalData.currentUser;
    //var userOpenid = currentUser.openid;
    
    // wx.request({
    //   url: "https://hbb.htxytech.cn/py/hello", //仅为示例，并非真实的接口地址
    //   data: {
    //     a: '1000',
    //     b: '2',
    //     asdd: '2'
    //   },
    //   method:'POST',
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log(res.data)
    //   }
    // })

    //jinliTemp1();
    //initLeaveMessageDataSheet();
    //initLeaveMessage();
    //initDairy();
    //getDairy();
    //face_API();
  },
  onShow: function () {

    var that = this;
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    var currentUser = app.globalData.currentUser;
    //微信留言提示功能
    //console.log(currentUser);
    if (currentUser){
      checkNewMessage(currentUser);
    }

    var Config = Bmob.Object.extend("config");
    var config = new Bmob.Query(Config);
    config.equalTo("name", "biddocumentSrc");
    // 查询所有数据
    config.find({
      success: function (results) {
        //console.log(results);
        that.setData({
          biddocument: results[0].attributes.key,
          bottomDisplay: results[0].attributes.isDIsplay
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    //console.log(currentUser.openid);
    //weChatPayTest(that,currentUser.openid)
    getRankingNumbers(that, currentUser.openid);
    //getJinliPeopleNumber(that, currentUser.openid);
  },
  biddocument:function(){
    wx.navigateTo({
      url: "/pages/account/biddocument/biddocument"
    })
  },
  getBG: function () {
    var that = this
    var Diary = Bmob.Object.extend("borad_bg");
    var query = new Bmob.Query(Diary);
    query.descending('createdAt');
    query.find({
      success: function (results) {
        var backgrounds = [];
        var backgroundDisplay = [];
        //console.log(results);

        for (var i = 0; i < results.length; i++) {
          var object = results[i];
          //console.log(object.id + ' - ' + object.get('title'));
          backgroundDisplay.push(object.get('imgurl'));
          if (object.attributes.boradBgToActivity) {
            backgrounds.push({ imgurl: object.get('imgurl'), activityID: object.attributes.boradBgToActivity.id.replace(/(^\s*)|(\s*$)/g, "") });
          } else {
            backgrounds.push({ imgurl: object.get('imgurl'), activityID: 0 });
          }
        }
        //console.log(backgrounds);
        that.setData({ background: backgrounds, backgroundDisplay: backgroundDisplay })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });

  },
  onShareAppMessage: function () { },
  getUserInfo: function (e) {
    var userinfo = e.detail.userInfo;
    // 这里会把头像信息写入到数据库
    var user = new Bmob.User() //实例化对象
    user.getUserInfo(userinfo)
  },
  autuLogin: function () {
    common.showModal("暂未开放！")
  },
  autuLogin1: function () {
    common.showModal("请详细阅读 我的-免责条款里的内容！")
  },
  preImg: function (o) {
    //console.log(o);
    var that = this;
    var targetSrc = o.target.dataset.src.imgurl;
    var targetID = o.target.dataset.src.activityID;
    //console.log(o);
    if (targetSrc == "http://bmob-cdn-21677.b0.upaiyun.com/2018/11/01/c2524bac40e9635f80583453e9fbee9d.jpg"){
      if (app.globalData.userInfo) {
        that.setData({
          writeDiary: true
        })
      } else {
        common.showModal("获得用户昵称才可以发布信息哦！请去我的选项中点击获取头像昵称");
        return ;
      }
      wx.navigateTo({
        url: "/pages/interface/canvas/zp",
      })
    }else{
      if (targetID != 0) {
        wx.navigateTo({
          url: "/pages/interface/article/detail/index?objectId=" + targetID,
        });
      } else {
        wx.previewImage({
          current: targetSrc,
          urls: this.data.backgroundDisplay,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }
  },
  animate: function () {
    var that = this;
    that.setData({
      num: 0
    });
  }
})
function checkNewMessage(currentUser) {
  //try {
  var newMessageIDArr = new Array();
  var currentUserID = currentUser.openid;
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  query.equalTo("openid", currentUserID);
  // 查询所有数据
  query.find({
    success: function (results) {
      //console.log(results.length);
      for (var i = 0; i < results.length; i++) {
        var localLeaveMessageCount = wx.getStorageSync(results[i].id);
        if (localLeaveMessageCount != results[i].attributes.leaveMessageCount) {
          newMessageIDArr.push(results[i].id);
        }
        //console.log(localLeaveMessageCount);
        if (localLeaveMessageCount == null) {
          try {
            // 同步接口立即写入
            wx.setStorageSync(results[i].id, results[i].attributes.leaveMessageCount);
            console.log("第0次写入成功");
          } catch (e) {
            console.log("第0次写入失败");
          }
        }
      }
      if (newMessageIDArr.length > 0) {
        wx.showTabBarRedDot({
          index: 3
        })
      } else {
        wx.hideTabBarRedDot({
          index: 3
        })
      }
      try {
        // 同步接口立即写入
        wx.setStorageSync("newMessageIDArr", newMessageIDArr);
        console.log("第一次写入成功");
      } catch (e) {
        console.log("第一次写入失败");
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
  // } catch (e) {
  //   console.log("获取留言信息失败，可能因为没有获取用户信息");
  // }
};
function weChatPayTest(that, openId) {
  var that = this;
  //console.log(openId);
  Bmob.Pay.wechatPay(0.01, '哇哈哈1瓶', '哇哈哈饮料，杭州生产', openId).then(function (resp) {
  //  console.log(resp);

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
      },
      'fail': function (res) {
        //付款失败
        console.log('付款失败');
        //console.log(res);
      }
    })

  }, function (err) {
    console.log('服务端返回失败');
    console.log(err);
  });
};
function face_API(){
  wx.request({
    url: "https://api-cn.faceplusplus.com/facepp/v3/detect", //仅为示例，并非真实的接口地址
    data: {
      api_key: 'AmSvOUqbsEnnPYfsVtuZi1YmTI9VVTdg',
      api_secret: '03GxULLaakXKr-KClQs1wGwF5cBTcoyh',
      image_url:'http://bmob-cdn-21677.b0.upaiyun.com/2018/11/07/82fbaa9940f63d4480d40975eaf17a07.jpg',
      return_attributes: 'beauty,gender'
    },
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    success(res) {
      console.log(res.data)
    }
  })
}
function getRankingNumbers(that,openid){

  var BeautyRankingList = Bmob.Object.extend("beauty_ranking_list");
  var beautyRankingList = new Bmob.Query(BeautyRankingList);

  beautyRankingList.equalTo("gender", "Male");
  beautyRankingList._extraOptions = { "average": "score" };
  beautyRankingList.find({
    success: function (beautyRankingListResults) {
      let maleAvgScore = beautyRankingListResults[0].attributes._avgScore.toFixed(2);
      let n1 = new NumberAnimate({
        from: maleAvgScore,//开始时的数字
        speed: 1500,// 总时间
        refreshTime: 50,// 刷新一次的时间
        decimals: 2,//小数点后的位数
        onUpdate: () => {//更新回调函数
          that.setData({
            maleAvgScore: n1.tempValue
          });
        },
        onComplete: () => {//完成回调函数
        }
      });
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });

  beautyRankingList.equalTo("gender", "Female");
  beautyRankingList._extraOptions = { "average": "score" };

  beautyRankingList.find({
    success: function (beautyRankingListResults) {
      let femaleAvgScore = beautyRankingListResults[0].attributes._avgScore.toFixed(2);
      let n2 = new NumberAnimate({
        from: femaleAvgScore,//开始时的数字
        speed: 1500,// 总时间
        refreshTime: 50,// 刷新一次的时间
        decimals: 2,//小数点后的位数
        onUpdate: () => {//更新回调函数
          that.setData({
            femaleAvgScore: n2.tempValue
          });
        },
        onComplete: () => {//完成回调函数
        }
      });
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });

  var BeautyRankingList1 = Bmob.Object.extend("beauty_ranking_list");
  var beautyRankingList1 = new Bmob.Query(BeautyRankingList1);

  beautyRankingList1.equalTo("openid", openid);
  beautyRankingList1.find({
    success: function (beautyRankingListResults1) {
      //console.log(beautyRankingListResults1);
      if (beautyRankingListResults1.length > 0){
        //console.log(beautyRankingListResults1);
        let userRankingAttributes = beautyRankingListResults1[0].attributes;
        if (userRankingAttributes.gender == "Male"){
          var BeautyRankingList3 = Bmob.Object.extend("beauty_ranking_list");
          var beautyRankingList3 = new Bmob.Query(BeautyRankingList3);
          beautyRankingList3.equalTo("gender", "Female");
          beautyRankingList3.count({
            success: function (rankingNumber) {
              // 查询成功，返回记录数量
              that.setData({
                rankingNumber: rankingNumber,
                rangkingGender: false
              });
    
            },
            error: function (error) {
              // 查询失败
            }
          });
        } else if (userRankingAttributes.gender == "Female"){
          var BeautyRankingList3 = Bmob.Object.extend("beauty_ranking_list");
          var beautyRankingList3 = new Bmob.Query(BeautyRankingList3);
          beautyRankingList3.equalTo("gender", "Male");
          beautyRankingList3.count({
            success: function (rankingNumber) {
              // 查询成功，返回记录数量
              that.setData({
                rankingNumber: rankingNumber,
                rangkingGender:true
              });
            },
            error: function (error) {
              // 查询失败
            }
          });
        }
        var BeautyRankingList2 = Bmob.Object.extend("beauty_ranking_list");
        var beautyRankingList2 = new Bmob.Query(BeautyRankingList2);
        beautyRankingList2.equalTo("gender", userRankingAttributes.gender);
        beautyRankingList2.descending("score");
        beautyRankingList2.find({
          success: function (beautyRankingList2Results) {
            let rankingNum = 0;
            //console.log(beautyRankingList2Results);
            for(let i = 0;i < beautyRankingList2Results.length;i ++){
              if (userRankingAttributes.score > beautyRankingList2Results[i].attributes.score){
                rankingNum = i;
                break;
              }
            }
            that.setData({
              rankingNum: rankingNum,
              rankingSum: beautyRankingList2Results.length
            });
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
       
        that.setData({
          notJinliFlag: false
        });  
      }else{
        that.setData({
          notJinliFlag: true
        });
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
  
}
function getJinliPeopleNumber(that, openId) {

  var DiaryCount = Bmob.Object.extend("diary");
  var queryCount = new Bmob.Query(DiaryCount);
  var userPraiseNum = 0;
  var sumPraiseNum = 0;
  let praiseArray = new Array();
  queryCount.equalTo("type", 10);
  queryCount.limit(200);
  queryCount.descending("praiseNum");
  queryCount.find({
    success: function (resultDairy) {
      // 查询成功，返回记录数量
      //console.log(resultDairy);
      var count = resultDairy.length;
      for (let i = 0; i < resultDairy.length; i++) {
        praiseArray.push(resultDairy[i].attributes.praiseNum)
      }
      //console.log(praiseArray);
      var SumPraiseNumDiary = Bmob.Object.extend("diary");
      var querySumPraiseNumDiary = new Bmob.Query(SumPraiseNumDiary);
      querySumPraiseNumDiary.equalTo("type", 10);
      querySumPraiseNumDiary._extraOptions = { "sum": "praiseNum" };
      querySumPraiseNumDiary.descending('createdAt');
      // 查询所有数据
      querySumPraiseNumDiary.find({
        success: function (sumPraiseNumResults) {
          var PraiseNumDiary = Bmob.Object.extend("diary");
          var queryPraiseNumDiary = new Bmob.Query(PraiseNumDiary);
          queryPraiseNumDiary.equalTo("type", 10);
          queryPraiseNumDiary.equalTo("openid", openId);
          queryPraiseNumDiary.find({
            success: function (userPraiseNumResult) {
              // 查询成功，返回记录数量
              //console.log(userPraiseNumResult);
              if (userPraiseNumResult.length > 0) {
                /*------------------------------------------*/
                let n3 = new NumberAnimate({
                  from: userPraiseNumResult[0].attributes.praiseNum,//开始时的数字
                  speed: 1500,// 总时间
                  refreshTime: 50,// 刷新一次的时间
                  decimals: 2,//小数点后的位数
                  onUpdate: () => {//更新回调函数
                    that.setData({
                      userPraiseNum: parseInt(n3.tempValue)
                    });
                  },
                  onComplete: () => {//完成回调函数
                  }
                });
                let userRanking = 0;
                for (let j = 0; j < praiseArray.length; j++) {
                  if (userPraiseNumResult[0].attributes.praiseNum >= praiseArray[j]) {
                    userRanking = j + 1;
                    break;
                  }
                }
                that.setData({
                  userRanking: userRanking
                });
                /*------------------------------------------*/
                let n4 = new NumberAnimate({
                  from: userRanking,//开始时的数字
                  speed: 1500,// 总时间
                  refreshTime: 50,// 刷新一次的时间
                  decimals: 0,//小数点后的位数
                  onUpdate: () => {//更新回调函数
                    that.setData({
                      userRanking: n4.tempValue
                    });
                  },
                  onComplete: () => {//完成回调函数
                  }
                });
              } else {
                that.setData({
                  notJinliFlag: true
                })
              }
            },
            error: function (error) {
              // 查询失败
            }
          });
          //console.log(sumPraiseNumResults[0].attributes._sumPraiseNum);
          /*------------------------------------------*/
          let n2 = new NumberAnimate({
            from: sumPraiseNumResults[0].attributes._sumPraiseNum,//开始时的数字
            speed: 1500,// 总时间
            refreshTime: 50,// 刷新一次的时间
            decimals: 1,//小数点后的位数
            onUpdate: () => {//更新回调函数
              that.setData({
                sumPraiseNum: parseInt(n2.tempValue)
              });
            },
            onComplete: () => {//完成回调函数
            }
          });
          /*------------------------------------------*/
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });

      /*------------------------------------------*/
      let n1 = new NumberAnimate({
        from: count,//开始时的数字
        speed: 1500,// 总时间
        refreshTime: 50,// 刷新一次的时间
        decimals: 2,//小数点后的位数
        onUpdate: () => {//更新回调函数
          that.setData({
            sumPeople: parseInt(n1.tempValue)
          });
        },
        onComplete: () => {//完成回调函数
        }
      });
      /*------------------------------------------*/
    },
    error: function (error) {
      // 查询失败
    }
  });
};


