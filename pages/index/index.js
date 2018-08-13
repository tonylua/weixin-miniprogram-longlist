const app = getApp()

Page({
  data: {
    
  },
  onLoad: function () {
    const NAMES = ["Tom", "Jerry", "Danold", "Mikey"];

    const arr = [];
    let rand = 0;

    for (let i = 0; i < 1000; i++) {
      rand = parseInt(Math.random() * 4);
      arr.push({name: NAMES[rand] + i});
    }

    this.setData({
      users: arr
    })
  }
})
