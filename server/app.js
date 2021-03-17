const Koa = require('koa')
const app = new Koa()

// 引入第一层中间件
const durationMiddleware = require('./middleware/koa_response_duration')
// 引入第二层中间件
const headerMiddleware = require('./middleware/koa_response_header')
// 引入第三层中间件
const dataMiddleware = require('./middleware/koa_response_data')
// 引入WebSocket
const webSocketService = require('./service/web_socket_service')
app.use(durationMiddleware)
app.use(headerMiddleware)
app.use(dataMiddleware)

app.listen(3000, () => {
    console.log('server running at http://localhost:3000/');
})

webSocketService.listen() // 开启监听

