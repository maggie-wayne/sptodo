// miniprogram/pages/welcome/index.js
const app = getApp()

Page({
  data: {
    textAnimation: null,
    btnAnimation: null,
    textShow: true,
    btnShow: false
  },

  onLoad() {
    console.log('Welcome page: ', this)
    console.log('App(welcome): ', app)
  },

  onShow() {
    // 淡入
    this.animationControler('text', true)
      .then(() => {
        // 淡出
        this.animationControler('text', false)
          .then(() => {
            // btn 淡入
            this.setData({
              btnShow: true
            })
            this.animationControler('btn', true)
          })
      })
  },

  animationControler(cmp, show=true, time=1000) {

    const animation = wx.createAnimation({
      duration: time,
    })

    return new Promise((resolve, reject) => {
      animation.opacity(show ? 0 : 1).step()
      this.setData({
        [cmp + 'Animation']: animation.export()
      })

      setTimeout(() => {
        animation.opacity(show ? 1 : 0).step()
        this.setData({
          [cmp + 'Animation']: animation.export()
        })
  
        setTimeout(() => {
          resolve()
        }, time)
      }, time)
    })
  },

  onGotUserInfo(e) {
    const userInfo = e.detail.userInfo

    if (userInfo) {
      app.globalData.userInfo = userInfo
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  }
})