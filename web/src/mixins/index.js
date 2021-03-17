// 抽取的所有图表一些公共部分，便于简化代码
import {
  mapState
} from 'vuex';
import {
  getTheme
} from '@/utils/themeUtils'

export const chartMixin = {
  mounted() {
    // 之所以要在这里进行回调函数注册，是因为home-chart的图表在路由切换时，
    // destroyed方法会在chart图表created之后执行，导致回调函数无法被注册
    this.$socket.registerCallBack('fullScreen', this.fullScreen)
  },
  destroyed() { // 还是在图表销毁时进行回调函数注销
    this.$socket.unregisterCallBack('fullScreen')
  },
  computed: {
    ...mapState(["theme"]),
    themeStyle() {
      return {
        color: getTheme(this.theme).titleColor
      }
    }
  },
  watch: {
    theme() {
      this.chart.dispose(); // 先销毁实例
      this.initChart(); // 重新创建实例
      this.screenAdapter(); // 让图表进行屏幕适配
      this.updateChart(); // 更新图表数据
    },
  },
  methods: {
    compressChart(chartName) { // 点击最小化图表时，向所有客户端发送消息
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: true
      })
    },
    
    fullScreen(data) { 
    // 其他客户端接收到这个消息时，就根据value来判断是否最小化
    // 一旦是最小化，就返回首页
      if (data.value) {
        this.$router.replace({
          path: '/'
        })
      }
    }
  }
}