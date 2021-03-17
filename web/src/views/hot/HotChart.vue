<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span
      class="iconfont icon-arrow-lift icon-left"
      @click="toLeft"
      :style="fontStyle"
    ></span>
    <span
      class="iconfont icon-arrow-right icon-right"
      @click="toRight"
      :style="fontStyle"
    ></span>
    <span class="product-name" :style="fontStyle">{{ productName }}</span>
    <div class="resize" @click="compressChart" :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import { chartMixin } from "@/mixins/index";
import { getTheme } from "@/utils/themeUtils";
export default {
  naem: "HotChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      curIndex: 0, // 当前一级分类数据
      titleFontSize: 0,
    };
  },
  computed: {
    fontStyle() {
      return {
        fontSize: this.titleFontSize + "px",
        color: getTheme(this.theme).titleColor,
      };
    },
    productName() {
      if (this.allData === null) {
        return "";
      } else {
        return this.allData[this.curIndex].name;
      }
    },
  },
  mounted() {
    this.$socket.registerCallBack("hotData", this.getData); // 注册回调函数
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "hotData",
      chartName: "hot",
      value: "",
    });
    this.screenAdapter();
    window.addEventListener("resize", this.screenAdapter);
  },
  destroyed() {
    this.$socket.unregisterCallBack("hotData"); // 销毁回调函数
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.hotRef, this.theme);
      const initOption = {
        title: {
          text: "▎热销商品占比",
          top: 20,
          left: 20,
        },
        legend: {
          top: "13%",
          icon: "circle",
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            type: "pie",
            label: {
              // 默认不显示连线和文字
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chart.setOption(initOption);
    },
    getData(data) {
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const legendArr = this.allData[this.curIndex].children.map(
        (item) => item.name
      );
      const seriesData = this.allData[this.curIndex].children.map((item) => {
        return {
          name: item.name,
          value: item.value,
          children: item.children,
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        tooltip: {
          formatter: ({ data }) => {
            let resStr = "";
            const allValue = data.children.reduce((preV, curItem) => {
              return preV + curItem.value;
            }, 0);
            data.children.forEach((item) => {
              let percent = (item.value / allValue) * 100;
              resStr += `${item.name}&nbsp;&nbsp;${percent.toFixed(0)}% <br/>`;
            });
            return resStr;
          },
        },
        series: {
          data: seriesData,
        },
      };
      this.chart.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize - 20,
          },
        },
        series: [
          {
            radius: this.titleFontSize * 4.5,
            center: ["50%", "60%"],
          },
        ],
      };
      this.chart.setOption(adapterOption);
      this.chart.resize();
    },
    toLeft() {
      // 左边选择按钮点击事件
      this.curIndex--;
      if (this.curIndex < 0) {
        this.curIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      // 右边选择按钮点击事件
      this.curIndex++;
      if (this.curIndex > this.allData.length - 1) {
        this.curIndex = 0;
      }
      this.updateChart();
    },
  },
};
</script>

<style lang="less" scoped>
.com-container {
  color: "#fff";
  .icon-left,
  .icon-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%); // 只对行内块或块元素有效果
    z-index: 10;
    cursor: pointer;
  }
  .icon-left {
    left: 10%;
  }
  .icon-right {
    right: 10%;
  }
  .icon-left:hover,
  .icon-right:hover {
    color: #00a4ff;
  }
  .product-name {
    position: absolute; // 子绝父相才有效果
    right: 5%;
    bottom: 5%;
    color: white;
  }
}
</style>