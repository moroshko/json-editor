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
  parts: Array<ItemPart>,
  isLast: boolean
};

function EditableObjectLine(props: Props): React.Node {
  const { indent, parts, isLast } = props;
  const [part1, part2, part3] = parts;
  const lastPart = parts[parts.length - 1];

  return (
    <div className="EditableObjectLine-container">
      <EditableObjectLineIndent indent={indent} />
      <EditableObjectLinePart
        type={part1.type}
        value={part1.value == null ? null : part1.value}
        key="part1"
      />
      {part1.type !== "string" || parts.length === 1 ? null : (
        <span className="EditableObjectLine/colon">: </span>
      )}
      {part2 == null ? null : (
        <EditableObjectLinePart
          type={part2.type}
          value={part2.value == null ? null : part2.value}
          key="part2"
        />
      )}
      {part3 == null ? null : (
        <EditableObjectLinePart
          type={part3.type}
          value={part3.value == null ? null : part3.value}
          key="part3"
        />
      )}
      {lastPart.type === "array-start" ||
      lastPart.type === "object-start" ||
      isLast ? null : (
        <span className="EditableObjectLine/comma">,</span>
      )}
    </div>
  );
}

export default EditableObjectLine;
