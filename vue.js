function Vue (options) {
    // 设置视图管理区
    this.$el = typeof options.el=== 'string' ? document.querySelector(options.el) : options.el
    // 代理data中的数据到当前构造函数的原型上
    this.$data = options.data



    // 遍历data中的所有属性
    Object.keys(options.data).forEach(key => {

        // 定义setter/getter
        Object.defineProperty(this, key, {
            // 是否可配置
            configurable:false,
            // 是否可枚举
            enumerable:true,
            // setter   必须要有一个形参
            set (value) {
                console.log('属性' + key + '被设置了')
                options.data[key] = value
            },
            // getter  访问属性时触发的回调
            get () {
                console.log('属性' + key + '被访问了')
                return options.data[key]
            }

        })
    })

    // 编译模板
    new Compiler(this.$el, this)
}


