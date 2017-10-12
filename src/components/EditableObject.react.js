// @flow

import "./css/EditableObject.css";

const React = require("react");
const getObjectLines = require("../object-lines").default;
const EditableObjectLine = require("./EditableObjectLine.react").default;

type Props = {
  object: Object
};

function EditableObject(props: Props): React.Node {
  const { object } = props;
  const objectLines = getObjectLines(object);

  return (
    <div className="EditableObject-container">
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

export default EditableObject;
