function Bus () {
    this.events = {}
}

// 绑定事件
Bus.prototype.on = function (type, callBack) {
    this.events[type] = this.events[type] || []

    // 添加事件监听
    this.events[type].push(callBack)
}

// 触发事件
Bus.prototype.emit = function (type) {
    this.events[type].forEach(callback => {
        callback()
    })
}