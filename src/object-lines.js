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
  data: any,
  hasTrailingComma: boolean
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

function decorate(
  key: ?string,
  parts: Array<ItemPart>,
  hasTrailingComma: boolean
): Array<ItemPart> {
  return [
    ...(key == null ? [] : [{ type: "string", value: key }, { type: "colon" }]),
    ...parts,
    ...(hasTrailingComma ? [{ type: "comma" }] : [])
  ];
}

function getObjectLines(object: Object): Array<ResultItem> {
  let result: Array<ResultItem> = [];
  let queue: Array<QueueResultItem | QueueNonResultItem> = [
    {
      isResultItem: false,
      indent: 0,
      key: null,
      data: object,
      hasTrailingComma: false
    }
  ];

  while (queue.length > 0) {
    const item = queue.shift();

    if (item.isResultItem) {
      const { isResultItem, ...restItem } = item;

      result.push(restItem);
      continue;
    }

    const { indent, key, data, hasTrailingComma } = item;
    const type = getType(data);

    switch (type) {
      /*
        Cases are repetetive due to Flow issue.
        See: https://fb.facebook.com/groups/flow/permalink/1633562116692397/
       */
      case "boolean": {
        result.push({
          indent,
          parts: decorate(
            key,
            [{ type: "boolean", value: data }],
            hasTrailingComma
          )
        });
        break;
      }

      case "number": {
        result.push({
          indent,
          parts: decorate(
            key,
            [{ type: "number", value: data }],
            hasTrailingComma
          )
        });
        break;
      }

      case "string": {
        result.push({
          indent,
          parts: decorate(
            key,
            [{ type: "string", value: data }],
            hasTrailingComma
          )
        });
        break;
      }

      case "array": {
        if (data.length === 0) {
          result.push({
            indent,
            parts: decorate(key, [arrayStart, arrayEnd], hasTrailingComma)
          });
          break;
        }

        const lastDataIndex = data.length - 1;

        queue.unshift(
          {
            isResultItem: true,
            indent,
            parts: decorate(key, [arrayStart], false)
          },
          ...data.map((item, index) => ({
            isResultItem: false,
            indent: indent + 1,
            key: null,
            data: item,
            hasTrailingComma: index !== lastDataIndex
          })),
          {
            isResultItem: true,
            indent,
            parts: decorate(null, [arrayEnd], hasTrailingComma)
          }
        );
        break;
      }

      case "object": {
        const keys = Object.keys(data);

        if (keys.length === 0) {
          result.push({
            indent,
            parts: decorate(key, [objectStart, objectEnd], hasTrailingComma)
          });
          break;
        }

        const lastKeysIndex = keys.length - 1;

        queue.unshift(
          {
            isResultItem: true,
            indent,
            parts: decorate(key, [objectStart], false)
          },
          ...keys.map((key, index) => ({
            isResultItem: false,
            indent: indent + 1,
            key,
            data: data[key],
            hasTrailingComma: index !== lastKeysIndex
          })),
          {
            isResultItem: true,
            indent,
            parts: decorate(null, [objectEnd], hasTrailingComma)
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
