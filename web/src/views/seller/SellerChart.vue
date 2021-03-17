<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
    <div class="resize" @click="compressChart" :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import { chartMixin } from "@/mixins/index";
export default {
  name: "SellerChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      currentPage: 1,
      pageSize: 5,
      totalPage: 0,
      timer: null,
    };
  },
  mounted() {
    this.$socket.registerCallBack("sellerData", this.getData);
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "sellerData",
      chartName: "seller",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter(); // 界面加载完成，主动进行屏幕适配
  },
  destroyed() {
    clearInterval(this.timer);
    this.$socket.unregisterCallBack("sellerData");
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      // 主题使用需要先引入在index.html
      this.chart = this.$echarts.init(this.$refs.sellerRef, this.theme);
      // 设置初始化的option
      const initOption = {
        title: {
          text: "▎商家销售统计",
          left: 20,
          top: 20,
        },
        grid: {
          // 控制坐标轴显示的大小
          top: "15%",
          right: "6%",
          bottom: "3%",
          left: "3%",
          containLabel: true, // 让坐标轴文字也有间隔，不然就只控制了坐标轴大小
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 设置鼠标移入条目背景样式
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",
            label: {
              show: true, // 显示文字
              position: "right",
              textStyle: {
                color: "#fff",
              },
            },
            itemStyle: {
              // 每个柱状图条目
              // 上右下左坐标分别是(0,0) (1,0) (1,1) (0,1) 分别指明方向和各百分比颜色
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
          },
        ],
      };
      this.chart.setOption(initOption);
      // 监听鼠标移入移出事件
      this.chart.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.chart.on("mouseout", () => {
        this.startInterval();
      });
    },
    getData(data) {
      this.allData = data;
      this.allData.sort((a, b) => {
        return a.value - b.value; // 从小到大排序
      });
      this.totalPage =
        this.allData.length % this.pageSize === 0
          ? this.allData.length / this.pageSize
          : this.allData.length / this.pageSize + 1;
      this.updateChart();

      this.startInterval();
    },
    updateChart() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      const showData = this.allData.slice(start, end);
      const yNames = showData.map((item) => item.name);
      const xValues = showData.map((item) => item.value);
      let dataOption = {
        yAxis: {
          data: yNames,
        },
        series: [
          {
            data: xValues,
          },
        ],
      };
      this.chart.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        // 编程小技巧
        window.clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    screenAdapter() {
      // 浏览器大小发生改变，进行屏幕适配
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            // 设置鼠标移入条目背景样式
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              // 每个柱状图条目
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0], // 上右下左圆角，33是barWidth的一半
            },
          },
        ],
      };
      this.chart.setOption(adapterOption);
      this.chart.resize(); // 必须手动调用
    },
  },
};
</script>

<style></style>
