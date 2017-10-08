// @flow

import "./App.css";

const React = require("react");
const EditableText = require("./components/EditableText.react").default;

type Props = {};

class App extends React.Component<Props> {
  onTextChange(newText: string) {
    console.log(`Changed to [${newText}]`);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">JSON Editor</h1>
        </header>
        <div className="App-intro">
          <EditableText text="hello" onTextChange={this.onTextChange} />
        </div>
      </div>
    );
  }
}

export default App;
