const dayjs = require('dayjs')

Component({
    properties: {
        value: {
            type: Object,
            value: null,
            observer: function (newVal) {
                this.setData({
                    detailFormatExpireDate: this.formatDate(newVal.expireAt),
                    detailFormatCreateDate: this.formatDate(newVal.createAt),
                    detailCompleteDate: this.formatDate(newVal.completeAt),
                    creator: this.data.users.find(x => x.openId === newVal.openId) || {}
                })
            }
        },
        users: {
          type: Array,
          value: []
        },
        isActive: {
            type: Boolean,
            value: false
        }
    },

    data: {
        detailFormatExpireDate: '',
        detailFormatCreateDate: '',
        detailCompleteDate:'',
        creator: {},
        isInputContent: false
    },

    methods: {
        onCompleteStateChange() {
            const id = this.properties.value.id
            this.triggerEvent('complete', { id })
        },

        onActive() {
            const id = this.properties.value.id
            this.triggerEvent('active', { id })
        },

        onChange(e) {
            const id = this.properties.value.id
            const key = e.target.dataset.key
            const value = e.detail.value
            const todo = {
                ...this.properties.value,
                [key]: value
            }

            this.triggerEvent('change', {
                id,
                todo
            })
        },

        onDelete() {
            const id = this.properties.value.id
            this.triggerEvent('delete', { id })
        },

        toggelInputContent () {
            this.setData({
                isInputContent: !this.data.isInputContent
            })
        },

        nothing() {

        },

        // 日期格式化
        formatDate(date, tmp) {
            if (!date) return ''

            const dayjsObj = dayjs(date)
            const today = dayjs()
            const isSamDay = dayjsObj.isSame(today, 'day')
            const isSamMonth = dayjsObj.isSame(today, 'month')
            const isSamYear = dayjsObj.isSame(today, 'year')
            const apartDays = dayjsObj.diff(today, 'day')
            
            // 指定格式
            if (tmp) {
                return dayjsObj.format(tmp)
            }

            // 同天
            else if (isSamDay) {
                return '今天 ' + dayjsObj.format('HH:mm')
            }

            // 同月不同天
            else if (isSamMonth) {
                return dayjsObj.format('MM/DD HH:mm')
            }

            // 不同月不同天同年
            else if (isSamYear) {
                return dayjsObj.format('MM/DD')
            }

            // 其他
            else {
                return dayjsObj.format('YYYY/MM/DD')
            }
        }
    }
})