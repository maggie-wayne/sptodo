const createTodo  = todo => {
    return wx.cloud.callFunction({
        name: 'createTodo',
        data: { todo }
    })
    .then(res => ({
        code: 0,
        result: res.result
    }))
    .catch(e => {
        console.error(e)
        return Promise.reject({
            code: -1,
            msg: '创建失败。'
        })
    })
}

export default createTodo