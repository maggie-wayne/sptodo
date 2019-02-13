Component({
    properties: {
        value: {
            type: Number,
            value: null,
            observer: function (newVal) {
                this.setData({
                    localValue: newVal || new Date().getTime()
                })
            }
        },

        pickerType: {
            type: String,
            value: 'datetime'
        }
    },

    data: {
        showPopup: false,
        localValue: null
    },

    methods: {
        onShowPopup() {
            this.setData({
                showPopup: true
            })
        },

        onPopupClose() {
            this.setData({
                showPopup: false
            })
        },

        onDateChange(e) {
            this.setData({
                localValue: e.detail
            })
        },

        onConfirm() {
            this.onPopupClose()
            this.triggerEvent('change', {
                value: this.data.localValue
            })
        }
    }
})