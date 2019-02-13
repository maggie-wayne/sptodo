// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const id = event.id
  const db = cloud.database()

  const result = await db.collection('todos')
    .where({
      _id: id
    })
    .get()
  
  return {
    detail: result.data
  }
}