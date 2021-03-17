// 读取文件的工具
const fs = require('fs')
module.exports.getFileJsonData = (fullPath) => {
    // 异步任务需要通过promise拿到数据，无法直接返回fs.readFile结果的
    return new Promise((resolve, reject) => {
        fs.readFile(fullPath, 'UTF-8', (err, data) => {
            if (err) {
                reject('文件不存在')
            } else {
                resolve(data)
            }
        })
    })
}