// @flow

import "./App.css";

const React = require("react");
// const EditableText = require("./components/EditableText.react").default;
const EditableObject = require("./components/EditableObject.react").default;

const object = {
  accuracy: {
    points: ["45", "98"],
    points_threshold: 0.25
  },
  tool: {
    gold_rate: 0.75
  },
  sets: {
    left_eye: {
      title: "Left eye and brow",
      points: {
        "18": {
          key: "a"
        },
        "19": {
          key: "b"
        }
      },
      links: {
        "18": ["19", "57"],
        "19": ["87"]
      }
    },
    right_eye: {
      title: "Right eye and brow",
      points: {
        "67": {
          key: "c"
        },
        "89": {
          key: "d"
        }
      },
      links: {
        "67": ["89"]
      }
    }
  },
  examples: {
    left_eye: {
      urls: ["a.jpg", "b.mp4"]
    },
    right_eye: {
      urls: ["c.png"]
    }
  }
};

type Props = {};

class App extends React.Component<Props> {
  onTextChange(newText: string) {
    console.log(`Changed to [${newText}]`);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Editable Object</h1>
        </header>
        <div className="App-intro">
          {/* <EditableText text="hello" onTextChange={this.onTextChange} /> */}
          <div
            style={{
              backgroundColor: "#ddd"
            }}
          >
            <EditableObject object={object} />
          </div>
          <div
            style={{
              backgroundColor: "#eee",
              width: 320,
              height: 500,
              marginLeft: 20
            }}
          >
            <textarea
              style={{
                fontFamily: "monospace",
                fontSize: 14,
                width: "100%",
                height: "100%"
              }}
              value={JSON.stringify(object, null, 2)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
