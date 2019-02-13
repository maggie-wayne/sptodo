Component({
    properties: {
        value: {
            type: Object,
            value: null
        }
    },
    methods: {
        onTitleChange: function (e) {
            this.triggerEvent('change', {
                ...this.properties.value,
                title: e.detail.value
            })
        },

        onExpireDateChange: function (e) {
            this.triggerEvent('change', {
                ...this.properties.value,
                expireAt: e.detail
            })
        },

        onConfirm: function () {
            this.triggerEvent('confirm')
        }
    }
});
