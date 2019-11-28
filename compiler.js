var bus = new Bus()

function Compiler (dom, vm) {
    // console.log(dom.nodeType);
    if (dom.nodeType !== 1) return;

    this.compileTemplate(dom, vm)
}

// 编译模板
Compiler.prototype.compileTemplate = function (dom, vm) {
    // console.log(dom.childNodes)
    [...dom.childNodes].forEach(node => {

        // 匹配带有{{}}的字符串并且里面的内容可以是任意字符(严谨来说应该写成任意非中文)
        var reg = /\{\{(.*)\}\}/
        // var reg = /^\{\{([^\u4e00-\u9fa5]+$)\}\}/
        // console.log(node.textContent)
        // textContent类似于innerText

        // 1.主要差异 
        //  - textContent 会获取style= “display:none” 中的文本，而innerText不会 
        //  - textContent 会获取style标签里面的文本，而innerText不会

        // nodeType: 1-元素节点 2-属性节点 3-文本节点

        //  插值表达式
        if (reg.test(node.textContent)) {
            // console.log(node.nodeType);

            // console.log(RegExp.$1);
            // 正则表达式中的第一个单元，也就是第一个小括号包裹的内容
            // 将符合规则的变量转换为vm实例中定义的数据
            node.textContent = vm[RegExp.$1]

            // 自定义事件监听数据
            bus.on('update', function () {
                node.textContent = this.vm[RegExp.$1];
            })
        } else if (node.nodeType === 1) {
            // console.log(node.attributes);
            // node.attributes 获取当前元素节点的属性
            [...node.attributes].forEach(item => {
                // console.dir(item);
                // item.name: 获取属性名

                // 匹配以v-开头的属性名
                if (item.name.indexOf('v-') === 0) {
                    // 获取v-后面的名字
                    var attrName = item.name.slice(2)
                    // if (attrName === 'text') {
                    //     // v-text
                    //     node.innerText = vm[item.value]
                    // } else if (attrName === 'html') {
                    //     // v-html
                    //     node.innerHTML = vm[item.value]
                    // }

                    // console.log(attrName);
                    if (attrName.indexOf('on') === 0) {
                        // 事件指令集
                        var event = attrName.split(':')[1]
                        // console.log(event);

                        // console.log(vm.$methods);
                        // console.log(item.value);

                        // 绑定事件 : 注意，这里的this指向了事件源，因此需要改回为vm实例
                        node.addEventListener(event, vm.$methods[item.value].bind(vm))

                    } else {
                        // 简单指令集
                        // 利用短路语句来执行指令集中的指令
                        directives[attrName] && directives[attrName](node, vm[item.value], vm)
                        
                        // 绑定事件，确保在数据更新时能同时更新dom
                        bus.on('update', function () {
                            directives[attrName] && directives[attrName](node, vm[item.value], vm)
                        })
                    }
                }
            })
        }

        // 递归查找嵌套在元素节点内的节点
        this.compileTemplate(node, vm)
    })
}

// 定义指令集
var directives = {
    text (node, value) {
        node.innerText = value
    },
    html (node, value) {
        node.innerHTML = value
    },
    model (node, value, vm) {
        node.value = value
        node.addEventListener('input', () => {
            vm.msg = node.value
        })
    }
}

// Object.defineProperty(data)