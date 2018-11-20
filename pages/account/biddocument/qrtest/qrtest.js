// pages/account/biddocument/qrtest/qrtest.js
var QRCode = require('../../../../utils/weapp-qrcode.js')
var Bmob = require('../../../../utils/bmob.js');
var qrcode;

Page({
  data: {
    text: '',
    image: ''
  },
  onLoad: function (options) {
    console.log(options);
    //let qrId = randomWord(false,12);
    let qrId = randomWord(false, 20);
    console.log(qrId);
    var BidDocument = Bmob.Object.extend("bid_document");
    var bidDocument = new BidDocument();
    bidDocument.set("qrID", qrId);
    bidDocument.set("toubiaoren", options.toubiaoren);
    bidDocument.set("mingcheng", options.mingcheng);
    bidDocument.set("leixing", options.leixing);
    bidDocument.set("fadingdaibiaoren", options.fadingdaibiaoren);
    bidDocument.set("bianma", options.bianma);
    bidDocument.set("choosedate", options.choosedate);
    bidDocument.set("weituodailiren", options.weituodailiren);

    if (options.src) {
      var name = options.src //上传图片的别名
      let imageSrc = [options.src]
      var file = new Bmob.File(name, imageSrc);

      file.save().then(function (res) {
        bidDocument.set("image", res.url());
        bidDocument.save(null, {
          success: function (result) {
            // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("日记创建成功, objectId:" + result.id);
            qrcode = new QRCode('canvas', {
              // usingIn: this,
              text: qrId,
              width: 150,
              height: 150,
              colorDark: "#000000",
              colorLight: "white",
              correctLevel: QRCode.CorrectLevel.H,
            });
          },
          error: function (result, error) {
            // 添加失败
            console.log('创建日记失败');

          }
        });
      }, function (error) {
        console.log(error);
        common.showModal('上传图片失败', "提示");
      })    
    }else{
      bidDocument.save(null, {
        success: function (result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
          console.log("日记创建成功, objectId:" + result.id);
          qrcode = new QRCode('canvas', {
            // usingIn: this,
            text: qrId,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "white",
            correctLevel: QRCode.CorrectLevel.H,
          });
        },
        error: function (result, error) {
          // 添加失败
          console.log('创建日记失败');

        }
      });
    }
    //添加数据，第一个入口参数是null
    

  },
  confirmHandler: function (e) {
    var value = e.detail.value
    qrcode.makeCode(value)
  },
  inputHandler: function (e) {
    var value = e.detail.value
    this.setData({
      text: value
    })
  },
  tapHandler: function () {
    // 传入字符串生成qrcode
    qrcode.makeCode(this.data.text)
  },
  // 长按保存
  save: function () {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path,
            })
          })
        }
      }
    })
  },
  
})
/*
** randomWord 产生任意长度随机字母数字组合
** randomFlag 是否任意长度 min 任意长度最小位[固定位数] max 任意长度最大位
*/

function randomWord(randomFlag, min, max) {
  let str = "",
    range = min,
    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;// 任意长度
  }
  for (let i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}