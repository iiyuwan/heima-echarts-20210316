<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
    <div class="resize" @click="compressChart"  :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import { chartMixin } from "@/mixins/index";
export default {
  name: "RankChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      timer: null,
      startValue: 0, // 区域缩放的起点和终点值
      endValue: 9,
    };
  },
 
  mounted() {
    this.$socket.registerCallBack("rankData", this.getData);
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "rankData",
      chartName: "rank",
      value: "",
    });
    this.screenAdapter();
    window.addEventListener("resize", this.screenAdapter);
  },
  destroyed() {
    this.$socket.unregisterCallBack("rankData");
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timer);
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.rankRef, this.theme);
      const initOption = {
        title: {
          text: "▎地区销售排行",
          left: 20,
          top: 20,
        },
        tooltip: {
          trigger: "axis",
        },
        grid: {
          top: "40%",
          left: "5%",
          right: "5%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chart.setOption(initOption);
      this.chart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chart.on("mouseout", () => {
        this.moveChart();
      });
    },
    getData(data) {
      this.allData = data;
      this.allData.sort((a, b) => b.value - a.value); // 小到大排序
      this.updateChart();
      this.moveChart();
    },
    updateChart() {
      const xValues = this.allData.map((item) => item.name);
      const yValues = this.allData.map((item) => item.value);
      const colorArr = [
        ["#0BA82C", "#4FF778"],
        ["#2E72BF", "#23E5E5"],
        ["#5052EE", "#AB6EE5"],
      ];
      const dataOption = {
        xAxis: {
          data: xValues,
        },
        dataZoom: {
          // 每隔两秒进行区域缩放，就可以实现向左移动的效果
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: yValues,
            itemStyle: {
              color: (arg) => {
                let targetIndex = 0;
                if (arg.value > 300) {
                  targetIndex = 0;
                } else if (arg.value > 200) {
                  targetIndex = 1;
                } else {
                  targetIndex = 2;
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: colorArr[targetIndex][0] },
                  { offset: 1, color: colorArr[targetIndex][1] },
                ]);
              },
            },
          },
        ],
      };
      this.chart.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series: {
          barWidth: titleFontSize,
          itemStyle: {
            // 柱状图样式
            barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
          },
        },
      };
      this.chart.setOption(adapterOption);
      this.chart.resize();
    },
    moveChart() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>

<style>
</style>