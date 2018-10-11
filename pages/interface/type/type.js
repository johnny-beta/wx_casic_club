//index.js
//获取应用实例
var Bmob = require('../../../utils/bmob.js');
var common = require('../../..//utils/common.js');
var app = getApp();
var that;
var typeNumber;
var imageExistFlag = true;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 15,
    diaryList: [],
    modifyDiarys: false,
    urlArr:[],
    typeName:"",
    scrollTop: 0 ,
    contentNum: 0
  },
  onReady: function(e) {},
  onShareAppMessage: function() {},
  onLoad: function (options) {
    that = this;
    typeNumber = options.typeNumber;

    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
    that.setData({
      typeName: options.typeName
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
  toAddDiary: function() {
    //console.log(app.globalData.userInfo);
    if(app.globalData.userInfo){
      that.setData({
        writeDiary: true
      })
    }else{
      common.showModal("获得用户昵称才可以发布信息哦！请去我的选项中点击获取头像昵称")
    }
  },
  addDiary: function(event) {
    var title = event.detail.value.title;
    var content = event.detail.value.content;
    var formId = event.detail.formId;
    if (this.data.urlArr)
    var urlArr = this.data.urlArr
    var imgurl = urlArr[0].url
    //console.log("event", event)
    if (!title) {
      common.showTip("标题不能空", "loading");
    } else if (!content) {
      common.showTip("内容不能空", "loading");
    } else if (!app.globalData.currentUser.openid) {
      common.showTip("请重启小程序", "loading");
    } else {
      that.setData({
        loading: true
      })
      var currentUser = Bmob.User.current();

      var User = Bmob.Object.extend("_User");
      var UserModel = new User();

      //增加信息
      var Diary = Bmob.Object.extend("diary");
      var diary = new Diary();
      var typeNumberTemp = parseInt(typeNumber);
      diary.set("title", title);
      diary.set("formId", formId); //保存formId
      diary.set("content", content);
      diary.set("imgurl", imgurl);
      diary.set("type", typeNumberTemp);
      diary.set("openid", app.globalData.currentUser.openid); 
      diary.set("isNew", true); 
      diary.set("isDisplay", true); 
      diary.set("praiseNum", 0); 
      diary.set("leaveMessageCount", 0); 
      diary.set("count", 0); 

      var f = Bmob.File("a.jpg", [""]);
      diary.set("f", f);
      if (currentUser) {
        UserModel.id = currentUser.id;
        diary.set("own", UserModel);
      }
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function(result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          common.showTip('添加信息成功');
          that.setData({
            writeDiary: false,
            loading: false
          })

          var currentUser = Bmob.User.current();
          that.onShow()
        },
        error: function(result, error) {
          // 添加失败
          common.showTip('添加信息失败，请重新发布', 'loading');

        }
      });
    }

  },
  closeLayer: function() {
    that.setData({
      writeDiary: false
    })
  },
  deleteDiary: function(event) {

    var that = this;

    var objectId = event.target.dataset.id;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除要信息？',
      success: function(res) {
        if (res.confirm) {
          //删除信息
          var Diary = Bmob.Object.extend("diary");


          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Diary);
          query.get(objectId, {
            success: function(object) {
              // The object was retrieved successfully.
              object.destroy({
                success: function(deleteObject) {
                  console.log('删除信息成功');
                  getList(that)
                },
                error: function(object, error) {
                  console.log('删除信息失败');
                }
              });
            },
            error: function(object, error) {
              console.log("query object fail");
            }
          });
        }
      }
    })
  },
  toModifyDiary: function(event) {
    var nowTile = event.target.dataset.title;
    var nowContent = event.target.dataset.content;
    var nowId = event.target.dataset.id;
    that.setData({
      modifyDiarys: true,
      nowTitle: nowTile,
      nowContent: nowContent,
      nowId: nowId
    })
  },
  modifyDiary: function(e) {
    var t = this;
    modify(t, e)
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
    //console.log(e.detail.value);
    getList(this, e.detail.value);
    
    this.setData({
      inputVal: e.detail.value
    });
  },
  closeAddLayer: function() {
    that.setData({
      modifyDiarys: false
    })
  },
  chooseImage: function(e) {
    var that = this;
    if (imageExistFlag == true){
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          //wx.showNavigationBarLoading()
          
          var urlArr = new Array();
          // var urlArr={};
          var tempFilePaths = res.tempFilePaths;
          //console.log(tempFilePaths)
          var imgLength = tempFilePaths.length;
          if (imgLength > 0) {
            var newDate = new Date();
            var newDateStr = newDate.toLocaleDateString();

            var j = 0;
            for (var i = 0; i < imgLength; i++) {
              var tempFilePath = [tempFilePaths[i]];
              var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
              if (extension) {
                extension = extension[1].toLowerCase();
              }
              var name = newDateStr + "." + extension;//上传的图片的别名      

              var file = new Bmob.File(name, tempFilePath);
              imageExistFlag = false;
              file.save().then(function (res) {
                //console.log(res)
                // return
                wx.hideNavigationBarLoading()
                var url = res.url();
                console.log("第" + i + "张Url" + url);

                urlArr.push({ "url": url });
                j++;
                console.log(j, imgLength);
                // if (imgLength == j) {
                //   console.log(imgLength, urlArr);
                //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                showPic(urlArr, that)
                imageExistFlag = true;
                // }

              }, function (error) {
                console.log(error)
              });

            }

          }

        }
      })
    }
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  contentInput:function(e){
    this.setData({
      contentNum: e.detail.value.length
    });
  }

})


//上传完成后显示图片
function showPic(urlArr, t) {
  t.setData({
    //loading: true,
    urlArr: urlArr
  })
}

/*
 * 获取数据
 */
function getList(t, k) {
  that = t;
  var Diary = Bmob.Object.extend("diary");
  
  
  //会员模糊查询
  

  //普通会员匹配查询
  // if(k){
  //   //console.log(k)
  //   query.equalTo("title", k);
  // }

  
  
  //query.equalTo("type", "==", 1);
  //query.limit(that.data.limit);
  
  //console.log(k);
  if(k){
    var query1 = new Bmob.Query(Diary);
    query1.equalTo("title", { "$regex": "" + k + ".*" });
    //query1.equalTo("title", k);
    var query2 = new Bmob.Query(Diary);
    query2.equalTo("content", {"$regex": "" + k + ".*"});
    //query2.equalTo("content", k);
    var mainQuery = Bmob.Query.or(query1, query2);
  }else{
    var query = new Bmob.Query(Diary);
    var mainQuery = query;
  }
  
  var typeNumberTemp = parseInt(typeNumber);
  mainQuery.equalTo("type", typeNumberTemp);
  mainQuery.descending('isDisplay');
  mainQuery.descending('createdAt');
  

  mainQuery.find({
    success: function(results) {
      // 循环处理查询到的数据
      //console.log(results);
      that.setData({
        diaryList: results
      })
    },
    error: function(error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}



function modify(t, e) {
  var that = t;
  //修改信息
  var modyTitle = e.detail.value.title;
  var modyContent = e.detail.value.content;
  var objectId = e.detail.value.content;
  var thatTitle = that.data.nowTitle;
  var thatContent = that.data.nowContent;
  if ((modyTitle != thatTitle || modyContent != thatContent)) {
    if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    } else {
      //console.log(modyContent)
      var Diary = Bmob.Object.extend("diary");
      var query = new Bmob.Query(Diary);
      // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
      query.get(that.data.nowId, {
        success: function(result) {

          // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
          result.set('title', modyTitle);
          result.set('content', modyContent);
          result.save();
          common.showTip('信息修改成功', 'success', function() {
            that.onShow();
            that.setData({
              modifyDiarys: false
            })
          });

          // The object was retrieved successfully.
        },
        error: function(object, error) {

        }
      });
    }
  } else if (modyTitle == "" || modyContent == "") {
    common.showTip('标题或内容不能为空', 'loading');
  } else {
    that.setData({
      modifyDiarys: false
    })
    common.showTip('修改成功', 'loading');
  }



}