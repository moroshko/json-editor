// @flow

import "./css/EditableObjectLineIndent.css";

const React = require("react");

type Props = {
  indent: number
};

function EditableObjectLineIndent(props: Props): React.Node {
  const { indent } = props;

  if (indent === 0) {
    return null;
  }

  return (
    <span className="EditableObjectLineIndent-container">
      {"  ".repeat(indent)}
    </span>
  );
}

export default EditableObjectLineIndent;
