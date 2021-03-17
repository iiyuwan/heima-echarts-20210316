// 计算服务器消耗时长的中间件
// 该中间件必须是第一层，因为要计算服务器消耗时长

module.exports = async (ctx, next) => {
    /*
    业务：
        1、记录开始时间
        2、内层中间件执行
        3、记录结束时间
        4、设置响应值X-Response-Time
    */
    const start = Date.now()
    await next()
    const end = Date.now()
    let duration = end - start
    ctx.set('X-Response-Time', duration + 'ms')
}