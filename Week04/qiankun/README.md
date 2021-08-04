# qiankun-example

qiankun 实战 demo，父应用 vue，子应用用 react 和 vue

[微前端qiankun从搭建到部署的实践](https://juejin.im/post/6875462470593904653)

## 开始
一键安装所有主子应用的依赖
```
npm i
```

一键启动所有所有应用
```
npm start
```
通过 [http://localhost:8080/](http://localhost:8080/) 访问主应用。

## docker 部署

```bash
docker pull node:latest
docker run -it -p 8080:8080 -p 7777:7777 -p 7788:7788 -p 8099:8099 --name armyja_qiankun node /bin/sh
```


```bash
docker pull node:latest
docker run -it -p 8080:8080 -p 7777:7777 -p 7788:7788 -p 8099:8099 --name armyja_qiankun node /bin/sh
```

```bash
# pwd : Week04/
docker cp .\qiankun\ [containerId]:/root
docker cp .\start.sh [containerId]:/root
```

```bash
# pwd : /
cd /root/qiankun
npm i
cd ..
sh start.sh # 打开 http://localhost:8080
exit # 退出容器
```

```
docker commit -m="has update" -a="armyja" [containerId] armyja/node:v1
docker run -it -p 8080:8080 -p 7777:7777 -p 7788:7788 -p 8099:8099 --name armyja_qiankun_v1 armyja/node:v1 /bin/sh /root/start.sh
```