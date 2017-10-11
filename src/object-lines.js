// @flow

type DataType = "boolean" | "number" | "string" | "array" | "object";

function getType(data: any): ?DataType {
  const type = typeof data;

  switch (type) {
    case "boolean":
    case "number":
    case "string":
      return type;

    case "object":
      return Array.isArray(data) ? "array" : type;

    default:
      return null;
  }
}

type BooleanItemPart = {|
  type: "boolean",
  value: boolean
|};

type numberItemPart = {|
  type: "number",
  value: number
|};

type StringItemPart = {|
  type: "string",
  value: string
|};

type ArrayStartItemPart = {|
  type: "array-start"
|};

type ArrayEndItemPart = {
  type: "array-end"
};

type ObjectStartItemPart = {
  type: "object-start"
};

type ObjectEndItemPart = {
  type: "object-end"
};

type ItemPart =
  | BooleanItemPart
  | numberItemPart
  | StringItemPart
  | ArrayStartItemPart
  | ArrayEndItemPart
  | ObjectStartItemPart
  | ObjectEndItemPart;

type ResultItem = {|
  indent: number,
  parts: Array<ItemPart>
|};

type QueueResultItem = {|
  isResultItem: true,
  indent: number,
  parts: Array<ItemPart>
|};

type QueueNonResultItem = {|
  isResultItem: false,
  indent: number,
  key: ?string,
  data: any
|};

const arrayStart: ArrayStartItemPart = {
  type: "array-start"
};

const arrayEnd: ArrayEndItemPart = {
  type: "array-end"
};

const objectStart: ObjectStartItemPart = {
  type: "object-start"
};

const objectEnd: ObjectEndItemPart = {
  type: "object-end"
};

function addKeyIfExists(key: ?string, parts: Array<ItemPart>) {
  return key == null ? parts : [{ type: "string", value: key }, ...parts];
}

function getObjectLines(object: Object): Array<ResultItem> {
  let result: Array<ResultItem> = [];
  let queue: Array<QueueResultItem | QueueNonResultItem> = [
    {
      isResultItem: false,
      indent: 0,
      key: null,
      data: object
    }
  ];

  while (queue.length > 0) {
    const item = queue.shift();

    if (item.isResultItem) {
      const { isResultItem, ...restItem } = item;

      result.push(restItem);
      continue;
    }

    const { indent, data, key } = item;
    const type = getType(data);

    switch (type) {
      case "boolean":
      case "number":
      case "string": {
        result.push({
          indent,
          parts: addKeyIfExists(key, [{ type, value: data }])
        });
        break;
      }

      case "array": {
        if (data.length === 0) {
          result.push({
            indent,
            parts: addKeyIfExists(key, [arrayStart, arrayEnd])
          });
          break;
        }

        queue.unshift(
          {
            isResultItem: true,
            indent,
            parts: addKeyIfExists(key, [arrayStart])
          },
          ...data.map(item => ({
            isResultItem: false,
            indent: indent + 1,
            key: null,
            data: item
          })),
          {
            isResultItem: true,
            indent,
            parts: [arrayEnd]
          }
        );
        break;
      }

      case "object": {
        const keys = Object.keys(data);

        if (keys.length === 0) {
          result.push({
            indent,
            parts: addKeyIfExists(key, [objectStart, objectEnd])
          });
          break;
        }

        queue.unshift(
          {
            isResultItem: true,
            indent,
            parts: addKeyIfExists(key, [objectStart])
          },
          ...keys.map(key => ({
            isResultItem: false,
            indent: indent + 1,
            key,
            data: data[key]
          })),
          {
            isResultItem: true,
            indent,
            parts: [objectEnd]
          }
        );
        break;
      }

      default:
        break;
    }
  }

  return result;
}

export default getObjectLines;
