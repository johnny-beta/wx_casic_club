//index.js
//获取应用实例
var Bmob = require('../../utils/bmob.js');
var common = require('../../utils/common.js');
var app = getApp();
var that;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 15,
    diaryList: [],
    modifyDiarys: false,
    urlArr: [{url:''}]
  },
  onReady: function(e) {},
  onShareAppMessage: function() {},
  onLoad: function() {
    that = this;
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })

  },
  noneWindows: function() {
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function() {
    getList(this);
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  pullUpLoad: function(e) {
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    getList(this);
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    getList(this);
  },
  inputTyping: function(e) {
    //搜索数据
    getList(this, e.detail.value);
  },
  closeAddLayer: function() {
    that.setData({
      modifyDiarys: false
    })
  }
})

/*
 * 获取数据
 */
function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("diary");
  var query = new Bmob.Query(Diary);
  var query1 = new Bmob.Query(Diary);

  //会员模糊查询
  /*
  if (k) {
    query.equalTo("title", {
      "$regex": "" + k + ".*"
    });
    query1.equalTo("content", {
      "$regex": "" + k + ".*"
    });
    

  } */
  //普通会员匹配查询
  if(k){
    //console.log(k)
    query.equalTo("title", k);
  }

  query.descending('createdAt');
  //query.include("own")
  // 查询所有数据
  query.limit(that.data.limit);

  //var mainQuery = Bmob.Query.or(query, query1);
  var mainQuery= query
  mainQuery.find({
    success: function(results) {
      // 循环处理查询到的数据
      that.setData({
        diaryList: results
      })
    },
    error: function(error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}


