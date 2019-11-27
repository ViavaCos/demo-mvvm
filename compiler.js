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
            console.log(node.nodeType);

            // console.log(RegExp.$1);
            // 正则表达式中的第一个单元，也就是第一个小括号包裹的内容
            // 将符合规则的变量转换为vm实例中定义的数据
            node.textContent = vm[RegExp.$1]
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
                    if (attrName === 'text') {
                        node.innerText = vm[item.value]
                    } else if (attrName === 'html') {
                        node.innerHTML = vm[item.value]
                    }

                }
            })
        }
    })
}