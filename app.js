const Bmob = require('utils/bmob.js') 
const Bmob1 = require('utils/Bmob-1.6.4.min.js') 
Bmob.initialize(
  '0bfe14d135afa2dd2abf54bb979ef145',
  'ce5c1c19a568921b07474e04839915d3'
)
Bmob1.initialize(
  '0bfe14d135afa2dd2abf54bb979ef145',
  'ce5c1c19a568921b07474e04839915d3'
)

App({
  onLaunch: function () {
    wx.login({
      success: res => {
        if (res.code) {
          Bmob1.User.auth().then(res => {
            console.log('一键登陆成功')
          }).catch(err => {
            console.log(err)
          });
          Bmob1.User.requestOpenId(res.code, { 
            success: function (userData) {
              console.log(userData)
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo
                  var nickName = userInfo.nickName

                  var user = new Bmob.User(); //开始注册用户
                  user.set("username", nickName);
                  user.set("password", userData.openid); //因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
                  user.set("userData", userData);
                  user.signUp(null, {
                    success: function (res) {
                      console.log("注册成功!");
                    },
                    error: function (userData, error) {
                      console.log(error)
                    }
                  });
                }
              })
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
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
    userInfo: null,
    currentUser:Bmob1.User.current()
  }
})
