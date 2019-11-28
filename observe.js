function Observe (data) {
    if (typeof data !== 'object') return;

    // 监听data中所有的属性
    Object.keys(data).forEach(key => {
        this.walk(data, key, data[key])
        // console.log(this)
    })
}


Observe.prototype.walk = function (data, key, value) {
    Object.defineProperty(data, key, {
        configurable: false,
        enumerable: true,
        set (newVal) {
            // console.log('设置');
            value = newVal

            bus.emit('update');
        },

        get () {
            // console.log('访问');
            return value
        }
    })
}
