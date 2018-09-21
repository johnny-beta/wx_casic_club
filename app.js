//app.js

var Bmob = require('utils/bmob.js')


// var BmobSocketIo = require('utils/bmobSocketIo.js').BmobSocketIo;
// const BmobSocketIo = require('utils/tunnel');
Bmob.initialize(
  '0bfe14d135afa2dd2abf54bb979ef145',
  'ce5c1c19a568921b07474e04839915d3'
)

// Bmob.initialize("983bc08c5a6d2e9bafa83b2c550a8175", "1a388a666e3bf56dedbcdd9d54a60e11");

App({
  onLaunch: function () {
    var user = new Bmob.User() //开始注册用户
    user.auth().then(function (obj) {
      console.log('登陆成功')
    },
    function (err) {
        console.log('失败了', err)
    });
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == 'function' && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == 'function' && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
