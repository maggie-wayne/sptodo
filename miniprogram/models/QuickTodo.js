import adapter from '../adapters/index'
import User from './User';

class QuickTodo {
    constructor(meta) {
        this.title = meta.title
        this.content = meta.content
        this.expireAt = meta.expire_at
        this.isComplete = meta.is_complete
        // this.creator = meta.creator
        this.lastModify = new Date().getTime()
        this.completeAt = meta.completeAt;
    }

    static mapping(source) {
        const { title, expireAt, content, isComplete, lastModify } = source
        return {
            title: title,
            expire_at: expireAt,
            content: content,
            is_complete: isComplete,
            last_modify: lastModify
        }
    }

    static create(todo) {
        return adapter.createTodo(todo)
    }

    create() {
        const todo = QuickTodo.mapping(this)
        return QuickTodo.create(todo)
    }
}

export default QuickTodo
