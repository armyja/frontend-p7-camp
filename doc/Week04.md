# 第04周

## 微前端应用 + docker 部署

### 作业要求

用微前端框架实现一个阅读网站，左侧点击文章，右侧显示文章详情

参考： https://github.com/GeekFECampus/module2/tree/master/singlespa/qiankun

### 作业描述

左侧 vue 显示文章列表，右侧 react 显示文章详情。
vue 向 server 发起请求，获取 IT之家 的 RSS 数据（文章信息）。vue 监听列表点击事件，将文章内容发送至父应用。
react 监听 父应用的 state，更新文章内容到界面上。

详见 `/Week04/qiankun/README.md`。 