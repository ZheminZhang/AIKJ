var util = require('../../utils/util.js')
var config = require('../../config/config.js')

// 获取全局唯一的语音识别管理器
const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()

Page({
  data: {
    tabitemVoice: {},
    tabitemForm: {},
    activeTabId: null,

    /* 语音识别信息 */
    currentText: "",      //识别内容
    isClick:false,
    /* 记账相关信息 */
    summary: null,   //分类信息
    debit: "",            //借方科目
    debitAmount: null,    //借方金额
    credit: "",           //贷方科目
    creditAmount: null,   //贷方金额
    date: "",       //日期
  },

  tabChange(e) {
    if (e.detail.source == "touch") {
      var id = e.detail.currentItemId;
      this.setActiveTab(id);
    }
  },

  tabclick(e) {
    var id = e.target.id;
    this.setActiveTab(id);
  },

  setActiveTab(id) {
    var rect = this.data[id];
    if (rect) {
      this.animation.width(rect.width).translate(rect.left, 0);
      this.setData({
        activeTabId: id,
        indicatorAnim: this.animation.step().export()
      })
    }
  },

  /* 语音识别页面 */
  //记账信息
  vtextAreaBlur: function (e) {
    this.setData({
      currentText: e.detail.value,
    })
  },

  //开始与结束录音
  streamRecord: function () {
    manager.start({
      lang: 'zh_CN',
    })
    wx.showToast({
      title: '开始录音',
      icon:'none',
    })
    console.log("录音开始")
  },
  streamRecordEnd: function () {
    console.log("录音结束")
    manager.stop()
    wx.showToast({
      title: '录音结束',
      icon: 'none',
    })
  },

  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        currentText: text,
      })
    }
  },
  sendData: function () {
    var that = this;
    /* 得到完整识别内容发给语音服务器处理 */
    wx.request({
      url: 'http://192.168.1.2:80/api/analysis/analysis',
      data: {
        "text": this.data.currentText,
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          summary: res.data.data[0].summary,
          debit: res.data.data[0].debit,
          debitAmount: parseFloat(res.data.data[0].debit_amount),
          credit: res.data.data[0].credit,
          creditAmount: parseFloat(res.data.data[0].credit_amount),
        })
        that.setActiveTab('tabitemForm');
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  /* 表单页面 */
  //摘要信息输入
  summaryFunction: function (e) {
    var text = e.detail.value;
    //this.data.summary = text;
    this.setData({
      summary: text,
    })
  },
  //借方科目
  debitFunction: function (e) {
    this.setData({
      debit: e.detail.value,
    })
  },
  //借方金额
  debitAmFunction: function(e) {
    this.setData({
      debitAmount: e.detail.value,
    })
  },
  //贷方科目
  creditFunction: function (e) {
    this.setData({
      credit: e.detail.value,
    })
  },
  //贷方金额
  creditAmFunction: function (e) {
    this.setData({
      creditAmount: e.detail.value,
    })
  },
  //选择时间
  onDateChange: function (e) {
    this.setData({
      date: e.detail.value,
    });
  },

  //点击完成,将结果发给服务器
  confirmData: function () {
    var that = this;
    if (parseFloat(that.data.debitAmount) <= 0 || parseFloat(that.data.creditAmount) <= 0) {
      wx.showToast({
        title: '金额不能为0',
        icon:'none',
        duration: 1500
      });
      return;
    }
    else if (that.data.debit==''||that.data.credit=='') {
      wx.showToast({
        title: '请输入科目',
        icon: 'none',
        duration: 1500
      });
      return;
    }

    //精确到秒，定位为当天12点
    var unixtime = util.formatToDate(that.data.date)/1000 + 14400;
  
    wx.request({
      url: config.insertUrl,
      data: {
        'loginFlag': wx.getStorageSync('loginFlag'),
        'summary': that.data.summary,
        'debit': that.data.debit,
        'debitAmount': that.data.debitAmount,
        'credit': that.data.credit,
        'creditAmount': that.data.creditAmount,
        'time': unixtime,
      },
      method: 'POST',
      success: function(res) {
        // TODO:应该使用返回的数据进行判断
        if(res.statusCode == 200){
          wx.showToast({
            title: '记账成功',
            icon: 'success',
            duration: 500,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            }
          })
        }else if(res.statusCode == 400){
          wx.showToast({
            title: res.data,
            icon: 'fail',
            duration: 500,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 500)
            }
          })
        }
      },
      fail: function(res) {
        // 网络请求失败
        console.log(res)
      }
    })
  },

  onLoad: function (options) {
    // 页面加载 options为页面跳转所带来的参数
    this.initRecord()
  },
  onReady: function () {
    /* 滑动动画相关 */
    var query = wx.createSelectorQuery().in(this),
      _this = this;
    _this.animation = wx.createAnimation({
      duration: 500,  //动画持续时间
      timingFunction: "ease",  //动画效果
    })
    query.select('#tabitemForm').boundingClientRect(function (rect) {
      _this.setData({
        tabitemForm: rect
      });
    })
    query.select('#tabitemVoice').boundingClientRect(function (rect) {
      _this.setData({
        tabitemVoice: rect
      });
      _this.setActiveTab('tabitemVoice');
    })
    query.exec();

    this.setData({
      date: util.formatTime(new Date(), "yyyy-MM-dd"),
    });
  },
})