const cluster = require("cluster");
const numCPUs = 2;
// const numCPUs = require("os").cpus().length;
const process = require("process");
const ws = require("nodejs-websocket");
const connMap = new Map();
const workerConnWeakMap = new WeakMap();
const workerPool = [];
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // 衍生工作进程。
  for (let i = 1; i <= numCPUs; i++) {
    let worker = cluster.fork();
    workerPool[i] = worker.id;
    register(worker);
  }

  let toSolve = 0;
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  var server = ws
    .createServer(function (conn) {
      const key = conn.key;
      connMap.set(key, conn);

      conn.on("text", function (str) {
        toSolve = next(toSolve);
        console.log("Dispatch to " + toSolve);
        let worker = cluster.workers[toSolve];
        workerConnWeakMap.set(worker, conn);
        worker.send({ key: key, data: str });
      });
      conn.on("close", function (code, reason) {
        console.log("Connection closed");
        connMap.delete(key);
      });
    })
    .listen(8001);
} else {
  let times = 0;
  const MaxLife = 2;
  process.on("message", function (data) {
    if (data.key && data.data) {
      if (data.data.indexOf("shit") !== -1) {
        throw new Error("oh no!" + data.key);
      }
      process.send({
        key: data.key,
        result: `${cluster.worker.id} 号机器人 ${process.pid} 处理 ${data.data} 中...`,
      });
      
      setTimeout(() => {
        let result = '';
        try {
            result = eval(data.data);
        } catch (error) {
            result = error.stack.replace(error.message, '')
        }
        process.send({
            key: data.key,
            result: `${cluster.worker.id} 号机器人 ${process.pid} 处理 ${data.data} 完毕，结果为 ${result}`,
        });
      }, 1000);
    }
    times++;
    if (times >= MaxLife) {
        setTimeout(() => {
            process.exit();
        }, 1100);
    }
  });
}

function next(toSolve) {
  return workerPool[(toSolve % numCPUs) + 1];
}

function register(worker) {
  const id = worker.id;
  worker.on("message", function (data) {
    if (data.key && data.result) {
      connMap.get(data.key).sendText(data.result);
      workerConnWeakMap.delete(worker);
    }
  });
  worker.on("exit", (code, signal) => {
    if (signal) {
      console.log(`worker ${id} was killed by signal: ${signal}`);
      workerConnWeakMap.get(worker).sendText("Internal Error");
    } else if (code !== 0) {
      console.log(`worker ${id} exited with error code: ${code}`);
      workerConnWeakMap.get(worker).sendText("Internal Error");
    } else {
      console.log(`worker ${id} success!`);
    }
    workerConnWeakMap.delete(worker);
    let newWorker = cluster.fork();
    workerPool[workerPool.indexOf(id)] = newWorker.id;
    register(newWorker);
  });
}
