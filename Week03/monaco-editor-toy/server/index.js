const http = require("http");
const path = require("path");
const fs = require("fs");
const querystring = require("querystring");
const child_process = require("child_process");

const rootDir = path.resolve("../app");
http
  .createServer(function (req, res) {
    if (req.method === "POST" && req.url.match(/^\/save\?/)) {
      return save(req, res);
    }
    if (req.method === "POST" && req.url.match(/^\/publish$/)) {
      return publish(req, res);
    }
    res.statusCode = 404;
    return res.end("error");
  })
  .listen(8082);

async function save(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let params = querystring.parse(req.url.substring(req.url.indexOf("?") + 1));
  let name = params["name"];
  let isExist = await fs.existsSync(path.resolve(rootDir, "src", name));
  if (!isExist) {
    res.statusCode = 500;
    res.end("文件不存在:" + path.resolve(rootDir, "src", name));
    return;
  }
  let writeStream = fs.createWriteStream(path.resolve(rootDir, "src", name));
  req.on("data", (chunk) => {
    writeStream.write(chunk);
  });
  req.on("end", () => {
    writeStream.end();
    res.write("success");
    res.end();
  });
}

function publish(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  child_process.exec(
    "npm run build",
    { cwd: rootDir },
    function (error, stdout, stderr) {
      console.log(error);
      console.log(stdout);
      console.log(stderr);
      res.setHeader("Access-Control-Allow-Origin", "*");

      res.write(stdout + "\n" + stderr);
      res.end();
    }
  );
}
