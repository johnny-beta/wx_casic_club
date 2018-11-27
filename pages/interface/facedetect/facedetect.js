// pages/index/detail/index.js
var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
const Bmob1 = require('../../../utils/Bmob-1.6.4.min.js')
var app = getApp();


Page({
  data: {
    faceScore: 77,
    faceFemaleScore: 78,
    faceMaleScore: 77,
    gender:'Female',
    currentUser: {},
    singleArray: ['请选择状态','单身汪', '配对成功', '你猜', '保密'],
    singleIndex: 0,
    currentTab: 2,//三个文件这里依次为0，1，2，其他地方一样,
    navbar: [
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
    ]
  },
  onShareAppMessage: function () { },
  onLoad: function (e) {
    var that = this;
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    }
    that.data.currentUser = app.globalData.currentUser;
    //初始化界面
    rectFace(that,"/image/meinv.jpg", {left:370, top:127, width:196, height:196});
    showScoreAnimation(that,77, 100);
    
  },
  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  preImg: function (o) {

  },
  chooseImage: function (e) {
    var that = this;
    if (!app.globalData.currentUser) {
      app.globalData.currentUser = Bmob1.User.current()
    };
    if (that.data.singleIndex == 0){
      common.showModal('请选择个人状态', "提示");
      return;
    }
    that.data.currentUser = app.globalData.currentUser;
    let openid = that.data.currentUser.openid;
    //console.log(that.data.currentUser);
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        //console.log(tempFilePaths);
        drawImage(tempFilePaths[0]);
        let newDate = new Date();
        let newDateStr = newDate.toLocaleDateString();
        if (tempFilePaths.length > 0) {
          var name = openid + "-" + newDateStr+".jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          
          file.save().then(function (res) {
            //console.log(res.url());
            faceRecognition(that,res.url(), tempFilePaths[0]);   
          }, function (error) {
            //console.log(error);
            common.showModal('上传图片失败', "提示");
          })
        }

      }
    })
  },
  bindPickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      singleIndex: e.detail.value
    })
  },
});
function saveBeautyData(that,imgUrl){
  //console.log(that.data);
  var BeautifulList = Bmob.Object.extend("beautiful_list");
  var beautifulList = new BeautifulList();
  beautifulList.set("unpraiseNum", 0);
  beautifulList.set("praiseNum", 0);
  beautifulList.set("single", that.data.singleArray[that.data.singleIndex]);
  beautifulList.set("beautifulPic", imgUrl);
  beautifulList.set("openid", that.data.currentUser.openid);
  beautifulList.set("score", that.data.faceScore);
  beautifulList.set("maleScore", that.data.faceMaleScore);
  beautifulList.set("femaleScore", that.data.faceFemaleScore);
  beautifulList.set("gender", that.data.gender);

  var User = Bmob.Object.extend("_User");
  var user = new User();
  user.id = that.data.currentUser.objectId;
  beautifulList.set("userDetail", user);
  //添加数据，第一个入口参数是null
  beautifulList.save(null, {
    success: function (result) {
      // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
      console.log('日记创建成功');
    },
    error: function (result, error) {
      // 添加失败
      console.log('创建日记失败');

    }
  });
  /*------------------------*/
  var BeautyRankingList = Bmob.Object.extend("beauty_ranking_list");
  var beautyRankingList = new Bmob.Query(BeautyRankingList);
  beautyRankingList.equalTo("openid", that.data.currentUser.openid);
  // 查询所有数据
  beautyRankingList.find({
    success: function (beautyRankingListResults) {
      if (beautyRankingListResults.length > 0){
        //更新数据
        //console.log(beautyRankingListResults[0].id);
        var BeautyRankingList1 = Bmob.Object.extend("beauty_ranking_list");
        var beautyRankingList1 = new Bmob.Query(BeautyRankingList1);

        beautyRankingList1.get(beautyRankingListResults[0].id, {
          success: function (beautyRankingList1Result) {
            beautyRankingList1Result.set("unpraiseNum", 0);
            beautyRankingList1Result.set("praiseNum", 0);
            beautyRankingList1Result.set("single", that.data.singleArray[that.data.singleIndex]);
            beautyRankingList1Result.set("beautifulPic", imgUrl);
            beautyRankingList1Result.set("openid", that.data.currentUser.openid);
            beautyRankingList1Result.set("score", that.data.faceScore);
            beautyRankingList1Result.set("maleScore", that.data.faceMaleScore);
            beautyRankingList1Result.set("femaleScore", that.data.faceFemaleScore);
            beautyRankingList1Result.set("gender", that.data.gender);
            beautyRankingList1Result.save();
          },
          error: function (object, error) {

          }
        });
      }else{
        //添加数据
        var BeautyRankingList2 = Bmob.Object.extend("beauty_ranking_list");
        var beautyRankingList2 = new BeautyRankingList2();
        beautyRankingList2.set("unpraiseNum", 0);
        beautyRankingList2.set("praiseNum", 0);
        beautyRankingList2.set("single", that.data.singleArray[that.data.singleIndex]);
        beautyRankingList2.set("beautifulPic", imgUrl);
        beautyRankingList2.set("openid", that.data.currentUser.openid);
        beautyRankingList2.set("score", that.data.faceScore);
        beautyRankingList2.set("maleScore", that.data.faceMaleScore);
        beautyRankingList2.set("femaleScore", that.data.faceFemaleScore);
        beautyRankingList2.set("gender", that.data.gender);

        var User = Bmob.Object.extend("_User");
        var user = new User();
        user.id = that.data.currentUser.objectId;
        beautyRankingList2.set("userDetail", user);
        //添加数据，第一个入口参数是null
        beautyRankingList2.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("日记创建成功, objectId:" + result.id);
          },
          error: function (result, error) {
            // 添加失败
            console.log('创建日记失败');

          }
        });
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  });
}
function faceRecognition(that,imgUrl,localImageUrl){
  wx.request({
  url: "https://api-cn.faceplusplus.com/facepp/v3/detect", //仅为示例，并非真实的接口地址
  data: {
    api_key: 'AmSvOUqbsEnnPYfsVtuZi1YmTI9VVTdg',
    api_secret: '03GxULLaakXKr-KClQs1wGwF5cBTcoyh',
    image_url: imgUrl,
    return_attributes: 'beauty,gender'
  },
  method: "POST",
  header: {
    'content-type': 'application/x-www-form-urlencoded' // 默认值
  },
  success(res) {
    //console.log(res.data);
    if (res.data.faces.length > 0){
      //console.log(res.data.faces[0]);
      //设前台页面数据，框出人脸
      that.setData({
        gender: res.data.faces[0].attributes.gender.value
      });
      if (res.data.faces[0].attributes.gender.value == "Male"){
        showScoreAnimation(that,res.data.faces[0].attributes.beauty.female_score, 100);
        that.setData({
          faceScore: res.data.faces[0].attributes.beauty.female_score
        });
      } else if (res.data.faces[0].attributes.gender.value == "Female"){
        showScoreAnimation(that,res.data.faces[0].attributes.beauty.male_score, 100);
        that.setData({
          faceScore: res.data.faces[0].attributes.beauty.male_score
        });
      };
      that.setData({
        faceFemaleScore: res.data.faces[0].attributes.beauty.female_score,
        faceMaleScore: res.data.faces[0].attributes.beauty.male_score
      });
      rectFace(that,localImageUrl,res.data.faces[0].face_rectangle);
      //保存数据
      saveBeautyData(that,imgUrl)
    }else{
      wx.hideToast();
      common.showModal('无法识别人脸，请换张图像', "提示");
    }
  }
})
}
function drawImage(imgUrl){
  wx.getImageInfo({
    src: imgUrl,
    success: function (res) {
      const ctx = wx.createCanvasContext('share_canvas')
      //console.log(res);
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let imageHeght = res.height;
      let imageWidth = res.width;
      let canvasScale = 285 / res.height;
      let canvasImageHeight = imageHeght * canvasScale;
      let canvasImageWidth = imageWidth * canvasScale;
      let offsetX = (windowWidth - canvasImageWidth) / 2;
      let offsetY = (285 - canvasImageHeight) / 2;
      ctx.drawImage(imgUrl, offsetX, 0, canvasImageWidth, canvasImageHeight);
      ctx.draw();
    },
    fail: function (res) {

    }
  });
}
function rectFace(that,imgUrl,face_rectangle){
  // console.log(face_rectangle);
  wx.getImageInfo({
    src: imgUrl,
    success: function (res) {
      const ctx = wx.createCanvasContext('share_canvas')
      let windowWidth = wx.getSystemInfoSync().windowWidth;
      let imageHeght = res.height;
      let imageWidth = res.width;
      let canvasScale = 285 / res.height;
      let canvasImageHeight = imageHeght * canvasScale;
      let canvasImageWidth = imageWidth * canvasScale;
      let offsetX = (windowWidth - canvasImageWidth) / 2;
      let offsetY = (285 - canvasImageHeight) / 2;
      ctx.drawImage(imgUrl, offsetX, 0, canvasImageWidth, canvasImageHeight);
      ctx.setStrokeStyle('red');
      ctx.strokeRect(offsetX + (face_rectangle.left * canvasScale), offsetY + (face_rectangle.top * canvasScale), face_rectangle.width * canvasScale, face_rectangle.height * canvasScale);
      ctx.draw();
      wx.hideToast();
    },
    fail: function (res) {

    }
  });
}
function showScoreAnimation(that,rightItems, totalItems) {
  /*
  cxt_arc.arc(x, y, r, sAngle, eAngle, counterclockwise);
  x	                    Number	  圆的x坐标
  y	                    Number	  圆的y坐标
  r	                    Number	  圆的半径
  sAngle	            Number	  起始弧度，单位弧度（在3点钟方向）
  eAngle	            Number	  终止弧度
  counterclockwise	    Boolean	  可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
  */
  let copyRightItems = 0;
  that.setData({
    timer: setInterval(function () {
      copyRightItems++;
      if (copyRightItems >= rightItems) {
        clearInterval(that.data.timer)
      } else {
        // 页面渲染完成
        // 这部分是灰色底层
        let cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
        cxt_arc.setLineWidth(6);//绘线的宽度
        cxt_arc.setStrokeStyle('#d2d2d2');//绘线的颜色
        cxt_arc.setLineCap('round');//线条端点样式
        cxt_arc.beginPath();//开始一个新的路径
        cxt_arc.arc(53, 53, 50, 0, 2 * Math.PI, false);//设置一个原点(53,53)，半径为50的圆的路径到当前路径
        cxt_arc.stroke();//对当前路径进行描边
        //这部分是蓝色部分
        cxt_arc.setLineWidth(6);
        cxt_arc.setStrokeStyle('#3ea6ff');
        cxt_arc.setLineCap('round')
        cxt_arc.beginPath();//开始一个新的路径
        cxt_arc.arc(53, 53, 50, -Math.PI * 1 / 2, 2 * Math.PI * (copyRightItems / totalItems) - Math.PI * 1 / 2, false);
        cxt_arc.stroke();//对当前路径进行描边
        cxt_arc.draw();
      }
    }, 20)
  })
}