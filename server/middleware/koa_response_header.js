// 用来设置响应头的中间件
module.exports = async (ctx, next) => {
    const contentType = 'application/json; charset=UTF-8'
    ctx.set('Content-Type', contentType)
    // 允许跨域
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
    await next()
}