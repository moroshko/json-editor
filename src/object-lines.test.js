import getObjectLines from "./object-lines";

it("handles empty object", () => {
  expect(getObjectLines({})).toEqual([
    { indent: 0, parts: [{ type: "object-start" }, { type: "object-end" }] }
  ]);
});

it("handles primitives", () => {
  expect(getObjectLines({ name: "Misha", age: 38, isHappy: true })).toEqual([
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
      parts: [{ type: "string", value: "age" }, { type: "number", value: 38 }]
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

it("handles empty arrays", () => {
  expect(getObjectLines({ items: [] })).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [
        { type: "string", value: "items" },
        { type: "array-start" },
        { type: "array-end" }
      ]
    },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles simple arrays", () => {
  expect(getObjectLines({ items: [false, 3.14, "Hello"] })).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "items" }, { type: "array-start" }]
    },
    {
      indent: 2,
      parts: [{ type: "boolean", value: false }]
    },
    {
      indent: 2,
      parts: [{ type: "number", value: 3.14 }]
    },
    {
      indent: 2,
      parts: [{ type: "string", value: "Hello" }]
    },
    {
      indent: 1,
      parts: [{ type: "array-end" }]
    },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles nested arrays", () => {
  expect(
    getObjectLines({ items: [[3, [true, ["hello"]]], [], [[[[5]]]]] })
  ).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "items" }, { type: "array-start" }]
    },
    { indent: 2, parts: [{ type: "array-start" }] },
    { indent: 3, parts: [{ type: "number", value: 3 }] },
    { indent: 3, parts: [{ type: "array-start" }] },
    { indent: 4, parts: [{ type: "boolean", value: true }] },
    { indent: 4, parts: [{ type: "array-start" }] },
    { indent: 5, parts: [{ type: "string", value: "hello" }] },
    { indent: 4, parts: [{ type: "array-end" }] },
    { indent: 3, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-start" }, { type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-start" }] },
    { indent: 3, parts: [{ type: "array-start" }] },
    { indent: 4, parts: [{ type: "array-start" }] },
    { indent: 5, parts: [{ type: "array-start" }] },
    { indent: 6, parts: [{ type: "number", value: 5 }] },
    { indent: 5, parts: [{ type: "array-end" }] },
    { indent: 4, parts: [{ type: "array-end" }] },
    { indent: 3, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles nested objects", () => {
  expect(
    getObjectLines({
      a: "b",
      c: {
        d: {
          e: 5,
          f: {}
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
      parts: [
        { type: "string", value: "f" },
        { type: "object-start" },
        { type: "object-end" }
      ]
    },
    { indent: 2, parts: [{ type: "object-end" }] },
    { indent: 1, parts: [{ type: "object-end" }] },
    {
      indent: 1,
      parts: [
        { type: "string", value: "g" },
        { type: "object-start" },
        { type: "object-end" }
      ]
    },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});

it("handles complex objects", () => {
  expect(
    getObjectLines({
      a: {
        b: 1,
        c: [false, {}],
        d: {
          e: [[{}, true]]
        }
      },
      f: "true",
      g: 0,
      h: [
        {
          i: "5"
        },
        [],
        [[]]
      ]
    })
  ).toEqual([
    { indent: 0, parts: [{ type: "object-start" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "a" }, { type: "object-start" }]
    },
    {
      indent: 2,
      parts: [{ type: "string", value: "b" }, { type: "number", value: 1 }]
    },
    {
      indent: 2,
      parts: [{ type: "string", value: "c" }, { type: "array-start" }]
    },
    { indent: 3, parts: [{ type: "boolean", value: false }] },
    { indent: 3, parts: [{ type: "object-start" }, { type: "object-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    {
      indent: 2,
      parts: [{ type: "string", value: "d" }, { type: "object-start" }]
    },
    {
      indent: 3,
      parts: [{ type: "string", value: "e" }, { type: "array-start" }]
    },
    { indent: 4, parts: [{ type: "array-start" }] },
    { indent: 5, parts: [{ type: "object-start" }, { type: "object-end" }] },
    { indent: 5, parts: [{ type: "boolean", value: true }] },
    { indent: 4, parts: [{ type: "array-end" }] },
    { indent: 3, parts: [{ type: "array-end" }] },
    { indent: 2, parts: [{ type: "object-end" }] },
    { indent: 1, parts: [{ type: "object-end" }] },
    {
      indent: 1,
      parts: [{ type: "string", value: "f" }, { type: "string", value: "true" }]
    },
    {
      indent: 1,
      parts: [{ type: "string", value: "g" }, { type: "number", value: 0 }]
    },
    {
      indent: 1,
      parts: [{ type: "string", value: "h" }, { type: "array-start" }]
    },
    { indent: 2, parts: [{ type: "object-start" }] },
    {
      indent: 3,
      parts: [{ type: "string", value: "i" }, { type: "string", value: "5" }]
    },
    { indent: 2, parts: [{ type: "object-end" }] },
    { indent: 2, parts: [{ type: "array-start" }, { type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-start" }] },
    { indent: 3, parts: [{ type: "array-start" }, { type: "array-end" }] },
    { indent: 2, parts: [{ type: "array-end" }] },
    { indent: 1, parts: [{ type: "array-end" }] },
    { indent: 0, parts: [{ type: "object-end" }] }
  ]);
});
