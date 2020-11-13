<template>
  <scroll-view
    @scrolltolower="handleToLower"
    scroll-y
    v-if="recommend.length > 0"
  >
    <!-- 推荐模块 -->
    <view class="recommend_wrap">
      <navigator
        class="recommend_item"
        v-for="item in recommend"
        :key="item.id"
        :url="`pages/album/index?id=${item.target}`"
      >
        <image :src="item.thumb" mode="widthFix"></image>
      </navigator>
    </view>

    <!-- 月份模块 -->
    <view class="month_wrap">
      <view class="month_title">
        <view class="month_title_info">
          <view class="month_info">
            <text> {{ month.D }} </text>
            / {{ month.M }} 月
          </view>
          <view class="month_text">{{ month.title }}</view>
        </view>
        <view class="month_title_more">更多 >></view>
      </view>
      <view class="month_content">
        <view
          class="month_item"
          v-for="(item, index) in month.items"
          :key="item.id"
        >
          <go-detail :list="month.items" :index="index">
            <image
              :src="item.thumb + item.rule.replace('$<Height>', 360)"
              mode="aspectFill"
            ></image>
          </go-detail>
        </view>
      </view>
    </view>

    <!-- 热门模块 -->
    <view class="hots_wrap">
      <view class="hots_title">
        <text> 热门 </text>
      </view>
      <view class="hots_content">
        <view class="hots_item" v-for="(item, index) in hots" :key="item.id">
          <go-detail :list="hots" :index="index">
            <image :src="item.thumb" mode="widthFix"></image>
          </go-detail>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
// 导入格式化时间的Js库
import moment from "moment";
import goDetail from "@/components/goDetail";

export default {
  data() {
    return {
      //  推荐列表
      recommend: [],
      // 月份数据
      month: {},
      // 热门数据
      hots: [],
      // 请求参数
      params: {
        limit: 30,
        order: "hot",
        skip: 0,
      },
      // 是否还有下一页数据
      isMore: true,
    };
  },
  components: {
    goDetail,
  },
  mounted() {
    uni.setNavigationBarTitle({
      title: "推荐",
    });
    this.getRecommend();
  },
  methods: {
    // 获取推荐数据
    async getRecommend() {
      const { res } = await this.request({
        url: "http://157.122.54.189:9088/image/v3/homepage/vertical",
        data: this.params,
      });
      // 判断是否还有下一页数据
      if (res.vertical.length === 0) {
        this.isMore = false;
        uni.showToast({
          title: "已到达页面最底部",
          duration: 2000,
        });
        return;
      }
      // 第一次获取数据
      if (this.recommend.length === 0) {
        this.recommend = res.homepage[1].items;
        this.month = res.homepage[2];
        // 获取时间戳，并格式化其中的月份与日期
        this.month.M = moment(this.month.stime).format("MM");
        this.month.D = moment(this.month.stime).format("DD");
      }
      // 将hots中原有的数据与新增的数据进行拼接
      this.hots = [...this.hots, ...res.vertical];
    },
    // 滚动条触底事件
    handleToLower() {
      // 每次滚动条触底之后，将skip的值设置为+limit。代表跳过多少条数据
      if (this.isMore) {
        // 还有下一页数据
        this.params.skip += this.params.limit;
        this.getRecommend();
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
  height: calc(100vh - 35px);
}

.recommend_wrap {
  display: flex;
  flex-wrap: wrap;

  .recommend_item {
    width: 50%;
    border: 3rpx solid #fff;
  }
}

.month_wrap {
  .month_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;

    .month_title_info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;

      .month_info {
        text {
          font-size: 38rpx;
        }
      }
      .month_text {
        margin-left: 30rpx;
        font-size: 35rpx;
        color: #666;
      }
    }

    .month_title_more {
      color: $color;
    }
  }

  .month_content {
    display: flex;
    flex-wrap: wrap;

    .month_item {
      width: 33.33%;
      border: 3rpx solid #fff;
    }
  }
}

.hots_wrap {
  .hots_title {
    padding: 20rpx;

    text {
      border-left: 15rpx solid $color;
      padding-left: 20rpx;
      font-size: 40rpx;
      font-weight: 600;
    }
  }
  .hots_content {
    display: flex;
    flex-wrap: wrap;

    .hots_item {
      width: 33.33%;
      border: 3rpx solid #fff;
    }
  }
}
</style>