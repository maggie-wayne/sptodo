import Notify from 'vant-weapp/notify/notify'
import adapter from '../../adapters/index'
import QuickTodo from '../../models/QuickTodo'
import BaseTodo from '../../models/BaseTodo'
import User from '../../models/User'

const getDefaultTodo = () => ({
  title: '',
  expireAt: null,
  content: '',
  isComplete: false
})

const indexPageData = {
  login: false,
  user: null,
  active: null,
  todoList: [],
  createTodo: getDefaultTodo()
}

Page({
  data: indexPageData,

  onLoad() {
    this.inital()
  },

  onPullDownRefresh() {
    console.log('Down refresh.')
    this.inital4Network()
      .then(() => {
        wx.stopPullDownRefresh()
      })
  },

  inital() {
    console.log('Index Page: ', this)
    const cache = wx.getStorageSync('cache')

    if (cache) {
      console.log('Find cache', cache)
      this.inital4Cache(cache)
    } else {
      this.inital4Network()
    }
  },

  inital4Network() {
    return this.getUserInfo()
      .then(() => {
        this.getTodoList()
      })
  },

  inital4Cache(cache) {
    const { login, user, active, todoList, createTodo } = cache
    this.setData({
      login,
      user: new User(user),
      active,
      todoList: todoList.map(x => new BaseTodo(x)),
      createTodo
    })
  },

  getUserInfo() {
    return new Promise((resolve, reject) => {
      // 获取设置
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 有 userInfo 权限
            wx.getUserInfo({
              success: res => {
                const userInfoMeta = User.mapping(res.userInfo)
                adapter.login(userInfoMeta)
                this.setData({
                  login: true,
                  user: new User(userInfoMeta)
                })
                resolve()
              }
            })
          }
          // 无 userInfo 权限 - 跳转到欢迎页面
          else {
            reject({
              msg: ''
            })
            wx.redirectTo({
              url: '/pages/welcome/index'
            })
          }
        }
      })
    })
  },

  sortTodoList(list) {
    return list.sort((x, y) => y.lastModify - x.lastModify)
  },

  // 更新 data 并按照修改时间排序
  updateData(sort=true) {
    const todoList = sort ? this.sortTodoList(this.data.todoList) : null
    this.setData({
      ...this.data,
      ...sort && { todoList }
    })

    const cache = {
      ...this.data,
      user: User.mapping(this.data.user),
      todoList: this.data.todoList.map(x => BaseTodo.mapping(x))
    }

    wx.setStorage({
      key: 'cache',
      data: cache
    })
    console.log('Update data and caching.', cache)
  },

  // 获取 Todo list
  getTodoList() {
    adapter.getTodoList()
      .then(res => {
        const hasUserInfoTodlList = res.result.list.map(x => {
            const _openid = x._openid
            x.creator = res.result.users.find(x => x._openid === _openid)
            return x
          })
        this.data.todoList = this.sortTodoList(hasUserInfoTodlList).map(x => new BaseTodo(x))
        this.updateData()
      })
      .catch(e => {
        Notify(e.msg)
      })
  },

  // Todo input 内容 change
  onCreateChange(e) {
    this.setData({
      createTodo: e.detail
    })
  },

  // 创建 Todo
  onCreateTodo() {
    const todo = this.data.createTodo
    todo.creator = this.data.user

    const quickTodo = new QuickTodo(QuickTodo.mapping(todo))
    const tag = quickTodo.lastModify

    // 马上添加一条 todo 到 list 并更新视图
    this.data.todoList
      .unshift(quickTodo)
    this.data.createTodo = getDefaultTodo()
    this.updateData()

    // 发起请求 create todo
    quickTodo.create()
      .then(res => {
        // 创建成功 - 更新本地数据
        res.result.creator = User.mapping(this.data.user)

        const index = this.data.todoList.findIndex(x => x.lastModify === tag)
        const baseTodo = new BaseTodo(res.result)
        this.data.todoList.splice(index, 1, baseTodo)
      })
      .catch(e => {
        // 创建失败 - 删除之前添加到 todo 并恢复 todo input 内容
        const index = this.data.todoList.findIndex(x => x.lastModify === tag)
        this.data.todoList.splice(index, 1)
        this.data.createTodo = todo
        Notify(e.msg)
      })
      .then(() => {
        // 更新视图
        this.updateData()
      })
  },

  // Complete
  onCompleteStateChange(e) {
    const id = e.detail.id
    const target = this.data.todoList.find(x => x.id === id)
    const completeState = target.isComplete

    target.isComplete = !completeState
    target.lastModify = new Date().getTime()
    target.isLoading = true

    if (this.data.active && this.data.active.id === id) {
      this.data.active = null
    }
    this.updateData()

    // 发起请求修改数据
    target.update()
      .then(res => {
        // 成功 - 更新数据
        target.updateByMeta(res.result)
      })
      .catch(e => {
        // 失败 - 回滚数据
        Notify(e.msg)
        target.isComplete = completeState
      })
      .then(() => {
        target.isLoading = false
        this.updateData()
      })
  },

  // active 状态
  onActive(e) {
    let id = e.detail.id

    // QuickTodo 没有 id - 不能修改详情
    if (!id) return

    // 有已更改的 - 保存修改
    const active = this.data.active
    if (active && active.isChange) {
      active.isLoading = true
      active.lastModify = new Date().getTime()
      this.updateData()

      active.update()
        .then(res => {
          active.isChange = false
          active.updateByMeta(res.result)
        })
        .catch(e => {
          active.isChange = true
          Notify(e.msg)
        })
        .then(() => {
          active.isLoading = false
          this.updateData()
        })
    }

    // toggle
    const target = this.data.todoList.find(x => x.id === id)
    this.data.active = active && active.id === id 
      ? null 
      : target

    this.setData({
      active: this.data.active
    })
  },

  // Todo change
  onTodoChange(e) {
    let { id, todo } = e.detail
    const target = this.data.todoList.find(x => x.id === id)

    todo = BaseTodo.mapping(todo)
    target.updateByMeta(todo)
    target.isChange = true

    this.setData({
      todoList: this.data.todoList
    })
  },

  // Delete
  onDelete(e) {
    const id = e.detail.id
    const index = this.data.todoList.findIndex(x => x.id === id)
    const target = this.data.todoList[index]

    this.data.todoList.splice(index, 1)
    this.setData({
      todoList: this.data.todoList
    })

    target.delete()
      .then(res => {
        console.log(res)
      })
      .catch(e => {
        this.data.todoList.push(target)
        this.updateData()
      })
  }
})
