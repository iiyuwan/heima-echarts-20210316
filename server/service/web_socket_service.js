const WebSocket = require('ws')
const path = require('path')
const { getFileJsonData } = require('../utils/file_utils')
// 创建WebSocket服务端对象，绑定端口
const ws = new WebSocket.Server({
  port: 9998,
}, () => {
  console.log('websocket is listening port: 9998');
})

module.exports.listen = () => {
  // 对客户端连接事件进行监听，client是客户端的socket连接对象
  ws.on('connection',  (client) => {
    console.log('client connected successfully, total client:' + ws.clients.size );
    client.on('message', async (msg) => {
      const payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') { // 取出图表名，然后获取数据，再添加data字段给前端
        filePath = `../data/${payload.chartName}.json`
        let fullPath = path.join(__dirname, filePath) // 保证动态的绝对路径
        // 保证后台不崩溃，就需要用try-catch
        try {
            let data = await getFileJsonData(fullPath)
            payload.data = data
            client.send(JSON.stringify(payload))  
        } catch (error) {
          payload.data = null
          client.send(JSON.stringify(payload))
        }
      } else { // 不是获取数据，直接原封不动地发给每个客户端
        ws.clients.forEach(item => {
          item.send(msg)
        })
      }
    })
  })
}

 