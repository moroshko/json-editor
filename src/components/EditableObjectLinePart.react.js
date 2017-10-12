// @flow

const React = require("react");

type Props = {
  type:
    | "boolean"
    | "number"
    | "string"
    | "array-start"
    | "array-end"
    | "object-start"
    | "object-end"
    | "colon"
    | "comma",
  value: ?(boolean | number | string)
};

function EditableObjectLinePart(props: Props): React.Node {
  const { type, value } = props;
  /* Needed because otherwise, if value === false, JSX would render nothing. */
  const valueStr = String(value);

  switch (type) {
    case "boolean": {
      return <span className="EditableObjectLinePart/boolean">{valueStr}</span>;
    }

    case "number": {
      return <span className="EditableObjectLinePart/number">{valueStr}</span>;
    }

    case "string": {
      return (
        <span className="EditableObjectLinePart/string">"{valueStr}"</span>
      );
    }

    case "array-start": {
      return <span className="EditableObjectLinePart/array-paren">[</span>;
    }

    case "array-end": {
      return <span className="EditableObjectLinePart/array-paren">]</span>;
    }

    case "object-start": {
      return (
        <span className="EditableObjectLinePart/object-paren">&#123;</span>
      );
    }

    case "object-end": {
      return (
        <span className="EditableObjectLinePart/object-paren">&#125;</span>
      );
    }

    case "colon": {
      return <span className="EditableObjectLinePart/colon">: </span>;
    }

    case "comma": {
      return <span className="EditableObjectLinePart/comma">,</span>;
    }

    default:
      return null;
  }
}

export default EditableObjectLinePart;
