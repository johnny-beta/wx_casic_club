// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var date = new Date();
var myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

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
    defaultUserPic: 'http://bmob-cdn-21677.b0.upaiyun.com/2018/09/29/c51b3731409bcf5f800fb7305b11bf48.png'
  },
  onShareAppMessage: function() {},
  onLoad: function(e) {
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
    that.data.currentUser = app.globalData.currentUser
    //查询页面帖子内容
    getDiaryContent(that);
    //查询收藏状态
    getCollectionStatus(that);
    //查询点赞状态
    getPraiseStatus(that);

  },
  onReady: function() {
    // 页面渲染完成
  },

  onShow: function() {
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
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },
  preImg: function(o) {
    var that = this
    wx.previewImage({
      current: '',
      urls: [that.data.rows.get('imgurl')],
    })

  },
  sendMessage: function(e) {
    var that = this;
    if (that.data.currentUser) {
      if (that.data.messageInput) {
        var LeaveMessage = Bmob.Object.extend("leave_message");
        var leaveMessage = new LeaveMessage();

        leaveMessage.set("userOpenid", that.data.currentUser.openid);
        leaveMessage.set("messageContent", that.data.messageInput);
        leaveMessage.set("diaryObjectId", that.data.currentObjectId);
        var leaveMessageArrTemp = that.data.leaveMessageArr;
        var date = new Date();
        var myDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        leaveMessageArrTemp.push({
          "messageContent": that.data.messageInput,
          "messageUser": that.data.currentUser.nickName,
          "messagePic": that.data.currentUser.userPic,
          "messageupdateAt": myDate
        });
        leaveMessage.save(null, {
          success: function(result) {
            common.showTip('评论成功！', 'success')
            that.setData({
              messageInput: "",
              inputContent: "",
              leaveMessageArr: leaveMessageArrTemp
            })
          },
          error: function(result, error) {

          }
        });
      }
    } else {
      common.showModal("获取昵称和头像之后才能评论哦，请去我的选项中获取~~", "提示");
    }
  },
  userMessageInput: function(e) {
    var that = this;
    that.setData({
      messageInput: e.detail.value
    })
  },
  userMessageFocus: function(e) {
    var that = this;
    if (!that.data.messageInput) {
      that.setData({
        messageInput: "",
        inputContent: ""
      })
    }
  },
  userMessageBlur: function(e) {
    var that = this;

    if (!that.data.messageInput) {
      that.setData({
        inputContent: "写评论"
      })

    }
  },
  pullUpLoad: function(e) {
    var that = this;
    var limit = that.data.limit + 2;
    that.setData({
      limit: limit
    });
    //that.onShow();
  },

  toCollect: function(event) {
    var that = this
    // 更新缓存
    var objectId = that.data.rows.id;
    var cache = wx.getStorageSync('cache_key');
    cache[objectId] = myDate;
    wx.setStorageSync('cache_key', cache);

    //点赞数+1
    // 更新数据绑定,从而切换图片，数字加1
    //改为立即执行函数
    (function() {
      var resultDiary = that.data.rows;
      var num = resultDiary.get('praiseNum')
      if (!num) num = 0;
      that.setData({
        pNum: num++,
        collection: true
      });
      resultDiary.increment("praiseNum");
      resultDiary.save();
    })();
  },
  returnHome: function() {
    wx.switchTab({
      url: '/pages/interface/interface',
    })
  },
  addCollection: function(e) {
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
        collectionQuery.find().then(function(todos) {
          return Bmob.Object.destroyAll(todos);
        }).then(function(todos) {
          that.setData({
            collectionStatus: false,
            collectionPic: "/image/collectOff.png"
          });
          common.showTip("已取消收藏", "success");
        }, function(error) {
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
          success: function(result) {
            that.setData({
              collectionStatus: true,
              collectionPic: "/image/collect.png"
            });
            common.showTip("已成功收藏", "success");
          },
          error: function(result, error) {
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
  onShareAppMessage: function(options) {
    return {
      success: function(res) {
        util.showToast(1, '转发成功');
      },

      fail: function() {
        util.showToast(0, '转发失败');
      }
    }
  }
})
//查询页面内容
function getDiaryContent(that) {
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  var nickName = "航帮帮";
  query.get(that.data.currentObjectId, {
    success: function(resultDiary) {
      var pNum = resultDiary.get('praiseNum');
      if (!pNum) pNum = 0;
      that.setData({
        pNum: pNum
      });
      that.setData({
        rows: resultDiary
      });
      var User = Bmob.Object.extend("_User");
      var queryUser = new Bmob.Query(User);
      if (resultDiary.attributes.openid) {
        queryUser.equalTo("openid", resultDiary.attributes.openid);
        queryUser.find({
          success: function(results) {
            nickName = results[0].attributes.nickName;
            var userPic = results[0].attributes.userPic;
            that.setData({
              nickName: nickName,
              userPic: userPic
            })
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });

      } else {
        that.setData({
          rows: resultDiary,
          nickName: nickName
        })
      }
      resultDiary.increment("count");
      resultDiary.save();
    },
    error: function(result, error) {
      console.log("查询失败");
    }

  });
}
//获取留言列表
function getLeaveMessage(that) {
  var leaveMessageArr = new Array();
  var LeaveMessageQuery = Bmob.Object.extend("leave_message");
  var leaveMessageQuery = new Bmob.Query(LeaveMessageQuery);
  leaveMessageQuery.descending('createdAt');
  leaveMessageQuery.equalTo("diaryObjectId", that.data.currentObjectId);
  //leaveMessageQuery.limit(that.data.limit);
  leaveMessageQuery.find({
    success: function(resultLeaveMessages) {
      resultLeaveMessages.forEach(function(detail) {
        var UserQuery = Bmob.Object.extend("_User");
        var userQuery = new Bmob.Query(UserQuery);
        userQuery.equalTo("openid", detail.attributes.userOpenid);
        userQuery.find({
          success: function(resultUser) {
            leaveMessageArr.push({
              "messageContent": detail.attributes.messageContent,
              "messageUser": resultUser[0].attributes.nickName,
              "messagePic": resultUser[0].attributes.userPic,
              "messageupdateAt": detail.createdAt
            });
            leaveMessageArr.sort(function(a, b) {
              return Date.parse(a.messageupdateAt) - Date.parse(b.messageupdateAt); //时间正序
            });
            that.setData({
              leaveMessageArr: leaveMessageArr
            });
          },
          error: function(error) {
            console.log("查询失败: " + error.code + " " + error.message);
          }
        });

      });

    },
    error: function(error) {
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
    success: function(resultCollection) {

      var haveRes = (resultCollection.length > 0);
      that.setData({
        collectionStatus: haveRes,
        collectionPic: haveRes ? "/image/collect.png" : "/image/collectOff.png"
      });
    },
    error: function(error) {
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