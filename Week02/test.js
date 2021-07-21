import { parseHTML } from "./parser/parser.js"
let tmpl = `<div class="newslist">
    <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
    <div class="date" v-if="info.showDate">{{info.name}}/></div>
    <div class="img">{{info.name}}/></div>
</div>`;
// let tree = parseHTML(tmpl);
// console.log("tree loaded");

let root = render(tmpl, {
    info: {
        showImage: true,
        showDate: true,
        name: "我的"
    },
    image: "https://img.t.sinajs.cn/t6/style/images/global_nav/WB_logo.png",
})

console.log("root loaded");


function render(template, object) {
    let root = document.getElementsByTagName("body")[0];
    let tree = parseHTML(template);

    for (let child of tree.children) {
        let c = _render(child, object);
        if (c !== null) {
            root.appendChild(c);
        }
    }
    return root;
}

function _render(node, object) {
    let el;
    if ("text" === node.type) {
        let content = node.content;
        el = document.createTextNode(process(content, object));
        return el;
    }
    if ("element" === node.type) {
        el = document.createElement(node.tagName);
        for (let attr of node.attributes) {
            if ("v-if" === attr.name) {
                if (!evalInScope(attr.value, object)) {
                    return null;
                }
                continue;
            }
            // todo 处理 {{}} 转换
            if (typeof attr.value === "string" && attr.value.match(/^{{.+}}$/)) {
                el.setAttribute(attr.name, evalInScope(attr.value, object));
            } else {
                el.setAttribute(attr.name, attr.value);
            }
        }
        for (let child of node.children) {
            let childEl = _render(child, object);
            if (childEl !== null) {
                el.appendChild(childEl);
            }
        }
    }
    return el;
}

function process(str, object) {
    let pointer = str.matchAll("{{(.+?)}}");
    let current = 0;
    let result = "";
    while (true) {
        let tempResult = pointer.next();
        if (tempResult.done) {
            break;
        }
        
        result += str.substring(current, tempResult.value.index);
        result += evalInScope(tempResult.value[1], object);
        current = tempResult.value.index + tempResult.value[0].length;
    }
    result += str.substring(current, str.length);
    return result;
}


// function evalInScopeOld(js, contextAsScope) {
//     //# Return the results of the in-line anonymous function we .call with the passed context
//     return function() { 
//         with(this) { 
//             return eval(js);
//          }; 
//     }.call(contextAsScope);
// }

function evalInScope(js, contextAsScope) {
    let fn = new Function(`with(this){return eval("${js}");}`);
    return fn.call(contextAsScope);
}