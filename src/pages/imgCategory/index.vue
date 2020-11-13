<template>
  <view>
    <!-- tab选项卡 -->
    <view class="category_tab">
      <view class="category_tab_title">
        <view class="title_inner">
          <uni-segmented-control
            :current="current"
            :values="items.map((v) => v.title)"
            @clickItem="onClickItem"
            style-type="text"
            active-color="#d4237a"
          ></uni-segmented-control>
        </view>
        <view class="iconfont icon-sousuo"></view>
      </view>
      <scroll-view
        @scrolltolower="scrollToBottom"
        enable-flex
        scroll-y
        class="category_tab_content"
      >
        <view class="cate_item" v-for="item in vertical" :key="item.id">
          <image :src="item.thumb" mode="widthFix" />
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
// 引入uni-ui插件
import { uniSegmentedControl } from "@dcloudio/uni-ui";

export default {
  data() {
    return {
      items: [
        { title: "最新", order: "new" },
        { title: "热门", order: "hot" },
      ],
      current: 0,
      // 请求参数
      params: {
        limit: 30,
        skip: 0,
        order: "new",
      },
      // 获取点击分类id
      id: 0,
      // 保存获取的图片数据
      vertical: [],
      isMore: true,
    };
  },
  components: {
    uniSegmentedControl,
  },
  onLoad(options) {
    this.id = options.id;
    this.getImg();
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      } else {
        return
      }
      // 对order进行赋值
      this.params.order = this.items[e.currentIndex].order;
      this.params.skip = 0
      this.vertical = []
      // 重新获取数据
      this.getImg();
    },

    // 获取分类图片详情
    async getImg() {
      const { res } = await this.request({
        url: `http://service.picasso.adesk.com/v1/vertical/category/${this.id}/vertical`,
        data: this.params,
      });
      if (res.vertical.length === 0) {
        uni.showToast({
          title: "页面已到达底部",
          duration: 2000,
        });
      }
      this.vertical = [...this.vertical, ...res.vertical];
    },

    scrollToBottom() {
      if (this.isMore) {
        this.params.skip += this.params.limit;
        this.getImg();
      } else {
        uni.showToast({
          title: "页面已到达底部",
          duration: 2000,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.category_tab {
  .category_tab_title {
    position: relative;

    .title_inner {
      width: 70%;
      margin: 0 auto;
    }
    .icon-sousuo {
      font-size: 45rpx;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
    }
  }

  .category_tab_content {
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 36rpx);

    .cate_item {
      width: 33.33%;
      border-bottom: 5rpx solid #fff;
    }
  }
}
</style>