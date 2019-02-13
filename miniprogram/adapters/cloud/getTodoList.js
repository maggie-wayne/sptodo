const getTodoList  = () => {
    return wx.cloud.callFunction({
        name: 'todoList'
    })
    .then(res => ({
        code: 0,
        result: res.result
    }))
    .catch(e => {
        console.error(e)
        return Promise.reject({
            code: -1,
            msg: '获取 Todo list 失败。'
        })
    })
}

export default getTodoList