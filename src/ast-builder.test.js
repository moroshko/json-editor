import buildAST from "./ast-builder";

it("handles booleans", () => {
  expect(buildAST(false)).toEqual([
    { indent: 0, parts: [{ type: "boolean", value: false }] }
  ]);
});

it("handles numbers", () => {
  expect(buildAST(3.14)).toEqual([
    { indent: 0, parts: [{ type: "number", value: 3.14 }] }
  ]);
});

it("handles strings", () => {
  expect(buildAST("hello")).toEqual([
    { indent: 0, parts: [{ type: "string", value: "hello" }] }
  ]);
});

it("handles arrays", () => {
  expect(buildAST([true, 3.14, "world"])).toEqual([
    { indent: 0, parts: [{ type: "array-start" }] },
    { indent: 1, parts: [{ type: "boolean", value: true }] },
    { indent: 1, parts: [{ type: "number", value: 3.14 }] },
    { indent: 1, parts: [{ type: "string", value: "world" }] },
    { indent: 0, parts: [{ type: "array-end" }] }
  ]);
});

it("handles nested arrays", () => {
  expect(buildAST([["a", "b"], 3, [[], "c", [false, ["d"]]]])).toEqual([
    { indent: 0, parts: [{ type: "array-start" }] },
    { indent: 1, parts: [{ type: "array-start" }] },
    { indent: 2, parts: [{ type: "string", value: "a" }] },
    { indent: 2, parts: [{ type: "string", value: "b" }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "number", value: 3 }] },
    { indent: 1, parts: [{ type: "array-start" }] },
    { indent: 2, parts: [{ type: "array-start" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "string", value: "c" }] },
    { indent: 2, parts: [{ type: "array-start" }] },
    { indent: 3, parts: [{ type: "boolean", value: false }] },
    { indent: 3, parts: [{ type: "array-start" }] },
    { indent: 4, parts: [{ type: "string", value: "d" }] },
    { indent: 3, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 0, parts: [{ type: "array-end" }] }
  ]);
});

it("handles objects", () => {
  expect(buildAST({ name: "Misha", age: 20, isHappy: true })).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [
        { type: "string", value: "name" },
        { type: "string", value: "Misha" }
      ]
    },
    {
      indent: 1,
      parts: [{ type: "string", value: "age" }, { type: "number", value: 20 }]
    },
    {
      indent: 1,
      parts: [
        { type: "string", value: "isHappy" },
        { type: "boolean", value: true }
      ]
    },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles nested objects", () => {
  expect(
    buildAST({
      a: "b",
      c: {
        d: {
          e: 5,
          f: true
        }
      },
      g: {}
    })
  ).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "a" }, { type: "string", value: "b" }]
    },
    {
      indent: 1,
      parts: [{ type: "string", value: "c" }, { type: "object-start" }]
    },
    {
      indent: 2,
      parts: [{ type: "string", value: "d" }, { type: "object-start" }]
    },
    {
      indent: 3,
      parts: [{ type: "string", value: "e" }, { type: "number", value: 5 }]
    },
    {
      indent: 3,
      parts: [{ type: "string", value: "f" }, { type: "boolean", value: true }]
    },
    { indent: 2, parts: [{ type: "object-end" }] },
    { indent: 1, parts: [{ type: "object-end" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "g" }, { type: "object-start" }]
    },
    { indent: 1, parts: [{ type: "object-end" }] },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles complex JSON", () => {
  expect(
    buildAST([
      {
        a: 5,
        b: [false, {}],
        c: []
      },
      true,
      3.14,
      [
        {
          d: "hi"
        },
        false
      ]
    ])
  ).toEqual([
    { indent: 0, parts: [{ type: "array-start" }] },
    { indent: 1, parts: [{ type: "object-start" }] },
    {
      indent: 2,
      parts: [{ type: "string", value: "a" }, { type: "number", value: 5 }]
    },
    {
      indent: 2,
      parts: [{ type: "string", value: "b" }, { type: "array-start" }]
    },
    { indent: 3, parts: [{ type: "boolean", value: false }] },
    { indent: 3, parts: [{ type: "object-start" }] },
    { indent: 3, parts: [{ type: "object-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    {
      indent: 2,
      parts: [{ type: "string", value: "c" }, { type: "array-start" }]
    },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "object-end" }] },
    { indent: 1, parts: [{ type: "boolean", value: true }] },
    { indent: 1, parts: [{ type: "number", value: 3.14 }] },
    { indent: 1, parts: [{ type: "array-start" }] },
    { indent: 2, parts: [{ type: "object-start" }] },
    {
      indent: 3,
      parts: [{ type: "string", value: "d" }, { type: "string", value: "hi" }]
    },
    { indent: 2, parts: [{ type: "object-end" }] },
    { indent: 2, parts: [{ type: "boolean", value: false }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 0, parts: [{ type: "array-end" }] }
  ]);
});
