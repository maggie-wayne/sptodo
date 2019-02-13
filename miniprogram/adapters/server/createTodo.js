export default todo => {
    return wx.cloud.callFunction({
        name: 'createTodo',
        data: {
            todo
        }
    })
}
