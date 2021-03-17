<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
    <div class="resize" @click="compressChart" :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import { chartMixin } from "@/mixins/index";
export default {
  name: "StockChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      page: 1, // 第一页
      timer: null,
      titleFontSize: 0,
    };
  },

  mounted() {
    this.$socket.registerCallBack("stockData", this.getData);
    this.initChart();
    this.screenAdapter();
    this.$socket.send({
      action: "getData",
      socketType: "stockData",
      chartName: "stock",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
  },
  destroyed() {
    window.clearInterval(this.timer);
    this.$socket.unregisterCallBack("stockData");
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.stockRef, this.theme);
      const initOption = {
        title: {
          text: "▎库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.chart.setOption(initOption);
      this.chart.on("mouseover", () => {
        window.clearInterval(this.timer);
      });
      this.chart.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(data) {
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      let start = (this.page - 1) * 5;
      let end = start + 5;
      const showData = this.allData.slice(start, end); // [0,5)
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["#4ff778", "#0ba82c"],
        ["#e5dd45", "#e8b11c"],
        ["#e8821c", "#e55445"],
        ["#5052ee", "#ab6ee5"],
        ["#23e5e5", "#2e72bf"],
      ];
      const showDataArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          hoverAnimation: false, // 关闭动画
          labelLine: {
            show: false,
          },
          label: {
            position: "center",
            color: colorArr[index][0],
            lineHeight: this.titleFontSize,
          },
          data: [
            {
              // 销量数据
              name: item.name + "\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              // 库存数据
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: showDataArr,
      };
      this.chart.setOption(dataOption);
      this.startInterval();
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6;
      const innerRadius = this.titleFontSize * 2.7;
      const outerRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: (this.titleFontSize / 4) * 3,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: (this.titleFontSize / 4) * 3,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: (this.titleFontSize / 4) * 3,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: (this.titleFontSize / 4) * 3,
            },
          },
          {
            type: "pie",
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: (this.titleFontSize / 4) * 3,
            },
          },
        ],
      };
      this.chart.setOption(adapterOption);
      this.chart.resize();
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.page++;
        if (this.page > parseInt(this.allData.length / 5)) {
          this.page = 1;
        }
        this.updateChart();
      }, 5000);
    },
  },
};
</script>

<style>
</style>