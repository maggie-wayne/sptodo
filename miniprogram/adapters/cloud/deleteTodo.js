const createTodo  = ids => {
    return wx.cloud.callFunction({
        name: 'deleteTodo',
        data: { ids }
    })
    .then(res => ({
        code: 0,
        result: res.result
    }))
    .catch(e => {
        console.error(e)
        return Promise.reject({
            code: -1,
            msg: '删除失败。'
        })
    })
}

export default createTodo