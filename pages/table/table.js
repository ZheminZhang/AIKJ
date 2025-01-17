Page({
  data: {
    clientHeight: 0, //屏幕高度

    /* 利润 */
    profitData: [], //资产负债数据
    profitItems: [
      [
        "营业收入",
        "营业成本",
        "税金及附加",
        "销售费用",
        "管理费用",
        "财务费用",
        "资产减值损失",
        "公允价值变动收益",
        "净敞口套期收益",
        "投资收益",
        "对联营企业和合营企业的投资收益",
        "资产处置收益",
        "其他收益"
      ],
      ["营业利润", "营业外收入", "营业外支出"],
      ["利润总额", "所得税费用"],
      ["净利润", "持续经营净利润", "终止经营净利润"],
      [
        "其他综合收益的税后净额",
        "重新设定受益计划净资产或净负债的变动",
        "权益法下在被投资单位不能重分类进损益的其他综合收益中享有的份额",
        "权益法下在被投资单位以后将重分类进损益的其他综合收益中享有的份额",
        "其他债权投资公允价值变动损益",
        "金融资产重分类进损益的累计利得或损失",
        "现金流量套期损益的有效部分",
        "外币财务报表折算差额"
      ],
      ["综合收益总额"],
      ["基本每股收益", "稀释每股收益"]
    ],
    /* 资产负债 */
    balanceData: [], //资产负债数据
    balanceItems: [
      //条目索引
      [
        "货币资金",
        "交易性金融资产",
        "衍生金融资产",
        "应收票据",
        "应收账款",
        "预付款项",
        "应收利息",
        "应收股利",
        "其他应收款",
        "存货",
        "合同资产",
        "持有待售资产",
        "一年内到期的非流动资产",
        "其他流动资产",
        "流动资产合计"
      ],
      [
        "债权投资",
        "其他债权投资",
        "长期应收款",
        "长期股权投资",
        "其他权益工具投资",
        "投资性房地产",
        "固定资产",
        "在建工程",
        "工程物资",
        "固定资产清理",
        "生产性生物资产",
        "油气资产",
        "无形资产",
        "开发支出",
        "商誉",
        "长期待摊费用",
        "递延所得税资产",
        "其他非流动资产",
        "非流动资产合计"
      ],
      ["资产总计", "负债合计"],
      [
        "短期借款",
        "交易性金融负债",
        "衍生金融负债",
        "应付票据",
        "应付账款",
        "预收款项",
        "合同负债",
        "应付职工薪酬",
        "应交税费",
        "应付利息",
        "应付股利",
        "其他应付款",
        "持有待售负债",
        "一年内到期的非流动负债",
        "其他流动负债",
        "流动负债合计"
      ],
      [
        "长期借款",
        "应付债券",
        "优先股",
        "永续债",
        "长期应付款",
        "专项应付款",
        "预计负债",
        "递延收益",
        "递延所得税负债",
        "其他非流动负债",
        "非流动负债合计"
      ],
      [
        "实收资本",
        "其他权益工具",
        "优先股",
        "永续债",
        "资本公积",
        "库存股",
        "其他综合收益",
        "盈余公积",
        "未分配利润",
        "所有者权益合计",
        "负债和所有者权益合计"
      ]
    ],
    /* 现金流量 */
    cashFlowData: [], //现金流量数据
    cashFlowItems: [
      //条目索引
      [
        "销售商品_提供劳务收到的现金",
        "收到的税费返还",
        "收到其他与经营活动有关的现金",
        "经营活动现金流入小计",
        "购买商品_接受劳务支付的现金",
        "支付给职工以及为职工支付的现金",
        "支付的各项税费",
        "支付其他与经营活动有关的现金",
        "经营活动现金流出小计",
        "经营活动产生的现金流量净额"
      ],
      [
        "收回投资收到的现金",
        "取得投资收益收到的现金",
        "处置固定资产_无形资产和其他长期资产收回的现金净额",
        "处置子公司及其他营业单位收到的现金净额",
        "收到其他与投资活动有关的现金",
        "投资活动现金流入小计",
        "构建固定资产_无形资产和其他长期资产支付的现金",
        "投资支付的现金",
        "取得子公司及其他营业单位支付的现金净额",
        "支付其他与投资活动有关的现金",
        "投资活动现金流出小计",
        "投资活动产生的现金流量净额"
      ],
      [
        "吸收投资收到的现金",
        "取得借款收到的现金",
        "收到其他与筹资活动有关的现金",
        "筹资活动现金流入小计",
        "偿还债务支付的现金",
        "分配股利_利润或偿付利息支付的现金",
        "支付其他与筹资活动有关的现金",
        "筹资活动现金流出小计",
        "筹资活动产生的现金流量净额"
      ],
      ["汇率变动对现金及现金等价物的影响"],
      ["现金及现金等价物净增加额", "期初现金及现金等价物余额"],
      ["期末现金及现金等价物余额"]
    ],

    activeTabId: "tabitemProfit"
  },
  onLoad: function() {
    wx.showLoading({
      title: "请稍等...",
      mask: true
    });
    this.setData({
      profitData: wx.getStorageSync("table").profit,
      balanceData: wx.getStorageSync("table").balance,
      cashFlowData: wx.getStorageSync("table").cashFlow
    });

    //获取屏幕高度
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onReady: function() {
    wx.hideLoading();
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
    //console.log("rect:"+ rect)
    this.setData({
      activeTabId: id
    });
  }
});
