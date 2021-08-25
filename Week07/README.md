# 作业

用 Express 或 Koa 或 Nest 或 Fastify 实现练习 Fastify 里的以下功能：

- [x] MySQL
- [x] Redis
- [x] MongoDB
- [ ] ElasticSearch （单独启动报错）

# 快速上手

```bash
docker-compose up
# 访问 http://localhost:3000 ，参数详见 server.js
```

ElasticSearch （单独启动报错）

```bash
elasticsearch_1  | Exception in thread "main" java.io.IOException: Cannot run program "/usr/share/elasticsearch/jdk/bin/java": error=0, Failed to exec spawn helper: pid: 296, exit
value: 1
elasticsearch_1  |      at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1142)
elasticsearch_1  |      at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1073)
elasticsearch_1  |      at org.elasticsearch.tools.launchers.JvmOption.flagsFinal(JvmOption.java:102)
elasticsearch_1  |      at org.elasticsearch.tools.launchers.JvmOption.findFinalOptions(JvmOption.java:79)
elasticsearch_1  |      at org.elasticsearch.tools.launchers.MachineDependentHeap.determineHeapSettings(MachineDependentHeap.java:61)
elasticsearch_1  |      at org.elasticsearch.tools.launchers.JvmOptionsParser.jvmOptions(JvmOptionsParser.java:135)
elasticsearch_1  |      at org.elasticsearch.tools.launchers.JvmOptionsParser.main(JvmOptionsParser.java:87)
elasticsearch_1  | Caused by: java.io.IOException: error=0, Failed to exec spawn helper: pid: 296, exit value: 1
elasticsearch_1  |      at java.base/java.lang.ProcessImpl.forkAndExec(Native Method)
elasticsearch_1  |      at java.base/java.lang.ProcessImpl.<init>(ProcessImpl.java:313)
elasticsearch_1  |      at java.base/java.lang.ProcessImpl.start(ProcessImpl.java:244)
elasticsearch_1  |      at java.base/java.lang.ProcessBuilder.start(ProcessBuilder.java:1109)
```