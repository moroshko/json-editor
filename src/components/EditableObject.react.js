// @flow

const React = require("react");
const getObjectLines = require("../object-lines").default;
const EditableObjectLine = require("./EditableObjectLine.react").default;

type Props = {
  object: Object
};

class EditableObject extends React.Component<Props> {
  render(): React.Node {
    const { object } = this.props;

    return (
      <div>
        {getObjectLines(object).map((line, index) => (
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
