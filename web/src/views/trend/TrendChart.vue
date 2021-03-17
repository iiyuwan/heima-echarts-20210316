<template>
  <div class="com-container">
    <div class="title" :style="curOptionStyle">
      <span>▎{{ curTypeName }}</span>
      <span
        class="iconfont icon-arrow-down"
        @click="showOption = !showOption"
        :style="curOptionStyle"
      ></span>
      <div class="select-con" v-show="showOption">
        <div
          class="select-option"
          v-for="item in selectTypes"
          :key="item.key"
          @click="selectOption(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
    <div class="resize" @click="compressChart" :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import { chartMixin } from "@/mixins/index";
import { getTheme } from '@/utils/themeUtils'
export default {
  name: "TrendChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      curType: "map", // 当前类型
      showOption: false,
      titleFontSize: 0, // 指明标题大小
    };
  },
  computed: {
    // 计算属性依赖其他
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        // 把当前已选项给去掉
        return this.allData.type.filter((item) => item.key !== this.curType);
      }
    },
    curTypeName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.curType].title;
      }
    },
    curOptionStyle() {
      // 设置给当前选项的样式
      return {
        fontSize: this.titleFontSize + "px",
        color: getTheme(this.theme).titleColor
      };
    },
  },
  mounted() {
    this.$socket.registerCallBack("trendData", this.getData);
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "trendData",
      chartName: "trend",
      value: "",
    });
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },

  destroyed() {
    this.$socket.unregisterCallBack("trendData");
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.trendRef, this.theme);
      const initOption = {
        grid: {
          // 控制坐标轴大小
          left: "3%",
          top: "35%",
          right: "4%",
          bottom: "1%",
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false, // 紧挨边缘
        },
        yAxis: {
          type: "value",
        },
      };
      this.chart.setOption(initOption);
    },
    getData(data) {
      this.allData = data;
      this.updateChart();
    },
    updateChart() {
      const colorArr1 = [
        "rgba(11,168,44,.5)",
        "rgba(44,110,255,.5)",
        "rgba(22,242,217,.5)",
        "rgba(254,33,30,.5)",
        "rgba(250,105,0,.5)",
      ]; // 半透明颜色数组
      const colorArr2 = [
        "rgba(11,168,44,0)",
        "rgba(44,110,255,0)",
        "rgba(22,242,217,0)",
        "rgba(254,33,30,0)",
        "rgba(250,105,0,0)",
      ]; // 透明颜色数组
      const xValues = this.allData.common.month; // x轴数据
      const values = this.allData[this.curType].data;
      const yValues = values.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          stack: this.curType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      const legendArr = values.map((item) => item.name);
      const dataOption = {
        legend: {
          data: legendArr,
        },
        xAxis: {
          data: xValues,
        },
        series: yValues,
      };
      this.chart.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        // 更改图例
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize - 20,
          },
        },
      };
      this.chart.setOption(adapterOption);
      this.chart.resize(); // 手动调用图表自适应
    },
    selectOption(type) {
      this.curType = type;
      this.showOption = false;
      this.updateChart();
    },
  },
};
</script>

<style scoped lang="less">
.com-container {
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    font-weight: 700;
    z-index: 3;
    .iconfont {
      margin-left: 10px;
      cursor: pointer;
    }
    .select-con {
      margin-left: 20px;
      padding: 5px;
      .select-option {
        text-align: center;
      }
      .select-option:hover {
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        color: #00a4ff;
      }
    }
  }
}
</style>