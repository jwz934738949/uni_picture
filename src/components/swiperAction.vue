<template>
  <view @touchstart="handleTouchStart" @touchend="handleTouchEnd">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 按下的时间
      startTime: 0,
      // 按下的坐标
      startX: 0,
      startY: 0,
    };
  },
  methods: {
    // 按下的事件
    handleTouchStart(event) {
      this.startTime = Date.now();
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
    },

    // 抬起的事件
    handleTouchEnd(event) {
      const endTime = Date.now();
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;

      // 判断按下时间是否过长
      if (endTime - this.startTime > 2000) {
        return;
      }
      // 判断用户滑动距离是否合法，再判断滑动的方向
      let direction = "";
      if (Math.abs(endX - this.startX) > 10 && Math.abs(endY - this.startY) < 10) {
        direction = endX - this.startX > 0 ? "right" : "left";
      } else {
        return;
      }

      // 将direction传入父组件中
      this.$emit("swiperAction", { direction });
    },
  },
};
</script>

<style>
</style>