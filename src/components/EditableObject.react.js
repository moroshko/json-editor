// @flow

import "./css/EditableObject.css";

const React = require("react");
const getObjectLines = require("../object-lines").default;
const EditableObjectLine = require("./EditableObjectLine.react").default;

type Props = {
  object: Object
};

class EditableObject extends React.Component<Props> {
  onClick = event => {
    console.log(event.target.textContent);

    const {
      left: containerLeft,
      top: containerTop
    } = this.container.getBoundingClientRect();
    const leftClick = event.clientX - containerLeft;
    const topClick = event.clientY - containerTop;

    console.log({ leftClick, topClick });
  };

  render(): React.Node {
    const { object } = this.props;
    const objectLines = getObjectLines(object);

    return (
      <div
        className="EditableObject-container"
        onClick={this.onClick}
        ref={ref => {
          this.container = ref;
        }}
      >
        {objectLines.map((line, index) => (
          <EditableObjectLine
            indent={line.indent}
            parts={line.parts}
            key={index}
          />
        ))}
      </div>
    );
  }
}

export default EditableObject;
