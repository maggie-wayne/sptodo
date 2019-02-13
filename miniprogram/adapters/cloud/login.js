const createTodo  = user => {
    return wx.cloud.callFunction({
        name: 'login',
        data: { user }
    })
    .then(res => ({
        code: 0,
        result: res.result
    }))
    .catch(e => {
        console.error(e)
        return Promise.reject({
            code: -1,
            msg: e.message
        })
    })
}

export default createTodo