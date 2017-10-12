// @flow

import "./css/EditableObjectLine.css";

import type { ItemPart } from "../types";

const React = require("react");
const EditableObjectLineIndent = require("./EditableObjectLineIndent.react")
  .default;
const EditableObjectLinePart = require("./EditableObjectLinePart.react")
  .default;

type Props = {
  indent: number,
  parts: Array<ItemPart>
};

function EditableObjectLine(props: Props): React.Node {
  const { indent, parts } = props;

  return (
    <div className="EditableObjectLine-container">
      <EditableObjectLineIndent indent={indent} />
      {parts.map((part, index) => (
        <EditableObjectLinePart
          type={part.type}
          value={part.value == null ? null : part.value}
          key={index}
        />
      ))}
    </div>
  );
}

export default EditableObjectLine;
