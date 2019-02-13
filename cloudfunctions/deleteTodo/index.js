// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const { userInfo, ids } = event

  return await db.collection('todos')
    .where({
      _id: _.in(ids),
      _openid: userInfo.openId
    })
    .remove()
}