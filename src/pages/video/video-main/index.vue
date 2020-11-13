<template>
  <scroll-view
    scroll-y
    enable-flex
    class="scroll_main"
    @scrolltolower="getMore"
  >
    <view
      class="scroll_item"
      v-for="item in videowp"
      :key="item.id"
      @click="goVideoPlay(item)"
    >
      <image :src="item.img" mode="widthFix"></image>
    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    urlObj: {
      type: Object,
    },
  },
  data() {
    return {
      // 获取视频数组
      videowp: [],
      isMore: true,
    };
  },
  watch: {
    urlObj() {
      this.videowp = [];
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取相应的视频数据
    async getList() {
      const { res } = await this.request({
        url: this.urlObj.url,
        data: this.urlObj.params,
      });
      if (res.videowp.length === 0) {
        this.isMore = false;
        uni.showToast({
          title: "已滚动到页面最底部",
          duration: 2000,
        });
      }
      this.videowp = [...this.videowp, ...res.videowp];
    },

    // 加载更多视频内容
    getMore() {
      if (this.isMore) {
        this.urlObj.params.skip += this.urlObj.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: "已滚动到页面最底部",
          duration: 2000,
        });
      }
    },

    // 跳转视频播放页面
    goVideoPlay(item) {
      // 将item存入全局变量
      getApp().globalData.video = item;
      uni.navigateTo({
        url: "/pages/videoPlay/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll_main {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 36rpx);

  .scroll_item {
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}
</style>