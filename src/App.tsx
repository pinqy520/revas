import React, { useEffect } from 'react';
import logo from './logo.svg';
import test from './lib'
import './App.css';
import { Node } from './lib/Node';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
    </div>
  );
}

function Test() {
  const [size, setSize] = React.useState(100)
  useEffect(() => {
    setTimeout(() => {
      setSize(200 * Math.random())
    }, 100);
  }, [])
  return React.createElement('View', { width: 400, height: 400 },
    React.createElement('View', { width: 100, height: 100 }),
    React.createElement('View', { width: size, height: size })
  )
}

const root = new Node('Root', { width: 500, height: 500 })

test.render(
  React.createElement(Test),
  root
)

export default App;
