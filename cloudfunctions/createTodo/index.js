const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const { todo, userInfo } = event
  const db = cloud.database()

  const now = new Date().getTime()
  const expire_at = todo.expire_at
    ? new Date(todo.expire_at).getTime()
    : null

  const data = {
    _openid: userInfo.openId,
    ...todo,
    is_complete: false,

    // 取服务器时间
    create_at: now,
    last_modify: now,

    // 到期时间可为空
    expire_at
  }

  return await db.collection('todos')
    .add({ data })
    .then(res => ({
      ...res,
      ...data
    }))
}