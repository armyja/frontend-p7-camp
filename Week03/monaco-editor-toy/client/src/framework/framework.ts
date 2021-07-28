export function createElement(type: any, attributes: Object, ...children: any) {
  let element: Component;
  if (typeof type === "string") {
    element = new ElementWrapper(type);
  } else {
    element = new type();
  }
  for (let name in attributes) {
    element.setAttribute(name, attributes[name]);
  }
  for (let child of children) {
    if (child === void 0) {
      continue;
    }
    if (typeof child === "string" || typeof child === "number") {
      child = new TextWrapper(String(child));
    }
    element.appendChild(child);
  }
  return element;
}

export class Component {
  root: any;
  constructor(type: string) {}
  setAttribute(name: any, value: any) {
    let _root = this.root as HTMLElement;
    _root.setAttribute(name, value);
  }
  appendChild(child: any) {
    child.mountTo(this.root || this.render());
  }
  mountTo(parent: Node | Component) {
    parent.appendChild(this.root || this.render());
  }
  public render() {
    return this.root as HTMLElement;
  }
}
class ElementWrapper extends Component {
  constructor(type: any) {
    super(type);
    this.root = document.createElement(type);
  }
}
class TextWrapper extends Component {
  constructor(content: string) {
    super(content);
    this.root = document.createTextNode(content);
  }
}
