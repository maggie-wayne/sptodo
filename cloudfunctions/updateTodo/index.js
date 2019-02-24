const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const { id, todo, userInfo } = event
  const db = cloud.database()
  const now = new Date().getTime()
  
  todo.last_modify = now
  todo.complete_at = now
  delete todo._id
  delete todo._openid

  return await db.collection('todos')
    .where({
      _id: id
    })
    .update({ data: todo })
    .then(res => todo)
}