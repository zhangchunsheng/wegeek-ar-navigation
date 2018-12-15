const App = getApp();
const api = require('../../utils/api.js');
const util = require('../../utils/util.js');

const formatTime = util.formatTime;

Page({
  data: {
    videos: [],
      vedioSrc: "",
      cameraChangeTag: "back",
      hiddenTag:"true",
    start: 0,
    loading: false,
    windowWidth: App.systemInfo.windowWidth,
    windowHeight: App.systemInfo.windowHeight,
  },
  onLoad() {
    this.loadMore();
  },
  onPullDownRefresh() {
      loadMore();
  },
  loadMore(e, needRefresh) {
    const self = this;
    const loading = self.data.loading;
    const data = {
      next_start: self.data.start,
    };
    if (loading) {
      return;
    }
    self.setData({
      loading: true,
    });
    api.getVideoList({
      data,
      success: (res) => {
        let newList = res.data.result.elements;
        newList.map((video) => {
          const item = video;
          item.data[0].date_added = formatTime(new Date(item.data[0].date_added * 1000), 1);
          return item;
        });
        if (needRefresh) {
          wx.stopPullDownRefresh();
        } else {
          newList = self.data.videos.concat(newList);
        }
        self.setData({
            videos: newList,
        });
        const nextStart = res.data.result.next_start;
        self.setData({
          start: nextStart,
          loading: false,
        });
      },
    });
  },
  viewVideo(e) {

  },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        if (wx.createCameraContext()) {
            // this.cameraContext = wx.createCameraContext('myCamera')
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        };

        this.audioCtx = wx.createAudioContext('myAudio');
    },

    openVedio() {
        this.setData({
            hiddenTag: false
        });
        this.audioCtx.play();
        const ctx = wx.createCameraContext();
        ctx.startRecord ({
            success: (res) => {
            this.setData({
              vedioSrc: res.tempVideoPath
            })
        }
      })
    },

    stopVedio() {
        this.setData({
            hiddenTag: true
        });
        this.audioCtx.pause();
        const ctx = wx.createCameraContext();
        ctx.stopRecord  ({
            success: (res) => {
            this.setData({
              vedioSrc: res.tempVideoPath
            })
          }
        })
    },

    changeDevicePosition(){
        if(this.data.cameraChangeTag === "back"){
            this.setData({
                cameraChangeTag: "front"
            })
        }else{
            this.setData({
                cameraChangeTag: "back"
            })
        }
    },
});
