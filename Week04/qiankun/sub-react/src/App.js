import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {content: null};
  }
  getStyle() {
    return {height: this.state.height ? this.state.height + 'px' : 'auto'}
  }
  render() {
    const content = this.state.content;
    const style = this.getStyle();
    return (
      <div className="App">
        { !content && 
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          </header>
        }
        {content &&  <div style={style} className="content" dangerouslySetInnerHTML = {{ __html: content.description }} /> }
      </div>
    );
  }
}

export default App;
