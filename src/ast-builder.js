// @flow

type PrimitiveDataType = "boolean" | "number" | "string";

type DataType = PrimitiveDataType | "array" | "object";

function getType(data: any): ?DataType {
  const type = typeof data;

  switch (type) {
    case "boolean":
    case "number":
    case "string":
      return type;

    case "object":
      return Array.isArray(data) ? "array" : type;
  }
}

type ASTItemPartType =
  | PrimitiveDataType
  | "array-start"
  | "array-end"
  | "object-start"
  | "object-end";

type ASTItemPart = {
  type: ASTItemPartType,
  value?: PrimitiveDataType
};

type ResultItem = {|
  indent: number,
  parts: Array<ASTItemPart>
|};

type QueueResultItem = {|
  isResultItem: true,
  indent: number,
  parts: Array<ASTItemPart>
|};

type QueueNonResultItem = {|
  isResultItem: false,
  indent: number,
  data: any,
  includeParens: boolean
|};

function buildAST(data: any): Array<ResultItem> {
  let result: Array<ResultItem> = [];
  let queue: Array<QueueResultItem | QueueNonResultItem> = [
    { isResultItem: false, indent: 0, data, includeParens: true }
  ];

  while (queue.length > 0) {
    const item = queue.shift();

    if (item.isResultItem) {
      const { isResultItem, ...restItem } = item;

      result.push(restItem);
      continue;
    }

    const { indent, data, includeParens } = item;
    const type = getType(data);

    switch (type) {
      case "boolean":
      case "number":
      case "string": {
        result.push({
          indent,
          parts: [
            {
              type,
              value: data
            }
          ]
        });
        break;
      }

      case "array": {
        if (includeParens) {
          queue.unshift({
            isResultItem: true,
            indent,
            parts:
              data.length === 0
                ? [
                    {
                      type: "array-start"
                    },
                    {
                      type: "array-end"
                    }
                  ]
                : [
                    {
                      type: "array-end"
                    }
                  ]
          });
        }

        if (data.length === 0) {
          break;
        }

        queue.unshift(
          ...data.map(d => ({
            isResultItem: false,
            indent: indent + 1,
            data: d,
            includeParens: true
          }))
        );

        if (includeParens) {
          queue.unshift({
            isResultItem: true,
            indent,
            parts: [
              {
                type: "array-start"
              }
            ]
          });
        }
        break;
      }

      case "object": {
        const dataKeys = Object.keys(data);

        if (includeParens) {
          queue.unshift({
            isResultItem: true,
            indent,
            parts:
              dataKeys.length === 0
                ? [
                    {
                      type: "object-start"
                    },
                    {
                      type: "object-end"
                    }
                  ]
                : [
                    {
                      type: "object-end"
                    }
                  ]
          });
        }

        if (dataKeys.length === 0) {
          break;
        }

        queue.unshift(
          ...dataKeys.reduce((acc, key) => {
            const value = data[key];
            const valueType = getType(value);

            switch (valueType) {
              case "boolean":
              case "number":
              case "string": {
                return acc.concat({
                  isResultItem: true,
                  indent: indent + 1,
                  parts: [
                    {
                      type: "string",
                      value: key
                    },
                    {
                      type: valueType,
                      value
                    }
                  ]
                });
              }

              case "array": {
                if (value.length === 0) {
                  return acc.concat({
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "string",
                        value: key
                      },
                      {
                        type: "array-start"
                      },
                      {
                        type: "array-end"
                      }
                    ]
                  });
                }

                return acc.concat(
                  {
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "string",
                        value: key
                      },
                      {
                        type: "array-start"
                      }
                    ]
                  },
                  {
                    isResultItem: false,
                    indent: indent + 1,
                    data: value,
                    includeParens: false
                  },
                  {
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "array-end"
                      }
                    ]
                  }
                );
              }

              case "object": {
                if (Object.keys(value).length === 0) {
                  return acc.concat({
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "string",
                        value: key
                      },
                      {
                        type: "object-start"
                      },
                      {
                        type: "object-end"
                      }
                    ]
                  });
                }

                return acc.concat(
                  {
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "string",
                        value: key
                      },
                      {
                        type: "object-start"
                      }
                    ]
                  },
                  {
                    isResultItem: false,
                    indent: indent + 1,
                    data: value,
                    includeParens: false
                  },
                  {
                    isResultItem: true,
                    indent: indent + 1,
                    parts: [
                      {
                        type: "object-end"
                      }
                    ]
                  }
                );
              }

              default:
                return acc;
            }
          }, [])
        );

        if (includeParens) {
          queue.unshift({
            isResultItem: true,
            indent,
            parts: [
              {
                type: "object-start"
              }
            ]
          });
        }
        break;
      }
    }
  }

  return result;
}

export default buildAST;
