var Bmob = require('../../../utils/bmob.js');
var common = require('../../../utils/common.js');
let app = getApp();
var myDate = new Date();
//格式化日期
function formate_data(myDate) {
  let month_add = myDate.getMonth() + 1;
  var formate_result = myDate.getFullYear() + '-'
    + month_add + '-'
    + myDate.getDate()
  return formate_result;
}
Page({
  data: {
    date: formate_data(myDate),
    src:"",
    types: ["军品", "民品"],
    typeIndex: "0",
    isAgree: false,
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e);
    //let { phone, pwd, isPub, sex } = e.detail.value;
    console.log(this.data.types[this.data.typeIndex]);
    if(!this.data.isAgree){
      common.showModal('请确认投标须知', "提示");
      return;
    }
    if (e.detail.value.bianma && e.detail.value.fadingdaibiaoren && e.detail.value.mingcheng && e.detail.value.toubiaoren && e.detail.value.weituodailiren){
      wx.navigateTo({
        url: "/pages/account/biddocument/qrtest/qrtest?bianma=" + e.detail.value.bianma + "&fadingdaibiaoren=" + e.detail.value.fadingdaibiaoren + "&weituodailiren=" + e.detail.value.weituodailiren + "&leixing=" + this.data.types[this.data.typeIndex] + "&mingcheng=" + e.detail.value.mingcheng + "&toubiaoren=" + e.detail.value.toubiaoren + "&choosedate=" + this.data.date + "&src=" + this.data.src,
      });
      // wx.request({
      //   url: "https://hbb.htxytech.cn/py/bidDocument", //仅为示例，并非真实的接口地址
      //   data: {
      //     bianma: e.detail.value.bianma,
      //     fadingdaibianren: e.detail.value.fadingdaibiaoren,
      //     leixing: e.detail.value.leixing,
      //     mingcheng: e.detail.value.mingcheng,
      //     toubianren: e.detail.value.toubiaoren
      //   },
      //   method: 'POST',
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   success(res) {
      //     console.log(res.data)
      //   }
      // })
    }else{
      common.showModal('请完善信息', "提示");
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  uploadPic: function () {//选择图标
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        that.setData({
          isSrc: true,
          src: tempFilePaths
        })
      }
    })
  },
  clearPic: function () {//删除图片
    var that = this;
    that.setData({
      isSrc: false,
      src: ""
    })
  },
  bindTypeChange: function (e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length,
    });
  },
  tapNotice: function (e) {
    if (e.target.id == 'notice') {
      this.hideNotice();
    }
  },
  showNotice: function (e) {
    this.setData({
      'notice_status': true
    });
  },
  hideNotice: function (e) {
    this.setData({
      'notice_status': false
    });
  },
})

