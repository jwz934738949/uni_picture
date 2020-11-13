<template>
  <view>
    <!-- 专辑背景 -->
    <view class="album_bg">
      <image :src="album.cover" mode="widthFix"></image>
      <view class="album_info">
        <view class="album_name">{{ album.name }}</view>
        <view class="album_btn">关注专辑</view>
      </view>
    </view>

    <!-- 专辑作者 -->
    <view class="album_author">
      <view class="author_info">
        <image :src="album.user.avatar" mode="widthFix"></image>
        <view class="author_name">{{ album.user.name }}</view>
      </view>
      <view class="author_desc">
        <text>{{ album.desc }}</text>
      </view>
    </view>

    <!-- 图片列表 -->
    <view class="album_list">
      <view
        class="album_item"
        v-for="(item, index) in wallpaper"
        :key="item.id"
      >
        <go-detail :list="wallpaper" :index="index">
          <image
            :src="item.thumb + item.rule.replace('$<Height>', 360)"
            mode="aspectFill"
          ></image>
        </go-detail>
      </view>
    </view>
  </view>
</template>

<script>
import goDetail from "@/components/goDetail";

export default {
  data() {
    return {
      params: {
        limit: 30,
        order: "new",
        skip: 0,
        first: 1,
      },
      id: 0,
      album: {},
      wallpaper: [],
      isMore: true,
    };
  },
  components: {
    goDetail,
  },
  onLoad(options) {
    this.id = options.id;
    this.getAlbumDetail();
  },
  // 页面滚动到底部
  onReachBottom() {
    if (this.isMore) {
      this.first = 0;
      this.params.skip += this.params.limit;
      this.getAlbumDetail();
    } else {
      uni.showToast({
        title: "已到达页面最底部",
        duration: 2000,
      });
    }
  },
  methods: {
    // 获取专辑详情
    async getAlbumDetail() {
      const { res } = await this.request({
        url: `http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params,
      });
      if (Object.keys(this.album).length === 0) {
        this.album = res.album;
      }
      if (res.wallpaper.length === 0) {
        this.isMore = false;
        uni.showToast({
          title: "已到达页面最底部",
          duration: 2000,
        });
        return;
      }
      this.wallpaper = [...this.wallpaper, ...res.wallpaper];
    },
  },
};
</script>

<style lang="scss" scoped>
.album_bg {
  position: relative;
  image {
  }

  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 5rpx;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
    align-items: center;
    color: #fff;
    padding: 0 25rpx;

    .album_name {
      font-size: 35rpx;
    }
    .album_btn {
      background-color: $color;
      width: 152rpx;
      height: 55rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
      padding: 15rpx;
    }
  }
}

.album_author {
  .author_info {
    padding: 25rpx;
    display: flex;

    image {
      width: 50rpx;
    }

    .author_name {
      color: #000;
      margin-left: 20rpx;
    }
  }

  .author_desc {
  }
}

.album_list {
  display: flex;
  flex-wrap: wrap;

  .album_item {
    width: 33.33%;
    border: 3rpx solid #fff;

    image {
      height: 160rpx;
    }
  }
}
</style>