<template>
  <div
    class="home"
    :style="{
      background: themeStyle.backgroundColor,
      color: themeStyle.titleColor,
    }"
  >
    <header class="home-header">
      <div class="header-bg">
        <img :src="themeStyle.headerBorder" alt="" />
      </div>
      <span class="logo">
        <img :src="themeStyle.logo" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeStyle.skinIcon" class="qiehuan" @click="changeTheme" />
        <span class="datetime">2021-03-14 05:20:00</span>
      </div>
    </header>
    <div class="home-body">
      <section class="home-left">
        <div id="left-top">
          <!-- 销量趋势图表 -->
          <trend-index></trend-index>
          <div class="resize" @click="expandChart('trend')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
        <div id="left-bottom">
          <!-- 商家销售金额图表 -->
          <seller-index></seller-index>
          <div class="resize" @click="expandChart('seller')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
      </section>
      <section class="home-middle">
        <div id="middle-top">
          <!-- 商家分布图表 -->
          <map-index></map-index>
          <div class="resize" @click="expandChart('map')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
        <div id="middle-bottom">
          <!-- 地区销量排行 -->
          <rank-index></rank-index>
          <div class="resize" @click="expandChart('rank')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
      </section>
      <section class="home-right">
        <div id="right-top">
          <!-- 热销商品占比情况 -->
          <hot-index></hot-index>
          <div class="resize" @click="expandChart('hot')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
        <div id="right-bottom">
          <!-- 库存销量分析图表 -->
          <stock-index></stock-index>
          <div class="resize" @click="expandChart('stock')">
            <span class="iconfont icon-compress-alt"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import TrendIndex from "./trend";
import SellerIndex from "./seller";
import MapIndex from "./map";
import RankIndex from "./rank";
import HotIndex from "./hot";
import StockIndex from "./stock";
import { getTheme } from "@/utils/themeUtils";
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    TrendIndex,
    SellerIndex,
    MapIndex,
    RankIndex,
    HotIndex,
    StockIndex,
  },
  computed: {
    ...mapState(["theme"]),
    themeStyle() {
      return getTheme(this.theme);
    },
  },
  mounted() {
    this.$socket.registerCallBack("fullScreen", this.fullScreen);
    this.$socket.registerCallBack("themeChange", this.loadTheme);
  },
  destroyed() {
    this.$socket.unregisterCallBack("fullScreen");
    this.$socket.unregisterCallBack("themeChange");
  },
  methods: {
    expandChart(chartName) {
      //
      /*
        关于动态绑定属性：
      fullScreenStatus: { // 定义每一个图表全屏状态
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false,
      }
      this.fullScreenStatus[chartName] = true
      this.$next(() => {
        this.$refs[chartName].screenAdapter() // 是因为屏幕没适应才导致的
      })
      */
      // 实现多端联动
      this.$socket.send({
        action: "fullScreen",
        socketType: "fullScreen",
        chartName,
        value: false,
      });
    },
    fullScreen(data) {
      this.$router.replace({ path: data.chartName });
    },
    loadTheme() {
      this.$store.commit("changeTheme");
    },
    changeTheme() {
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: "themeChange",
        socketType: "themeChange",
        chartName: "",
        value: this.theme,
      });
    },
  },
};
</script>
<style lang="less" scoped>
/*
.fullscreen{
  position: fixed !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 auto !important;
  z-index: 100 !important;
}

*/
.home {
  width: 100%;
  height: 100%;
  padding: 0 25px;
  box-sizing: border-box;
  color: #fff;
  .home-header {
    position: relative;
    height: 64px;
    font-size: 20px;
    .header-bg {
      img {
        width: 100%;
      }
    }
    .logo {
      position: absolute;
      left: 0;
      top: 0;
      img {
        height: 35px;
        width: 128px;
      }
    }
    .title {
      position: absolute;
      top: 16px;
      left: 50%;
      font-size: 24x;
      transform: translateX(-50%);
    }
    .title-right {
      position: absolute;
      right: 0;
      top: 10px;
      img {
        width: 28px;
        height: 21px;
        cursor: pointer;
        vertical-align: middle;
      }
      .datetime {
        margin-left: 10px;
        font-size: 15px;
      }
    }
  }
  .home-body {
    width: 100%;
    height: 100%;
    margin-top: 10px;
    .home-left {
      display: inline-block;
      width: 27.6%;
      height: 100%;
      #left-top {
        position: relative;
        height: 53%;
      }
      #left-bottom {
        position: relative;
        height: 31%;
        margin-top: 25px;
      }
    }
    .home-middle {
      display: inline-block;
      width: 41.5%;
      margin: 0 1.6%;
      height: 100%;
      #middle-top {
        position: relative;
        height: 56%;
      }
      #middle-bottom {
        position: relative;
        height: 28%;
        margin-top: 25px;
      }
    }
    .home-right {
      display: inline-block;
      width: 27.6%;
      height: 100%;
      #right-top {
        position: relative;
        height: 46%;
      }
      #right-bottom {
        position: relative;
        height: 38%;
        margin-top: 25px;
      }
    }
  }
}
</style>