# Monaco Editor 玩具

使用 Monaco Editor 打造可在线编译的编辑器。

# 端口说明
`app` 文件夹的应用，使用端口 `3003`。  
`server` 文件夹的应用，使用端口 `8082`。  
`client` 文件夹的应用，使用端口 `3000`。  

# 快速开始

- 执行 `npm install` 安装依赖。  
- 执行 `npm run app` 启动 `app` 服务。  
- 新开终端，执行 `npm run server`，启动 `server` 服务。  
- 新开终端，执行 `npm run client`，启动 `client` 服务。  

- 打开 `http://localhost:3000`。  
- 点击 `选择文件`，选择 `./app/src/index.ts`。
- 在编辑器编辑文件，然后点击 `预览` 按钮。
- 日志文本框输出编译结果。若编译成功， 右侧 `iframe` 重新加载编译后的内容。 