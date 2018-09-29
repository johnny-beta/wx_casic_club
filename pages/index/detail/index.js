// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../..//utils/common.js');
var app = getApp();
Page({
  data: {
    rows: {},
    nickName:"",
    userPic:"",
    messageInput:"",
    currentUserInfoInformation:{},
    currentUserInformation: {},
    currentObjectId:"",
    leaveMessageArr: [],
    inputContent:"写评论",
    limit: 15,
    windowHeight: 0,
    windowWidth: 0
  },
  onShareAppMessage: function () { },
  onLoad: function (e) {

    // 页面初始化 options为页面跳转所带来的参数
   // console.log(e.objectId)
    var objectId = e.objectId;
    var that = this;
    app = getApp();
    that.data.currentUserInfoInformation = app.globalData.userInfo;
    that.data.currentUserInformation = app.globalData.currentUser;
    that.data.currentObjectId = objectId ; 
    // if (!e.objectId) {
    //   common.showTip("请重新进入", "loading");
    //   return false;
    // }
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    var nickName = "航帮帮";
    query.get(objectId, {
      success: function (resultDiary) {

        that.setData({
          rows: resultDiary
        }) 
        var User = Bmob.Object.extend("_User");
        var queryUser = new Bmob.Query(User);
        if (resultDiary.attributes.openid){
          queryUser.equalTo("openid", resultDiary.attributes.openid);
          queryUser.find({
            success: function (results) {
              //console.log(results);
              nickName = results[0].attributes.nickName;
              var userPic = results[0].attributes.userPic;
          
              that.setData({
                nickName: nickName,
                userPic: userPic
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
        resultDiary.increment("count");
        resultDiary.save();
      },
      error: function (result, error) {
        console.log("查询失败");
      }
      
    });
    
    //留言功能
    var leaveMessageArr = new Array();
    var LeaveMessageQuery = Bmob.Object.extend("leave_message");
    var leaveMessageQuery = new Bmob.Query(LeaveMessageQuery);
    leaveMessageQuery.equalTo("diaryObjectId", objectId);
    leaveMessageQuery.find({
      success: function (resultLeaveMessages) {
        //console.log(resultLeaveMessages);
        resultLeaveMessages.forEach(function(detail){
          var UserQuery = Bmob.Object.extend("_User");
          var userQuery = new Bmob.Query(UserQuery);
          userQuery.equalTo("openid", detail.attributes.userOpenid);
          userQuery.find({
            success: function (resultUser) {
              leaveMessageArr.push({ 
                "messageContent": detail.attributes.messageContent,
                "messageUser": resultUser[0].attributes.nickName,
                "messagePic": resultUser[0].attributes.userPic       
              });

              that.setData({
                leaveMessageArr: leaveMessageArr
              })
            },
            error: function (error) {
              console.log("查询失败: " + error.code + " " + error.message);
            }
          });
          

        });
        
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
    //查询收藏状态
    // var CollectionQuery = Bmob.Object.extend("diary_collect");
    // var collectionQuery = new Bmob.Query(CollectionQuery);
    // console.log(that.data.currentUserInformation.openid);
    // collectionQuery.equalTo("openID", that.data.currentUserInformation.openid);
    // collectionQuery.equalTo("diaryID", objectId);
    // collectionQuery.find({
    //   success: function (resultCollection) {
    //     console.log(resultCollection);

    //   },
    //   error: function (error) {
    //     console.log("查询失败: " + error.code + " " + error.message);
    //   }
    // });

    
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;
    app = getApp();
    that.data.currentUserInfoInformation = app.globalData.currentUser;
  },
  onShow: function () {
    // 页面显示
    var that = this;
    app = getApp();
    that.data.currentUserInfoInformation = app.globalData.currentUser;
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
    //console.log(o)
    wx.previewImage({
      current: '',
      urls: [that.data.rows.get('imgurl')],
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

  },
  sendMessage: function (e) {
    var that = this;
    if (that.data.currentUserInfoInformation){
      if(that.data.messageInput){
        //console.log(that.data.messageInput);
        var LeaveMessage = Bmob.Object.extend("leave_message");
        var leaveMessage = new LeaveMessage();
        //console.log(that.data.currentUserInformation);
        leaveMessage.set("userOpenid", that.data.currentUserInfoInformation.openid);
        leaveMessage.set("messageContent", that.data.messageInput);
        leaveMessage.set("diaryObjectId", that.data.currentObjectId);
  
        var leaveMessageArrTemp = that.data.leaveMessageArr;
        leaveMessageArrTemp.push({
          "messageContent": that.data.messageInput,
          "messageUser": that.data.currentUserInfoInformation.nickName,
          "messagePic": that.data.currentUserInfoInformation.userPic 
        });
        leaveMessage.save(null, {
          success: function (result) {
            that.setData({
              messageInput:"",
              inputContent:"",
              leaveMessageArr: leaveMessageArrTemp
            })
          },
          error: function (result, error) {

          }
        });
      }
    }else{
      common.showModal("获取昵称和头像之后才能评论哦，请去我的选项中获取~~", "提示");
    }
  },
  userMessageInput:function(e){
    var that = this;
    that.setData({
      messageInput: e.detail.value
    })
  },
  userMessageFocus:function(e){
    var that = this;
    if(!that.data.messageInput){
      that.setData({
        messageInput: "",
        inputContent: ""
      })
    }
  },
  userMessageBlur:function(e){
    var that = this;
    
    if (!that.data.messageInput){
      that.setData({
        inputContent: "写评论"
      })
      
    }
  },
  pullUpLoad: function (e) {
    var that = this;
    var limit = that.data.limit + 2
    that.setData({
      limit: limit
    })
    that.onShow()
  },
  addCollection:function(e){
    // var that = this;

    // var LeaveMessage = Bmob.Object.extend("leave_message");
    // var leaveMessage = new LeaveMessage();
    // leaveMessage.set("userOpenid", that.data.currentUserInformation.openid);
    // currentUserInformation;
    // currentObjectId;
  }
})


