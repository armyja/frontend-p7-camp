import * as monaco from "monaco-editor";
import "./index.css";
import { Component, createElement } from "./framework/framework";
import axios from "axios";
import { default as AnsiUp } from "ansi_up";
createElement;

const SERVER_URL = "http://localhost:8082";
const APP_URL = "http://localhost:3003";
const ansi_up = new AnsiUp();

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "json") {
      return "./json.worker.bundle.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
      return "./css.worker.bundle.js";
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return "./html.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  },
};
console.log(Object.keys(self));
let app: Component = <div class="editor" id="monaco-editor"></div>;
app.mountTo(document.getElementById("left-container") as HTMLElement);

let editor: monaco.editor.IStandaloneCodeEditor = monaco.editor.create(
  app.root,
  {
    value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
    language: "typescript",
  }
);

// 编辑器及时更新宽度
window.addEventListener("resize", () => {
  editor.layout();
});

/**
 * 打开文件
 */
let open: HTMLInputElement = document.getElementById(
  "fileInput"
) as HTMLInputElement;
open?.addEventListener("change", function selectedFileChanged() {
  if (this.files === null || this.files?.length === 0) {
    console.log("请选择文件。");
    return;
  }
  let file = this.files[0];
  const reader = new FileReader();
  reader.onload = function fileReadCompleted() {
    console.log(getLanguage(file.name));
    monaco.editor.setModelLanguage(editor.getModel()!, getLanguage(file.name));
    editor.setValue(reader.result + "");
  };
  reader.readAsText(this.files[0]);
});

let preview: HTMLButtonElement = document.getElementById(
  "preview"
) as HTMLButtonElement;
preview.addEventListener("click", function preview() {
  if (!open || !open.files || !open.files[0]) {
    alert("请打开文件");
    return;
  }
  // 保存
  axios
    .post("/save", editor.getValue(), {
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
      },
      baseURL: SERVER_URL,
      params: {
        name: open.files[0].name,
      },
    })
    .then(function (response) {
      // 发布
      axios
        .post("/publish", "", {
          baseURL: SERVER_URL,
        })
        .then(function (response) {
          log(response.data);
          refresh();
        })
        .catch(function (error) {
          if (error && error.response && error.response.data) {
            alert(error.response.data);
          } else {
            log(error);
          }
        });
    })
    .catch(function (error) {
      if (error && error.response && error.response.data) {
        alert(error.response.data);
      } else {
        log(error);
      }
    });
});

function log(str) {
  let textArea: HTMLPreElement = document.getElementById(
    "console"
  ) as HTMLPreElement;
  console.log(ansi_up.ansi_to_html(str));
  textArea.innerHTML += ansi_up.ansi_to_html(str);
  textArea.scrollTo({ top: textArea.scrollHeight });
}

let previewWindow: Component = (
  <iframe class="preview-window" src={APP_URL}></iframe>
);
previewWindow.mountTo(
  document.getElementById("right-container") as HTMLElement
);
/**
 * 刷新 App
 */
function refresh() {
  previewWindow.root.src = APP_URL;
}

/**
 * 根据文件名后缀适配 monaco-editor 使用的文件类型
 * @param name
 * @returns string
 */
function getLanguage(name: String) {
  if (name.endsWith(".js")) {
    return "javascript";
  }
  if (name.endsWith(".jsx")) {
    return "javascriptreact";
  }
  if (name.endsWith(".ts")) {
    return "typescript";
  }
  if (name.endsWith(".tsx")) {
    return "typescriptreact";
  }
  if (name.endsWith(".html")) {
    return "html";
  }
  if (name.endsWith(".json")) {
    return "json";
  }
  if (name.endsWith(".css")) {
    return "css";
  }
  return "plaintext";
}
