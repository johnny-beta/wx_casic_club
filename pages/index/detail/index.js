// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
const Bmob1 = require('../../../utils/Bmob-1.6.4.min.js')
var app = getApp();
var date = new Date();
var myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
var amount = 0;
var diaryTitle = "";
var diaryType = "";

Page({
  data: {
    rows: {},
    nickName: "",
    userPic: "",
    messageInput: "",
    //currentUserInfoInformation: {},
    //currentUserInformation: {},
    currentUser: {},
    currentObjectId: "",
    leaveMessageArr: [],
    inputContent: "写评论",
    limit: 15,
    windowHeight: 0,
    windowWidth: 0,
    collectionStatus: false,
    collectionPic: "/image/collectOff.png",
    defaultNickName: '航帮帮',
    defaultUserPic: 'http://bmob-cdn-21677.b0.upaiyun.com/2018/09/29/c51b3731409bcf5f800fb7305b11bf48.png',
    buttonDisable: false,
    rewardCheckFlag: false,
    checkMoneyFlag1: false,
    checkMoneyFlag2: false,
    checkMoneyFlag3: false,
    checkMoneyFlag4: false,
    grids: app.globalData.grids
  },
  onShareAppMessage: function () { },
  onLoad: function (e) {
    var that = this;
    if (!e.objectId) {
      common.showTip("请重新进入", "loading");
      return false;
    }
    var objectId = e.objectId;
    that.data.currentObjectId = objectId;
    //that.data.currentUserInfoInformation = app.globalData.userInfo;
    //that.data.currentUserInformation = app.globalData.currentUser;
    //上面两个变量重复了。用户的有关信息，统一以下面的变量currentUser为准
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    that.data.currentUser = app.globalData.currentUser

    //查询页面帖子内容
    getDiaryContent(that);
    //查询收藏状态
    if (that.data.currentUser) {
      getCollectionStatus(that);
    }
    //查询点赞状态
    getPraiseStatus(that);

  },
  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示
    var that = this;
    //留言功能
    getLeaveMessage(that);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
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
      urls: [that.data.rows.get('imgurl')],
    })

  },
  sendMessage: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e)
    var that = this;
    that.setData({
      buttonDisable: true
    });
    if (that.data.currentUser && that.data.currentUser.openid) {
      if (that.data.messageInput) {
        //首先根据_User表的openid查找该用户的objectid
        var User = Bmob.Object.extend("_User");
        var user = new Bmob.Query(User);
        user.equalTo("openid", that.data.currentUser.openid);
        user.find({
          success: function (userResults) {
            var LeaveMessage = Bmob.Object.extend("leave_message");
            var leaveMessage = new LeaveMessage();
            var user1 = new User();
            user1.id = userResults[0].id; //将该留言用户的objectId与leaveMessage中的userObjectId进行绑定
            leaveMessage.set("userOpenid", that.data.currentUser.openid);
            leaveMessage.set("messageContent", that.data.messageInput);
            leaveMessage.set("diaryObjectId", that.data.currentObjectId);
            leaveMessage.set("formId", e.detail.formId);
            leaveMessage.set("userObjectId", user1); //加入关联_User表ObjectId字段，用来查询用户信息
            var leaveMessageArrTemp = that.data.leaveMessageArr;
            var date = new Date();
            var myDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            leaveMessageArrTemp.push({
              "messageContent": that.data.messageInput,
              "messageUser": that.data.currentUser.nickName,
              "messagePic": that.data.currentUser.userPic,
              "messageupdateAt": myDate
            });
            let leaveMessageContentTemp = that.data.messageInput;
            leaveMessage.save(null, {
              success: function (result) {
                //console.log('留言保存结果', result)
                that.setData({
                  messageInput: "",
                  inputContent: "",
                  leaveMessageArr: leaveMessageArrTemp,
                  buttonDisable: false
                });
                //成功留言leaveMessageCount+1
                (function () {
                  var resultDiary = that.data.rows;
                  resultDiary.increment("leaveMessageCount");
                  resultDiary.save();
                })();
                
                         
                //第一次留言，调用云函数，推送微信消息      
                if (leaveMessageArrTemp.length == 1) {
                  var temp = {
                    "touser": that.data.currentUser.openid,
                    "template_id": "4ofydGg7R_VTfx4mMMDgCwixmx3Hk-aMOsVFptUCaPk",
                    "page": "",
                    "form_id": that.data.rows.attributes.formId,
                    "data": {
                      "keyword1": {
                        "value": leaveMessageContentTemp
                      },
                      "keyword2": {
                        "value": myDate
                      },
                      "keyword3": {
                        "value": that.data.currentUser.nickName
                      },
                      "keyword4": {
                        "value": that.data.rows.attributes.title
                      },
                      "keyword5": {
                        "value": "这是您信息的第一条留言"
                      }
                    },
                    "emphasis_keyword": "keyword3.DATA"
                  }
                  console.log(temp);
                  console.log(that.data.rows);
                  console.log(that.data);
                  Bmob.sendMessage(temp).then(function (obj) {
                    console.log('发送成功')
                  }, function (err) {
                    console.log(err)
                  });
                  common.showTip('评论成功！您是首位留言者，将会发通知给该作者', 'success')
                } else {
                  common.showTip('评论成功！', 'success')
                }
              },
              error: function (result, error) {

              }
            });
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });


      }
    } else {
      common.showModal("获取昵称和头像之后才能评论哦，请去我的选项中获取~~", "提示");
    }
  },
  userMessageInput: function (e) {
    var that = this;
    that.setData({
      messageInput: e.detail.value
    })
  },
  userMessageFocus: function (e) {
    var that = this;
    if (!that.data.messageInput) {
      that.setData({
        messageInput: "",
        inputContent: ""
      })
    }
  },
  userMessageBlur: function (e) {
    var that = this;

    if (!that.data.messageInput) {
      that.setData({
        inputContent: "写评论"
      })

    }
  },
  pullUpLoad: function (e) {
    var that = this;
    var limit = that.data.limit + 2;
    that.setData({
      limit: limit
    });
    that.onShow();
  },

  toCollect: function (event) {
    var that = this
    // 更新缓存
    var objectId = that.data.rows.id;
    var cache = wx.getStorageSync('cache_key');
    cache[objectId] = myDate;
    wx.setStorageSync('cache_key', cache);

    //点赞数+1
    // 更新数据绑定,从而切换图片，数字加1
    //改为立即执行函数
    (function () {
      var resultDiary = that.data.rows;
      var num = resultDiary.get('praiseNum')
      if (!num) num = 0;
      that.setData({
        pNum: ++num,
        collection: true
      });
      resultDiary.increment("praiseNum");
      resultDiary.save();
    })();
  },
  returnHome: function () {
    wx.switchTab({
      url: '/pages/interface/interface',
    })
  },
  addCollection: function (e) {
    var that = this;
    if (that.data.currentUser) {
      if (that.data.collectionStatus == true) {
        var CollectionQuery = Bmob.Object.extend("diary_collect");
        var collectionQuery = new Bmob.Query(CollectionQuery);
        var Diary = Bmob.Object.extend("diary");
        var diary = new Diary();
        diary.id = that.data.currentObjectId;
        collectionQuery.equalTo("openID", that.data.currentUser.openid);
        collectionQuery.equalTo("diaryID", diary);
        collectionQuery.find().then(function (todos) {
          return Bmob.Object.destroyAll(todos);
        }).then(function (todos) {
          that.setData({
            collectionStatus: false,
            collectionPic: "/image/collectOff.png"
          });
          common.showTip("已取消收藏", "success");
        }, function (error) {
          // 异常处理
        });
      } else if (!that.data.collectionStatus) {
        var CollectionQuery = Bmob.Object.extend("diary_collect");
        var collectionQuery = new CollectionQuery();
        var Diary = Bmob.Object.extend("diary");
        var diary = new Diary();
        diary.id = that.data.currentObjectId;

        collectionQuery.set("diaryID", diary);
        collectionQuery.set("openID", that.data.currentUser.openid);
        collectionQuery.save(null, {
          success: function (result) {
            that.setData({
              collectionStatus: true,
              collectionPic: "/image/collect.png"
            });
            common.showTip("已成功收藏", "success");
          },
          error: function (result, error) {
            console.log('创建留言失败');
          }
        });
      }
    } else {
      common.showModal("获取昵称和头像之后才能收藏哦，请去我的选项中获取~~", "提示");
    }
  },
  /**
   * 进行页面分享
   */
  onShareAppMessage: function (options) {
    return {
      success: function (res) {
        util.showToast(1, '转发成功');
      },

      fail: function () {
        util.showToast(0, '转发失败');
      }
    }
  },
  rewardCheck: function () {
    var that = this;
    that.setData({
      rewardCheckFlag: !that.data.rewardCheckFlag
    });
  },
  chooseMoney: function (e) {
    var that = this;
    // console.log(e.target);
    amount = 0;
    var chooseMoneyId = e.target.dataset.id;
    //console.log(chooseMoneyId);
    //console.log(!that.data.checkMoneyFlag1);
    switch (chooseMoneyId) {
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
        amount = e.target.dataset.value;
        weChatPayTest(that);
        break;
    }
  }
})
//查询页面内容--可以先把帖子的内容缓存到本地
function getDiaryContent(that) {
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  var nickName = that.data.defaultNickName;
  var userPic = that.data.defaultUserPic;
  query.get(that.data.currentObjectId, {
    success: function (resultDiary) {
      diaryTitle = resultDiary.attributes.title;
      diaryType = that.data.grids[resultDiary.attributes.type];
      //console.log(that.data.currentUser.openid);
      if (that.data.currentUser) {
        if (resultDiary.attributes.openid == that.data.currentUser.openid) {
          try {
            // 同步接口立即写入
            wx.setStorageSync(resultDiary.id, resultDiary.attributes.leaveMessageCount);
            console.log("第四次写入成功");
            try {
              // 同步接口立即返回值
              var newMessageIDArr = wx.getStorageSync("newMessageIDArr");
              //console.log(resultDiary.id);
              newMessageIDArr.remove(resultDiary.id);
              //console.log(newMessageIDArr);
              console.log("第五次读取成功");
              try {
                // 同步接口立即写入
                wx.setStorageSync("newMessageIDArr", newMessageIDArr);
                console.log("第六次写入成功");
              } catch (e) {
                console.log("第六次写入失败");
              }

            } catch (e) {
              console.log('第五次读取失败')
            }
          } catch (e) {
            console.log("第四次写入失败");
          }
        }
      }
      var pNum = resultDiary.get('praiseNum');
      if (!pNum) pNum = 0;
      var User = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(User);
      if (resultDiary.attributes.openid) {
        queryUser.equalTo("openid", resultDiary.attributes.openid);
        queryUser.find({
          success: function (results) {
            nickName = results[0].attributes.nickName;
            userPic = results[0].attributes.userPic;
            that.setData({
              pNum: pNum,
              rows: resultDiary,
              nickName: nickName,
              userPic: userPic
            })
          },
          error: function (error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });
      } else {
        that.setData({
          pNum: pNum,
          rows: resultDiary,
          nickName: nickName,
          userPic: userPic
        })
      }
      resultDiary.increment("count");
      resultDiary.save();
    },
    error: function (result, error) {
      console.log("查询失败");
    }

  });
}
//获取留言列表--可以先把留言内容缓存到本地
function getLeaveMessage(that) {
  var leaveMessageArr = new Array();
  var LeaveMessageQuery = Bmob.Object.extend("leave_message");
  var leaveMessageQuery = new Bmob.Query(LeaveMessageQuery);
  leaveMessageQuery.ascending('createdAt');
  leaveMessageQuery.equalTo("diaryObjectId", that.data.currentObjectId);
  leaveMessageQuery.limit(that.data.limit);
  leaveMessageQuery.include("userObjectId");
  leaveMessageQuery.find({
    success: function (resultLeaveMessages) {
      //console.log(resultLeaveMessages)
      resultLeaveMessages.forEach(function (detail) {
        leaveMessageArr.push({
          "messageContent": detail.attributes.messageContent,
          "messageUser": detail.attributes.userObjectId.nickName || that.data.defaultNickName, //使用关联字段查询
          "messagePic": detail.attributes.userObjectId.userPic || that.data.defaultUserPic,
          "messageupdateAt": detail.createdAt
        });
      });
      that.setData({
        leaveMessageArr: leaveMessageArr
      });
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
};

function getCollectionStatus(that) {
  var CollectionQuery = Bmob.Object.extend("diary_collect");
  var collectionQuery = new Bmob.Query(CollectionQuery);
  collectionQuery.equalTo("openID", that.data.currentUser.openid);
  collectionQuery.equalTo("diaryID", that.data.currentObjectId);
  collectionQuery.find({
    success: function (resultCollection) {

      var haveRes = (resultCollection.length > 0);
      that.setData({
        collectionStatus: haveRes,
        collectionPic: haveRes ? "/image/collect.png" : "/image/collectOff.png"
      });
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
};

function getPraiseStatus(that) {
  var cache = wx.getStorageSync('cache_key');
  if (cache) {
    var currentCache = cache[that.data.currentObjectId];
    that.setData({
      collection: currentCache == myDate
    })
  } else {
    var cache = {};
    cache[that.data.currentObjectId] = "";
    // 把设置的当前文章点赞放在整体的缓存中
    wx.setStorageSync('cache_key', cache);
  }
}
Array.prototype.aindexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.aindexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
function weChatPayTest(that) {
 // console.log(Bmob1.User.current());
  if (!app.globalData.currentUser) {
    app.globalData.currentUser = Bmob1.User.current();
    that.data.currentUser = app.globalData.currentUser;
  }
  if (app.globalData.currentUser) {
    Bmob.Pay.wechatPay(parseFloat(amount), "帖子打赏", diaryType + "-" + diaryTitle, that.data.currentUser.openid).then(function (resp) {


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
          orderData.set("paymentGoods", diaryTitle);
          orderData.set("paymentDescription", diaryType + "-" + diaryTitle);
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
};