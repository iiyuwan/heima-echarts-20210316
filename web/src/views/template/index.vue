<template>
  <div class="com-container">
    <div class="com-chart" ref="xxxRef">▎</div>
  </div>
</template>

<script>
export default {
  naem: "HotChart",
  data() {
    return {
      chart: null, // 当前图表实例
      allData: null, // 所有数据
    };
  },
  mounted() {
    this.initChart(); // 初始化图表，设置最基本的option
    this.getData(); // 获取数据
    this.updateChart(); // 根据数据，设置变化的option
    this.screenAdapter(); // 主动进行屏幕适配，不然首次进入页面不会自动适配屏幕大小
    window.addEventListener("resize", this.screenAdapter); // 要对resize进行监听，才可实现图表自适应
  },
  destroyed() { // 撤销监听器
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      // 需要将xxx更换为各个图表的名称
      this.chart = this.$echarts.init(this.$refs.xxxRef, "chalk");
      const initOption = {};
      this.chart.setOption(initOption);
    },
    async getData() {
      const { data } = await this.$http.get("xxx");
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const dataOption = {};
      this.chart.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = this.$refs.hotRef.offsetWidth / 100 * 3.6;
      const adapterOption = {};
      this.chart.setOption(adapterOption);
      this.chart.resize() // 手动调用才会让echarts自适应
    },
  },
};
</script>

<style>
</style>