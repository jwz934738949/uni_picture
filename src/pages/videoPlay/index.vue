<template>
  <view class="video_play">
    <!-- 背景图片 -->
    <image :src="videoObj.img" />
    <!-- 工具栏 -->
    <view class="video_tools">
      <view
        :class="['iconfont', muted ? 'icon-audiostatic' : 'icon-audio']"
        @click="changeMuted"
      ></view>
      <view class="iconfont icon-zhuanfa">
        <button open-type="share"></button>
      </view>
    </view>
    <!-- 视频 -->
    <view class="video_wrap">
      <video :muted="muted" :src="videoObj.video" objectFit="fill"></video>
    </view>
    <!-- 下载视频 -->
    <view class="download">
      <view class="download_btn" @click="downloadVideo"> 下载高清 </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoObj: {},
      // 是否静音
      muted: false,
    };
  },
  onLoad() {
    this.videoObj = getApp().globalData.video;
    console.log(this.videoObj);
  },
  methods: {
    // 切换是否静音
    changeMuted() {
      this.muted = !this.muted;
    },

    // 下载视频
    async downloadVideo() {
      await uni.showLoading({
        title: '加载中'
      })

      const {tempFilePath} = (await uni.downloadFile({
        url: this.videoObj.video
      }))[1]

      await uni.saveVideoToPhotosAlbum({
        filePath: tempFilePath,
      })

      uni.hideLoading()
      await uni.showToast({
        title: '下载成功',
        duration: 2000
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.video_play {
  position: relative;

  image {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    filter: blur(20px);
  }

  .video_tools {
    height: 80rpx;
    display: flex;
    justify-content: flex-end;

    .iconfont {
      width: 80rpx;
      color: #fff;
      font-size: 50rpx;
      border-radius: 40rpx;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20rpx;
    }

    .icon-zhuanfa {
      position: relative;

      button {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }

  .video_wrap {
    display: flex;
    justify-content: center;
    video {
      width: 360rpx;
      height: 600rpx;
    }
  }

  .download {
    display: flex;
    justify-content: center;
    margin-top: 20rpx;

    .download_btn {
      width: 360rpx;
      height: 80rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border-radius: 40rpx;
      border: 2rpx solid #fff;
      background-color: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>