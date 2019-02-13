// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid = event.userInfo.openId
  const db = cloud.database()
  const userInfo = {
    ...event.user,
    _openid
  }
  let result = null

  const userCount = await db.collection('users')
    .where({
      _openid
    })
    .count()
    .then(res => res.total)
  
  if (!userCount) {
    // 新增 user
    db.collection('users')
      .add({ data: userInfo })
  }

  const data = {
    _openid,
    date: new Date().getTime(),
  }

  return db.collection('loginlogs')
    .add({ data })
}