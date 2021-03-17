# 后端
## 项目安装和运行
```bash
npm install # 安装依赖
node app.js # 运行后台
```
## 项目简单总结
1.关于中间件
- 中间件总的来说就是一个函数，对于koa、express这些框架来说都是这样，它会把(ctx,next)【koa中】、(req,resp,next)【express中】传入给中间件，从而对其进行操作，就可以实现对请求访问和成功返回数据的过程中进行一些处理
- next作用是一样，中间件内部调用后，会执行下一个中间件；而koa是`async+await实现“洋葱模型”`、`express是“顺序执行”的`

2.关于异步
- 对于一个异步函数来说，要想拿到它的值，可以通过 `回调函数`、`promise`、`async + await`这些方式来解决。
- 异步操作有`定时器`、`事件绑定`、`ajax`、`读写文件等等`
  ```js
  // 回调函数获取值
  function getData(){
    let res = 1
    setTimeout(() => {
      res = 2 // 模拟异步结果
    }, 10)
    return res
  }
  const res = getData()
  console.log(res) // 1，说明这种是拿不到值的

  function getData(callback){
    let res = 1
    setTimeout(() =>{
      res = 2
      callback(res)
    },10)
  }
  getData((res) => {
    console.log(res); // 2
  })

  ```

# 前端
## 素材下载地址
[(๑′ᴗ‵๑)Ｉ Lᵒᵛᵉᵧₒᵤ❤点这里](https://gitee.com/xiaoqiang001/online-retailers.git)
## 项目安装和运行

```bash
npm install # 安装依赖 
npm run serve # 调试开发
npm run build # 生产部署
```
## 数据约定
```js
// 服务端接收数据格式
{
    action: "getData",
    socketType: "trendData",
    chartName: "trend",
    value: ""
}
/*
解释：
action：代表某项行为，可选值有getData、fullScreen、themeChange；比如张三的电脑想要服务端数据，那么action就为getData；比如张三的某个图表发生全屏，那么就要发送给服务端，便于让李四对应图表也为全屏

socketType：标识前端动作类型，比如前端要获取数据，服务单返回，前端就通过这个类型来判断该如何处理，可选值有trendData、sellerData、mapData、rankData、hotData、stockData、fullScreen、themeChange

chartName：图表名称，服务端根据这个来获取对应图表数据，可选值有trend、seller、map、rank、hot、stock，如果是主题切换，可不传此值

value：就是fullScreen时，告诉其他浏览器是否要全屏；当张三电脑themeChange，服务器就要告诉李四themeChange哪一个具体的主题
*/ 


// 服务端发送数据格式

// 当action为getData
{
    action: "getData",
    socketType: "trendData",
    chartName: "trend",
    value: "",
    data: "读取到的trend文件的数据"
}
// 当action不为getData
{
    action: "fullScreen",
    socketType: "fullScreen",
    chartName: "trend",
    value: ""
}

// fullScreenStatus
fullScreenStatus:{
    trend: false,
    seller: false,
    map: false,
    rank: false,
    hot: false,
    stock: false
}
```
## 项目总结

- echarts注册主题
- echarts可以多次设置option，效果会累加而不是替换
- WebSocket对比ajax，它更适合后端实时数据交互，而不是用户在前端主动发起请求来调用后端数据
```js
// hello world 案例
    // 客户端
    var connectBtn = document.querySelector('#connect') // 测试连接按钮
    var sendBtn = document.querySelector('#send') // 向服务端发送数据按钮
    var msgP = document.querySelector('#msg') // 显示接收的消息 p 
    let client = null
    connectBtn.onclick = function () {
      client = new window.WebSocket('ws://localhost:9998')
      client.onopen = function(){ // 客户端与服务端连接成功
        console.log('连接服务端成功');
        sendBtn.disabled = false;
      }
      client.onclose = function(){ // 客户端与服务端连接失败
        console.log('连接服务端失败');
        sendBtn.disabled = true;
      }
      client.onmessage = function({ data:msg }){ // 客户端监听到服务端发送的消息
        msgP.innerHTML = msg;
      }
    }
    sendBtn.onclick = function () {
      client.send(JSON.stringify({ // 客户端向服务端发送消息
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: '',
        value: 'true'
      }))
    }


    // 服务端 npm install ws
    const ws = new WebSocket.Server({ port: 9998 }, () => {
      console.log('websocket is listening port: 9998');
    })

    // 对客户端连接事件进行监听，client是客户端的socket连接对象
    ws.on('connection',  (server) => {
      console.log('client connected successfully, total client:' + ws.clients.size);
      server.on('message', async (msg) => { // 服务端监听到客户端发来的消息
        console.log(msg)
        server.send(JSON.stringify(payload)) // 服务端向客户端发送消息，且是二进制或字符串数据
        ws.clients.forEach(item => { // 可以向所有已经连接的客户端发送数据
            item.send(msg)
        })
    })

```

- 单例模式
```js
  class Jquery {
    instance = null
    static getInstance(){
      if (!this.instance) {
        return new Jquery()
      } else {
        return this.instance
      }
    }
  }
```
- 全屏切换的思路
```js
/*
主页->全屏：在主页点击全屏按钮时，利用socket发送请求，再分发给所有客户端，然后注册的回调函数直接改变对应的路由就可以了
全屏->主页：点击缩小按钮时，就把消息转发给所有客户端，注册的回调函数执行让路由变成'/'，因为所有图表都是这个逻辑，所以抽取在mixin里
*/
```