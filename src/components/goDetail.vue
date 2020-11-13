<template>
  <view @click="picClick">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
    index: Number,
  },
  methods: {
    // 图片被点击了
    picClick() {
      // 将获取的图片数据进行缓存
      getApp().globalData.list = this.list;
      getApp().globalData.index = this.index;
      // 点击实现页面的跳转
      uni.navigateTo({
        url: "/pages/imgDetail/index",
      });
    },
  },
};
</script>

<style>
</style>