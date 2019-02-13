// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  const userInfo = event.userInfo
  const db = cloud.database()
  const _ = db.command

  const list = await db.collection('todos')
    .where({
      _openid: userInfo.openId
    })
    .get()
    .then(res => res.data)
  
  const openIds = [...new Set(list.map(x => x._openid))]
  const users = await db.collection('users')
    .where({
      _openid: _.in(openIds)
    })
    .get()
    .then(res => res.data)
  
  return { list, users }
}
