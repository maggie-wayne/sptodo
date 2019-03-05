import QuickTodo from './QuickTodo'
import adapter from '../adapters/index'
import User from './User'

class BaseTodo extends QuickTodo {
    constructor(meta) {
        super(meta)
        this.id = meta._id
        this.openId = meta._openid
        this.createAt = meta.create_at
        this.lastModify = meta.last_modify
        // this.creator = new User(meta.creator)

        this.isChange = false
        this.isLoading = false
    }

    updateByMeta(meta) {
        meta = {
            ...BaseTodo.mapping(this),
            ...meta
        }

        this.id = meta._id
        this.openId = meta._openid
        this.createAt = meta.create_at
        this.lastModify = meta.last_modify

        this.title = meta.title
        this.content = meta.content
        this.expireAt = meta.expire_at
        this.completeAt = meta.complete_at
        this.isComplete = meta.is_complete
    }

    static mapping(source) {
      const { id, openId, createAt, expireAt, lastModify, isComplete, title, content, creator, completeAt } = source
        return {
            _id: id,
            _openid: openId,
            expire_at: expireAt,
            create_at: createAt,
            last_modify: lastModify,
            is_complete: isComplete,
            complete_at: completeAt,
            title: title,
            content: content
        }
    }

    static delete(ids) {
        return adapter.deleteTodo(ids)
    }

    delete() {
        return BaseTodo.delete([this.id])
    }

    static update(id, todo) {
        return adapter.updateTodo(id, todo)
    }

    update() {
        const todo = BaseTodo.mapping(this)
        return BaseTodo.update(this.id, todo)
    }
}

export default BaseTodo