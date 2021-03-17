<template>
  <div class="com-container">
    <div class="com-chart" ref="mapRef" @dblclick="setChinaMap"></div>
    <div class="resize" @click="compressChart" :style="themeStyle">
      <span class="iconfont icon-compress-alt"></span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getProvinceMapInfo, isValid } from "@/utils/mapUtils.js";
import { chartMixin } from "@/mixins/index";
export default {
  name: "MapChart",
  mixins: [chartMixin],
  data() {
    return {
      chart: null,
      allData: null,
      allMapData: [], // 所有省份地图 ['hubei','henan']
    };
  },
  mounted() {
    this.$socket.registerCallBack("mapData", this.getData); // 注册回调函数
    this.initChart();
    this.$socket.send({
      action: "getData",
      socketType: "mapData",
      chartName: "map",
      value: "",
    });
    this.updateChart();
    this.screenAdapter();
    window.addEventListener("resize", this.screenAdapter);
  },
  destroyed() {
    this.$socket.unregisterCallBack("mapData"); // 销毁回调函数
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chart = this.$echarts.init(this.$refs.mapRef, this.theme);
      const initOption = {
        title: {
          text: "▎商家分布",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "5%",
          orient: "vertical",
        },
        geo: {
          type: "map",
          map: "China",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            // 各省份样式
            areaColor: "#2E72BF",
            borderColor: "#333", // 边界样式
          },
        },
      };
      this.chart.setOption(initOption);
      this.chart.on("click", async (item) => {
        // 这里可以优化：数据存在vuex中，那样让地图点进来还是home-map的地图而不用重新发请求
        // 为地图添加点击事件 -- 这段还是使用axios，因为跟后台数据关系不大
        if (isValid(item.name)) {
          const provinceObj = getProvinceMapInfo(item.name); // 有效的话，就去获取其路径和英文名
          if (!this.isSavedMapData(provinceObj.key)) {
            // 没有保存到它的数据
            const { data: provinceMap } = await axios.get(
              `http://localhost:8888${provinceObj.path}`
            );
            this.$echarts.registerMap(provinceObj.key, provinceMap);

            this.allMapData.push(provinceObj.key);
          }
          const mapOption = {
            geo: {
              map: provinceObj.key,
            },
          };
          this.chart.setOption(mapOption);
        }
      });
    },
    getData(data) {
      this.allData = data;
      const legendArr = this.allData.map((item) => item.name);
      const seriesArr = this.allData.map((item) => {
        return {
          // 要让数据在地图上显示，就要设置coordinate system
          type: "effectScatter",
          rippleEffect: {
            // 涟漪效果程度
            scale: 5,
            brushType: "stroke", // 空心涟漪效果
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chart.setOption(dataOption);
    },
    updateChart() {
      const dataOption = {};
      this.chart.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
        },
      };
      this.chart.setOption(adapterOption);
      this.chart.resize();
    },
    setChinaMap() {
      this.chart.setOption({
        geo: {
          map: "China",
        },
      });
    },
    isSavedMapData(name) {
      // 查找是否已经保存了英文name的地图
      if (this.allMapData.length > 0) {
        return this.allMapData.indexOf(name) !== -1;
      }
      return false;
    },
  },
};
</script>

<style>
</style>