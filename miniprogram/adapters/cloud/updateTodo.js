const createTodo  = (id, todo) => {
    return wx.cloud.callFunction({
        name: 'updateTodo',
        data: { id, todo }
    })
    .then(res => ({
        code: 0,
        result: res.result
    }))
    .catch(e => {
        console.error(e)
        return Promise.reject({
            code: -1,
            msg: '更新失败。'
        })
    })
}

export default createTodo