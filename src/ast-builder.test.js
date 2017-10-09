import buildAST from "./ast-builder";

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
  expect(buildAST(["hello", 3.14, "world"])).toEqual([
    { indent: 0, parts: [{ type: "array-start" }] },
    { indent: 1, parts: [{ type: "string", value: "hello" }] },
    { indent: 1, parts: [{ type: "number", value: 3.14 }] },
    { indent: 1, parts: [{ type: "string", value: "world" }] },
    { indent: 0, parts: [{ type: "array-end" }] }
  ]);
});

it("handles nested arrays", () => {
  expect(buildAST([["a", "b"], 3, [[], "c", [5, ["d"]]]])).toEqual([
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
    { indent: 3, parts: [{ type: "number", value: 5 }] },
    { indent: 3, parts: [{ type: "array-start" }] },
    { indent: 4, parts: [{ type: "string", value: "d" }] },
    { indent: 3, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 0, parts: [{ type: "array-end" }] }
  ]);
});

it("handles objects", () => {
  expect(buildAST({ name: "Misha", car: "Toyota" })).toEqual([
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
      parts: [
        { type: "string", value: "car" },
        { type: "string", value: "Toyota" }
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
          f: "hey"
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
      parts: [{ type: "string", value: "e" }, { type: "string", value: 5 }]
    },
    {
      indent: 3,
      parts: [{ type: "string", value: "f" }, { type: "string", value: "hey" }]
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
