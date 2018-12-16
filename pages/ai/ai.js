Page({
    data: {

    },
    nav_tfjs: function(e) {
        wx.navigateTo({
            url: `../tfjs/tfjs`,
        });
    },
    nav_mnist: function(e) {
        wx.navigateTo({
            url: `../mnist/mnist`,
        });
    },
});

