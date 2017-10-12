// @flow

export type DataType = "boolean" | "number" | "string" | "array" | "object";

export type BooleanItemPart = {|
  type: "boolean",
  value: boolean
|};

export type numberItemPart = {|
  type: "number",
  value: number
|};

export type StringItemPart = {|
  type: "string",
  value: string
|};

export type ArrayStartItemPart = {|
  type: "array-start"
|};

export type ArrayEndItemPart = {|
  type: "array-end"
|};

export type ObjectStartItemPart = {|
  type: "object-start"
|};

export type ObjectEndItemPart = {|
  type: "object-end"
|};

export type ColonItemPart = {|
  type: "colon"
|};

export type CommaItemPart = {|
  type: "comma"
|};

export type ItemPart =
  | BooleanItemPart
  | numberItemPart
  | StringItemPart
  | ArrayStartItemPart
  | ArrayEndItemPart
  | ObjectStartItemPart
  | ObjectEndItemPart
  | ColonItemPart
  | CommaItemPart;
