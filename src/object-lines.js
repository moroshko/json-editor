// @flow

import type {
  DataType,
  ArrayStartItemPart,
  ArrayEndItemPart,
  ObjectStartItemPart,
  ObjectEndItemPart,
  ItemPart
} from "./types";

export type ResultItem = {|
  indent: number,
  parts: Array<ItemPart>
|};

export type QueueResultItem = {|
  isResultItem: true,
  indent: number,
  parts: Array<ItemPart>
|};

export type QueueNonResultItem = {|
  isResultItem: false,
  indent: number,
  key: ?string,
  data: any
|};

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
      /*
        Cases are repetetive due to Flow issue.
        See: https://fb.facebook.com/groups/flow/permalink/1633562116692397/
       */
      case "boolean": {
        result.push({
          indent,
          parts: addKeyIfExists(key, [{ type: "boolean", value: data }])
        });
        break;
      }

      case "number": {
        result.push({
          indent,
          parts: addKeyIfExists(key, [{ type: "number", value: data }])
        });
        break;
      }

      case "string": {
        result.push({
          indent,
          parts: addKeyIfExists(key, [{ type: "string", value: data }])
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
