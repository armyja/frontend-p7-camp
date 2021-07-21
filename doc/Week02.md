# 第02周

## 数组中的第K大元素

代码位于 `Week02/215.数组中的第k个最大元素.js`

## 实现下面代码中的 render 方法，并将模板字符串渲染成 DOM。

```javascript
let tmpl = `<div class="newslist">
    <div class="img" v-if="info.showImage"><img src="{{image}}"/></div>
    <div class="date" v-if="info.showDate">{{info.name}}</div>
    <div class="img">{{info.name}}</div>
</div>`;
 
render(tmpl, {
	image: "some img", 
    info: {showImage: true, showDate:false, name: "aaa"}
})
```

代码位于 `Week02/parser` 文件夹，启用 `httpserver` 访问 `Week02/parser/index.js` 即可看到效果。  

`Week02/parser/parser.js` 为状态机，接收 `template` 生成虚拟 DOM。 `Week02/parser/index.js` 将虚拟 DOM转化为 DOM渲染到浏览器。