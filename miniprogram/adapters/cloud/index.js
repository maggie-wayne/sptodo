import createTodo from './createTodo'
import deleteTodo from './deleteTodo'
import updateTodo from './updateTodo'
import getTodoList from './getTodoList'
import login from './login'

wx.cloud.init()

export default {
    createTodo,
    deleteTodo,
    updateTodo,
    getTodoList,
    login
}