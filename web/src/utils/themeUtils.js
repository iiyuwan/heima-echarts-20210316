// 换肤
const chalk = {
  backgroundColor: '#161522', // 头部背景
  titleColor: '#fff', // 标题文字颜色
  headerBorder: '/static/img/header_border_dark.png', // 页面背景头部边框
  logo: '/static/img/logo_dark.png', // 左上角图片
  skinIcon: '/static/img/qiehuan_dark.png', // 换肤图片
}

const vintage = {
  backgroundColor: '#eee',
  titleColor: '#000',
  headerBorder: '/static/img/header_border_light.png',
  logo: '/static/img/logo_light.png',
  skinIcon: '/static/img/qiehuan_light.png',
}
const theme = {
  chalk,
  vintage
}
export function getTheme(themeName) {
  return theme[themeName]
}