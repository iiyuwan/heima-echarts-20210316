export default class SocketService {
  // 单例设计模式
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }
  ws = null
  callBackMapping = {} // 存储回调函数

  hasConnected = false // 标识是否连接成功
  sendRetryTimes = 0 //记录失败次数
  connectRetryTimes = 0

  // 定义连接服务器的方法
  connect() {
    if (!window.WebSocket) {
      return window.alert('您的浏览器不支持WebSocket。')
    }
    this.ws = new window.WebSocket('ws://localhost:9998')
    this.ws.onopen = () => { // 监听一些事件
      console.log('connected server successfully');
      this.hasConnected = true
      this.connectRetryTimes = 0
    }
    this.ws.onclose = () => {
      console.log('connected server failed');
      this.hasConnected = false
      this.connectRetryTimes++
      window.setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryTimes)
    }

    this.ws.onmessage = (msg) => { // 监听服务端发送消息
      const data = JSON.parse(msg.data)
      const socketType = data.socketType
      if (this.callBackMapping[socketType]) {
        const action = data.action
        if (action === 'getData') {
          const chartData = JSON.parse(data.data)
          // console.log('前端收到数据：', data.data);
          this.callBackMapping[socketType].call(this, chartData)
        } else if (action === 'fullScreen') {
          this.callBackMapping[socketType].call(this, data)
        } else if (action === 'themeChange') {
          this.callBackMapping[socketType].call(this, data)
        }
      }
    }
  }
  // 因为下面几个方法是在vue组件里调用的，因此挂载到vue原型上比较方便
  registerCallBack(socketType, callback) { // 回调函数注册，以socketType为key
    this.callBackMapping[socketType] = callback
  }

  unregisterCallBack(socketType) { // 注销回调函数
    this.callBackMapping[socketType] = null
  }
  send(data) { // 判断是否可以发送，以及重传机制
    if (this.hasConnected) { // function会改变this指向！！！
      this.ws.send(JSON.stringify(data))
      this.sendRetryTimes = 0
    } else {
      this.sendRetryTimes++
      window.setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryTimes)
    }
  }
}