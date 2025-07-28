export type WithRequired<T, K extends keyof T> = Prettify<Omit<T, K> & Required<Pick<T, K>>>;
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type AssertExactExhaustive<TUnion, TArray extends readonly unknown[]> = IsEqual<
  TUnion,
  TArray[number]
> extends true
  ? IsEqual<TArray[number], TUnion> extends true
    ? TArray
    : never
  : never;

export type Nullable<T> = T | null;

export type CompareOperator = "gt" | "gte" | "lt" | "lte" | "eq";
