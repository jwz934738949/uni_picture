<template>
  <scroll-view @scrolltolower="handleToLower" scroll-y>
    <!-- 轮播图模块 -->
    <view class="album_swiper">
      <swiper autoplay circular indicator-dots>
        <swiper-item v-for="item in banner" :key="item.id">
          <image :src="item.thumb" mode="widthFix"></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 专辑列表模块 -->
    <view class="album_list">
      <navigator
        class="album_item"
        v-for="item in album"
        :key="item.id"
        :url="`/pages/album/index?id=${item.id}`"
      >
        <view class="album_img">
          <image :src="item.cover" mode="aspectFill"></image>
        </view>
        <view class="album_info">
          <view class="album_name">{{ item.name }}</view>
          <view class="album_desc">{{ item.desc }}</view>
          <view class="album_btn">
            <view class="btn_attention">关注</view>
          </view>
        </view>
      </navigator>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      params: {
        limit: 30,
        order: "new",
        skip: 0,
      },
      // 轮播图数字
      banner: [],
      // 列表数组
      album: [],
      // 是否已经没有更多数据
      isMore: true,
    };
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: "专辑",
    });
    this.getAlbum();
  },
  methods: {
    async getAlbum() {
      const { res } = await this.request({
        url: "http://157.122.54.189:9088/image/v1/wallpaper/album",
        data: this.params,
      });
      if (this.banner.length === 0) {
        this.banner = res.banner;
      }

      if (res.album.length === 0) {
        this.isMore = false;
        uni.showToast({
          title: "已到达页面最底部",
          duration: 2000,
        });
        return;
      }

      this.album = [...this.album, ...res.album];
    },

    // 滚动条触底事件
    handleToLower() {
      if (this.isMore) {
        this.params.skip += this.params.limit;
        this.getAlbum();
      } else {
        uni.showToast({
          title: "已到达最底部",
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
scroll-view {
  height: calc(100vh - 35rpx);
}

.album_swiper {
  swiper {
    height: calc(750rpx / 2.3);
    image {
      height: 100%;
    }
  }
}

.album_list {
  padding: 10rpx;

  .album_item {
    padding: 10rpx 0;
    display: flex;
    border: 1rpx solid #ccc;

    .album_img {
      flex: 1;

      image {
        width: 200rpx;
        height: 200rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 15rpx;
      overflow: hidden;

      .album_name {
        padding: 10rpx 0;
        font-size: 33rpx;
        color: #000;
      }

      .album_desc {
        font-size: 28rpx;
        padding: 10rpx 0;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album_btn {
        display: flex;
        justify-content: flex-end;
        padding-top: 25rpx;

        .btn_attention {
          color: $color;
          border: 1rpx solid currentColor;
          padding: 10rpx;
        }
      }
    }
  }
}
</style>