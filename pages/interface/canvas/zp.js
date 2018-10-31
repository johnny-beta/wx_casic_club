
/**
 * 大转盘抽奖
 */
var app = getApp();
var lotteryCount = 0;
var hbbPrize = "没有奖品";
var shareCount = 0;
var choujiangCount = 0;


var app = getApp();

Page({

  //奖品配置
  awardsConfig: {
    chance: true,
    awards: [

      { 'index': 0, 'name': '杯子+笔筒' },
      { 'index': 1, 'name': '杯子' },
      { 'index': 2, 'name': '小钱包' },
      { 'index': 3, 'name': '小钱包+笔筒' },
      { 'index': 4, 'name': '笔筒*2' },
      { 'index': 5, 'name': '空手而归' }
    ]
  },

  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    lotteryCount:1,
    hbbPrize:"没有奖品"
  },
  onShow: function(){
    var that = this;
    let lotteryCountFlag = false;
    try {
      const res = wx.getStorageInfoSync()
      //console.log(res.keys)
      for (let i = 0; i < res.keys.length; i++) {
        //console.log(res.keys);
        if (res.keys[i] == "shareCount") {
          lotteryCountFlag = true;
          //console.log("55555555555555");
        }
      }
    } catch (e) {
      console.log("获取本地内存key出错");
    }
    if (!lotteryCountFlag){
      //console.log("6666666666666");

      wx.setStorage({
        key: "shareCount",
        data: 0
      });
      wx.setStorage({
        key: "choujiangCount",
        data: 0
      });
    } else if (lotteryCountFlag){
      //console.log("33333333333333333");
      wx.getStorage({
        key: 'choujiangCount',
        success(res) {
          //console.log(res.data)
          choujiangCount = res.data;
        }
      });
      wx.getStorage({
        key: 'shareCount',
        success(res) {
          //console.log(res.data)
          shareCount = res.data;
          lotteryCount = (shareCount + 1 - choujiangCount);
          that.setData({
            lotteryCount: lotteryCount
          });
          
        }
      });
      wx.getStorage({
        key: 'hbbPrize',
        success(res) {
          //console.log(res.data)
          hbbPrize = res.data;
          that.setData({
            hbbPrize: hbbPrize
          });     
        }
      })
    }
  },
  onReady: function (e) {
    var that = this;
    that.drawAwardRoundel();
  },

  onReady: function (e) {
    var that = this;
    this.drawAwardRoundel();

    wx.showShareMenu({
      withShareTicket: true
    });
    if ((shareCount + 1 - choujiangCount) <= 0) {
      that.setData({
        btnDisabled: 'disabled'
      });
    }
  },

  //画抽奖圆盘
  drawAwardRoundel: function () {
    var awards = this.awardsConfig.awards;
    var awardsList = [];
    var turnNum = 1 / awards.length;  // 文字旋转 turn 值

    // 奖项列表
    for (var i = 0; i < awards.length; i++) {
      awardsList.push({ turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awards[i].name });
    }

    this.setData({
      btnDisabled: this.awardsConfig.chance ? '' : 'disabled',
      awardsList: awardsList
    });
  },

  //发起抽奖
  playReward: function () {
    var that = this;
    if ((shareCount + 1 - choujiangCount) <= 0){
      wx.showModal({
        title: '提示',
        content: '您已没有抽奖次数',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }
    //减少抽奖次数
    choujiangCount++;
    
    wx.setStorage({
      key: "choujiangCount",
      data: choujiangCount
    })
    that.setData({
      lotteryCount: shareCount + 1 - choujiangCount
    });
    //中奖index
    var awardIndex = 0;
    //--------计算概率-----------//
    let randomNum = Math.round(Math.random() * 100)
    console.log(randomNum);
    if (randomNum >= 0 && randomNum < 10){
      awardIndex = 0;
    } else if (randomNum >= 10 && randomNum <20 ){
      awardIndex = 1;
    }else if (randomNum >= 20 && randomNum < 45) {
      awardIndex = 2;
    }else if (randomNum >= 45 && randomNum <70 ) {
      awardIndex = 3;
    }else if (randomNum >= 70 && randomNum <= 95) {
      awardIndex = 4;
    }else if (randomNum >= 95 && randomNum < 100 ) {
      awardIndex = 5;
    }
    console.log(awardIndex);
    //中奖index
    var awardIndex = awardIndex;
    var runNum = 8;//旋转8周
    var duration = 4000;//时长

    // 旋转角度
    this.runDeg = this.runDeg || 0;
    this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))
    //创建动画
    var animationRun = wx.createAnimation({
      duration: duration,
      timingFunction: 'ease'
    })
    animationRun.rotate(this.runDeg).step();
    this.setData({
      animationData: animationRun.export(),
      btnDisabled: 'disabled'
    });

    // 中奖提示
    var awardsConfig = this.awardsConfig;
    setTimeout(function () {
      wx.setStorage({
        key: "hbbPrize",
        data: awardsConfig.awards[awardIndex].name
      })
      that.setData({
        hbbPrize: awardsConfig.awards[awardIndex].name
      });
      wx.showModal({
        title: '恭喜',
        content: '获得' + (awardsConfig.awards[awardIndex].name),
        showCancel: false
      });
      if ((shareCount + 1 - choujiangCount) <= 0) {
        that.setData({
          btnDisabled: 'disabled'
        });
      }else{
        that.setData({
          btnDisabled: ''
        });
      }
    }.bind(that), duration);

  },
  returnHome: function () {
    wx.switchTab({
      url: '/pages/interface/interface',
    })
  },
  onShareAppMessage: function (res) {
    let that = this
    return {
      title: '航帮帮抽奖-送送送~~',
      path: 'pages/interface/canvas/zp',
      success: function (res) {
        //getSystemInfo是为了获取当前设备信息，判断是android还是ios，如果是android
        //还需要调用wx.getShareInfo()，只有当成功回调才是转发群，ios就只需判断shareTickets
        //获取用户设备信息
        wx.getSystemInfo({
          success: function (d) {
            console.log(d);
            //判断用户手机是IOS还是Android
            if (d.platform == 'android') {
              wx.getShareInfo({//获取群详细信息
                shareTicket: res.shareTickets,
                success: function (res) {
                  //这里写你分享到群之后要做的事情，比如增加次数什么的
                  shareCount++;
                  if (shareCount >= 2)
                    shareCount = 2;
                  wx.setStorage({
                    key: "shareCount",
                    data: shareCount
                  })
                  if ((shareCount + 1 - choujiangCount) > 0){
                    that.setData({
                      lotteryCount: (shareCount + 1 - choujiangCount),
                      btnDisabled: ''
                    });
                  }
                },
                fail: function (res) {//这个方法就是分享到的是好友，给一个提示
                  wx.showModal({
                    title: '提示',
                    content: '分享好友无效，请分享群',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }
            if (d.platform == 'ios') {//如果用户的设备是IOS
              if (res.shareTickets != undefined) {
                console.log("分享的是群");
                wx.getShareInfo({
                  shareTicket: res.shareTickets,
                  success: function (res) {
                    //分享到群之后你要做的事情
                    shareCount++;
                    if (shareCount >= 2)
                      shareCount = 2;
                    wx.setStorage({
                      key: "shareCount",
                      data: shareCount
                    })
                    if ((shareCount + 1 - choujiangCount) > 0) {
                      that.setData({
                        lotteryCount: (shareCount + 1 - choujiangCount),
                        btnDisabled: ''
                      });
                    }
                  }
                })

              } else {//分享到个人要做的事情，我给的是一个提示
                console.log("分享的是个人");
                wx.showModal({
                  title: '提示',
                  content: '分享好友无效，请分享群',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              }
            }

          },
          fail: function (res) {

          }
        })
      }

    }
  },

})
