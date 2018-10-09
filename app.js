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
    this.checkUpdate();    
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
    //checkNewMessage();
    
  },

  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启小程序！',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            //wx.clearStorage()
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
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
    version: '1.5.2',
    grids: {
      "10": "国庆-晒照专区",
      "11": "国庆-意见征集",
      "1": "航天置换",
      "2": "航天漫步",
      "3": "航天宝贝",
      "4": "房屋租售",
      "5": "鹊桥征友",
      "6": "拼车出行"
    },
    userInfo: null,
    currentUser:Bmob1.User.current(),
  }
})
// function checkNewMessage(){
//   try{
//     var newMessageIDArr = new Array();
//     var currentUser = Bmob1.User.current();
//     var Diary = Bmob.Object.extend("diary");
//     var query = new Bmob.Query(Diary);
//     query.equalTo("openid", currentUser.openid);
//     // 查询所有数据
//     query.find({
//       success: function (results) {

//         for (var i = 0; i < results.length; i++) {
//           var localLeaveMessageCount = wx.getStorageSync(results[i].id);
//           //newMessageIDArr.push(results[i].id);
          
//           if (localLeaveMessageCount != results[i].attributes.leaveMessageCount) {
//             newMessageIDArr.push(results[i].id);
//           }

//           if (localLeaveMessageCount == "") {
//             try {
//               // 同步接口立即写入
//               wx.setStorageSync(results[i].id, results[i].attributes.leaveMessageCount);
//               console.log("第0次写入成功");
//             } catch (e) {
//               console.log("第0次写入失败");
//             }
//           }
//           //console.log(localLeaveMessageCount);
//           //console.log(results[i].attributes.leaveMessageCount);
//         }
//         if (newMessageIDArr.length > 0){
//           wx.showTabBarRedDot({
//             index: 3
//           })
//         }
//         try {
//           // 同步接口立即写入
//           wx.setStorageSync("newMessageIDArr", newMessageIDArr);
//           console.log("第一次写入成功");
//         } catch (e) {
//           console.log("第一次写入失败");
//         }
//       },
//       error: function (error) {
//         console.log("查询失败: " + error.code + " " + error.message);
//       }
//     });
//   }catch(e){
//     console.log("获取留言信息失败，可能因为没有获取用户信息");
//   }
// }