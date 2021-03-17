// 处理业务逻辑的中间件，读取某个json文件并返回
const fs = require('fs')
const path = require('path')
const {
    getFileJsonData
} = require('../utils/file_utils')
module.exports = async (ctx, next) => {
    const url = ctx.request.url
    let filePath = url.replace('/api', '')
    filePath = `../data/${filePath}.json`
    let fullPath = path.join(__dirname, filePath) // 保证动态的绝对路径
    // 保证后台不崩溃，就需要用try-catch
    try {
        let data = await getFileJsonData(fullPath)
        ctx.response.body = data
    } catch (error) {
        ctx.response.body = {
            message: '文件不存在'
        }
    }
    await next()
}