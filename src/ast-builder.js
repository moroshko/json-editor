// @flow

type DataType = "number" | "string" | "array" | "object" | "unknown";

function getType(data: any): DataType {
  const type = typeof data;

  switch (type) {
    case "number":
    case "string":
      return type;

    case "object":
      return Array.isArray(data) ? "array" : type;

    default:
      return "unknown";
  }
}

type ASTItemPartType =
  | "number"
  | "string"
  | "array-start"
  | "array-end"
  | "object-start"
  | "object-end";

type ASTItemPart = {
  type: ASTItemPartType,
  value?: "number" | "string"
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
            parts: [
              {
                type: "array-end"
              }
            ]
          });
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
        if (includeParens) {
          queue.unshift({
            isResultItem: true,
            indent,
            parts: [
              {
                type: "object-end"
              }
            ]
          });
        }

        queue.unshift(
          ...Object.keys(data).reduce((acc, key) => {
            const value = data[key];
            const valueType = getType(value);

            switch (valueType) {
              case "number":
              case "string":
                return acc.concat({
                  isResultItem: true,
                  indent: indent + 1,
                  parts: [
                    {
                      type: "string",
                      value: key
                    },
                    {
                      type: "string",
                      value: data[key]
                    }
                  ]
                });

              case "array":
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
                    indent: indent + 2,
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

              case "object":
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
