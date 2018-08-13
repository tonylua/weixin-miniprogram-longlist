// pages/components/LongList/LongList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //全部数据的集合
    data: {
      type: Array,
      value: []
    },
    //每次显示的数量
    renderNum: {
      type: Number,
      value: 10
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //实际显示的顶部项目在全部集合中的索引
    startIdx: 0,
    //实际显示的项目集合
    renderData: [],
    //动态获得的单个项目的显示高度(px)
    itemHeight: 0,
    //动态获得的容器总高度(px)
    totalHeight: 9999,
    //实际显示的集合离顶部的距离(px)
    topMargin: 0
  },

  /**
   * 组件生命周期函数，在组件布局完成后执行
   */
  ready() {
    //设置初始数据并获取单个项目高度和容器总高度
    this.setData({
      renderData: this._calcRenderData()
    }, () => this._calcHeight());
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获得首个项目的实际高度，并推算容器总高度
    _calcHeight() {
      const { data } = this.data;
      const query = wx.createSelectorQuery().in(this);

      query.select('#item0').boundingClientRect( (res)=>{
        const firstItemHeight = res.height;
        const th = firstItemHeight * data.length;
        this.setData({
          itemHeight: firstItemHeight,
          totalHeight: th
        });
        console.log("totalHeight", firstItemHeight, data.length, th);
      }).exec();
    },
    //根据滚动位置动态获得要渲染的首个项目的索引
    _getStartWhenScroll(scrollTop = 0) {
      const {itemHeight} = this.data;
      return parseInt(scrollTop / itemHeight);
    },
    //计算出要渲染的集合
    _calcRenderData(start=0) {
      const { data, renderNum } = this.data;
      const r = data.slice(start, start + renderNum);
      return r;
    },
    //计算出距离顶部的位置
    _calcListTop(start=0) {
      const m = start * this.data.itemHeight;
      return m;
    },
    //防抖动后的滚动过程中的动态计算方法
    _onScroll() {
      const {scrollTop} = this.data;
      const start = this._getStartWhenScroll(scrollTop);
      
      console.log("_onScroll", scrollTop, start);

      return new Promise((rs,rj)=>{
        this.setData({
          renderData: this._calcRenderData(start),
          topMargin: this._calcListTop(start)
        }, rs);
      });
    },
    //滚动回调，更新位置并调用防抖动后的方法
    onScroll(e) {
      console.log('onScroll', this._lock);

      const { scrollTop } = e.detail;
      const { totalHeight, renderNum, itemHeight } = this.data;
      this.setData({
        scrollTop: Math.min(
          scrollTop, 
          totalHeight - renderNum * itemHeight
        )
      });

      clearTimeout(this._to);
      this._to = setTimeout(() => {
        this._onScroll().then(()=>{
          console.log("after _onScroll()");
        });
      }, 50);
    }
  }
})
