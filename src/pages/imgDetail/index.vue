<template>
  <view>
    <!-- 用户信息 -->
    <view class="user_info">
      <view class="user_icon">
        <image :src="imgDetail.user.avatar" mode="widthFix" />
      </view>
      <view class="user_desc">
        <view class="user_name">{{ imgDetail.user.name }}</view>
        <view class="user_time">{{ imgDetail.cnTime }}</view>
      </view>
    </view>
    <!-- 高清大图 -->
    <view class="high_img">
      <swiper-action @swiperAction="swiperImg">
        <image :src="imgDetail.thumb" mode="widthFix" />
      </swiper-action>
    </view>
    <!-- 点赞与收藏 -->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icon-dianzan">{{ imgDetail.rank }}</text>
      </view>
      <view class="user_collect">
        <text class="iconfont icon-shoucang">收藏</text>
      </view>
    </view>
    <!-- 最热评论 -->
    <view class="comment hot" v-if="hot.length">
      <view class="comment_title">
        <text class="iconfont icon-hot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_content">
        <view class="comment_item" v-for="item in hot" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix" />
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="user_nickname">{{ item.user.name }}</view>
              <view class="user_time">{{ item.cnTime }}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <image
                :src="item2.icon"
                mode="widthFix"
                v-for="item2 in item.user.title"
                :key="item2.icon"
              />
            </view>
          </view>
          <!-- 用户评论 -->
          <view class="comment_desc">
            <view class="comment_content">{{ item.content }}</view>
            <view class="comment_like">
              <text class="iconfont icon-dianzan">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 最新评论 -->
    <view class="comment new" v-if="comment.length">
      <view class="comment_title">
        <text class="iconfont icon-review"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_content">
        <view class="comment_item" v-for="item in comment" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix" />
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="user_nickname">{{ item.user.name }}</view>
              <view class="user_time">{{ item.cnTime }}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <image
                :src="item2.icon"
                mode="widthFix"
                v-for="item2 in item.user.title"
                :key="item2.icon"
              />
            </view>
          </view>
          <!-- 用户评论 -->
          <view class="comment_desc">
            <view class="comment_content">{{ item.content }}</view>
            <view class="comment_like">
              <text class="iconfont icon-dianzan">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 下载按钮 -->
    <view class="download">
      <button class="download_btn" @click="download">下载图片</button>
    </view>
  </view>
</template>

<script>
import moment from "moment";
import swiperAction from "@/components/swiperAction";
// 设置时间插件为中文格式
moment.locale("zh-cn");

export default {
  data() {
    return {
      // 获取图片信息
      imgDetail: {},
      // 最热评论
      hot: [],
      // 最新评论
      comment: [],
      // 图片索引
      imgIndex: 0,
    };
  },
  components: {
    swiperAction,
  },
  onLoad() {
    const { index } = getApp().globalData;
    this.imgIndex = index;
    this.getData();
  },
  methods: {
    // 获取图片详细数据
    getData() {
      const { list } = getApp().globalData;
      this.imgDetail = list[this.imgIndex];
      // 获取当前时间与上传时间之间的时间间隔
      this.imgDetail.cnTime = moment(this.imgDetail.atime * 1000).fromNow();
      this.getComments(this.imgDetail.id);
    },

    async getComments(id) {
      const { res } = await this.request({
        url: `http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`,
      });
      res.hot.map((v) => (v.cnTime = moment(v.atime * 1000).fromNow()));
      res.comment.map((v) => (v.cnTime = moment(v.atime * 1000).fromNow()));
      this.hot = res.hot;
      this.comment = res.comment;
    },

    // 滑动图片的事件
    swiperImg(e) {
      // 用户左滑动index++，右滑动index--
      const { list } = getApp().globalData;
      if (e.direction === "left" && this.imgIndex < list.length - 1) {
        // 用户向左滑动并且图片的索引不超过图片数组的长度
        this.imgIndex++;
        this.getData();
      } else if (e.direction === "right" && this.imgIndex > 0) {
        this.imgIndex--;
        this.getData();
      } else {
        uni.showToast({
          title: "没有数据了",
          icon: "none",
        });
      }
    },

    // 下载图片
    async download() {
      await uni.showLoading({
        title: "加载中",
      });

      // 下载图片到小程序的内容中
      const res1 = await uni.downloadFile({
        url: this.imgDetail.img,
      });
      // 其中tempFIlePath代表图片保存在小程序内存中的路径
      let { tempFilePath } = res1[1];
      // 将内存中的图片下载到本地
      const res2 = await uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
      });
      uni.hideLoading();
      uni.showToast({
        title: "下载成功",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.user_info {
  display: flex;
  padding: 20rpx;
  height: 150rpx;

  .user_icon {
    padding: 0 20rpx;

    image {
      width: 85rpx;
      border-radius: 50%;
    }
  }

  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }
    .user_time {
      color: #ccc;
      font-size: 25rpx;
      padding: 15rpx 0;
    }
  }
}

.high_img {
  border-bottom: 5px solid #eee;
}

.user_rank {
  display: flex;
  height: 80rpx;
  border-bottom: 5rpx solid #eee;

  .rank {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .user_collect {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.comment {
  .comment_title {
    padding: 20rpx;

    .iconfont {
      color: red;
      font-size: 35rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 30rpx;
      color: #666;
      margin-left: 20rpx;
    }
  }

  .comment_content {
    .comment_item {
      padding: 15rpx;
      border-bottom: 15rpx solid #eee;

      .comment_user {
        display: flex;
        padding: 15rpx 0;

        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;

          image {
            width: 90%;
          }
        }

        .user_name {
          flex: 1;
          padding: 0 15rpx;

          .user_nickname {
            color: #777;
          }

          .user_time {
            color: #ccc;
            font-size: 25rpx;
          }
        }

        .user_badge {
          padding: 0 15rpx;

          image {
            width: 40rpx;
            height: 40rpx;
            display: inline-block;
          }
        }
      }

      .comment_desc {
        display: flex;
        padding: 15rpx 0;

        .comment_content {
          flex: 1;
          color: #000;
          padding-left: 16%;
        }

        .comment_like {
          text-align: right;
        }
      }
    }
  }
}

.new {
  .icon-review {
    color: aqua !important;
  }
}

.download {
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  .download_btn {
    width: 90%;
    height: 80%;
    background-color: $color;
    color: #fff;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>