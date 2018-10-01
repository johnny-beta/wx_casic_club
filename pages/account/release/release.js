//index.js
//获取应用实例
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
var app = getApp();
var that;
Page({
  data: {
    writeDiary: false,
    loading: false,
    windowHeight: 0,
    windowWidth: 0,
    limit: 10,
    userInfo: {},
    diaryList: {},
    urlArr: [],
    modifyDiarys: false
  },
  onLoad: function () {
    app = getApp();
    var that = this;
    if (app.globalData.userInfo){
      that.setData({     
        userInfo: app.globalData.userInfo
      })
    }else{
      common.showModal('请先获取头像和昵称', "提示");
    }
  },
  noneWindows: function () {
    var that = this;
    that.setData({
      writeDiary: "",
      modifyDiarys: ""
    })
  },
  onShow: function () {
    app = getApp();
    //console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      var that = this;
      var objectId;
      var openid = app.globalData.currentUser.openid;
      //objectId = currentUser.id;
      var Diary = Bmob.Object.extend("diary");
      var query = new Bmob.Query(Diary);
      
      query.equalTo("openid", openid);
      query.descending('createdAt');

      // 查询所有数据
      query.find({
        success: function (results) {
          //console.log(results);
          that.setData({
            diaryList: results
          })
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      });
      wx.getSystemInfo({

        success: (res) => {
          that.setData({
            windowHeight: res.windowHeight,
            windowWidth: res.windowWidth
          })
        }
      })
    } else {
      common.showModal('请先获取头像和昵称', "提示");
    }
    ;

  },
  pullUpLoad: function (e) {
    console.log(e);
    var limit = that.data.limit + 2
    this.setData({
      limit: limit
    })
    this.onShow()
  },
  toAddDiary: function () {
    that.setData({
      writeDiary: true
    })
  },
  closeLayer: function () {
    that.setData({
      writeDiary: false
    })
  },
  switchClickView:function(){
    
  },
  switchClick: function (event) {
    var status = event.detail.value;
    var objectId = event.target.dataset.id;

    var Diary = Bmob.Object.extend("diary");
    var queryDiary = new Bmob.Query(Diary);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    queryDiary.equalTo("objectId", objectId);
    queryDiary.find({
      success: function (results) {
        var isDisplay = results[0].attributes.isDisplay;
        queryDiary.get(objectId, {
          success: function (resultDiary) {
            if (status == true) {
              resultDiary.set('isDisplay', true);
              common.showTip('信息已发布');
            } else if (status == false) {
              resultDiary.set('isDisplay', false);
              common.showModal('该信息已失效',"提示");
            }
            resultDiary.save();
          },
          error: function (object, error) {

          }
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },
  isDisplay: function (event){
    var objectId = event.target.dataset.id;
    var Diary = Bmob.Object.extend("diary");
    var queryDiary = new Bmob.Query(Diary);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    queryDiary.equalTo("objectId", objectId);
    queryDiary.find({
      success: function (results) {
        var isDisplay = results[0].attributes.isDisplay;
        queryDiary.get(objectId, {
          success: function (resultDiary) {
            if(isDisplay == true){
              resultDiary.set('isDisplay', false);  
              common.showTip('信息已失效');
            }else if(isDisplay == false){
              resultDiary.set('isDisplay', true);
              common.showTip('信息已重新发布');
            }
            resultDiary.save();
          },
          error: function (object, error) {

          }
        });
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    
  },
  deleteDiary1: function (event) {
    common.showTip('该功能目前没有开放');
  },
  deleteDiary: function (event) {
    var objectId = event.target.dataset.id;
    wx.showModal({
      title: '操作提示',
      content: '确定要删除要日记？',
      success: function (res) {
        if (res.confirm) {
          //删除日记
          var Diary = Bmob.Object.extend("diary");
          //创建查询对象，入口参数是对象类的实例
          var query = new Bmob.Query(Diary);
          query.equalTo("objectId", objectId);
          query.destroyAll({
            success: function () {
              common.showTip('删除日记成功');
              that.onShow();
            },
            error: function (err) {
              common.showTip('删除日记失败', 'loading');
            }
          });
        }
      }
    })
  },
  toModifyDiary: function (event) {
    var that = this;
    var nowTile = event.target.dataset.title;
    var nowContent = event.target.dataset.content;
    var nowId = event.target.dataset.id;
    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    var urlArr = new Array();
    nowContent = nowContent + " ";
    query.get(nowId, {
      success: function (result) {

        //console.log(result.attributes.imgurl);
        urlArr.push({ "url": result.attributes.imgurl });
        showPic(urlArr, that);

      },
      error: function (object, error) {

      }
    });
    that.setData({
      modifyDiarys: true,
      nowTitle: nowTile,
      nowContent: nowContent,
      nowId: nowId
    })
  },
  modifyDiary: function (e) {
    //修改日记
    var that = this;
    var modyTitle = e.detail.value.title;
    var modyContent = e.detail.value.content;
    var objectId = e.detail.value.content;
    var thatTitle = that.data.nowTitle;
    var thatContent = that.data.nowContent;
    var urlArr = this.data.urlArr
    var imgurl = urlArr[0].url
    if ((modyTitle != thatTitle || modyContent != thatContent)) {
      if (modyTitle == "" || modyContent == "") {
        common.showTip('标题或内容不能为空', 'loading');
      }
      else {
        //console.log(modyContent)
        var Diary = Bmob.Object.extend("diary");
        var query = new Bmob.Query(Diary);
        // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
        query.get(that.data.nowId, {
          success: function (result) {

            // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
            result.set('title', modyTitle);
            result.set('content', modyContent);
            //console.log(imgurl);
            if (imgurl)
              result.set("imgurl", imgurl);
            result.save();
            common.showTip('日记修改成功', 'success', function () {
              that.onShow();
              that.setData({
                modifyDiarys: false
              })
            });

            // The object was retrieved successfully.
          },
          error: function (object, error) {

          }
        });
      }
    }
    else if (modyTitle == "" || modyContent == "") {
      common.showTip('标题或内容不能为空', 'loading');
    }
    else {
      that.setData({
        modifyDiarys: false
      })
      common.showTip('修改成功', 'loading');
    }
  },
  closeAddLayer: function () {
    that.setData({
      modifyDiarys: false
    })
  },
  chooseImage: function (e) {
    var that = this;
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
              showPic(urlArr, that);
        
              // }

            }, function (error) {
              console.log(error)
            });

          }

        }

      }
    })
  },
  skipDetail:function(e){
    console.log(e);
  }

})
//上传完成后显示图片
function showPic(urlArr, t) {
  t.setData({
    //loading: true,
    urlArr: urlArr
  })
}
