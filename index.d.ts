interface Config {
	types?: {[type: string]: CustomType}
}

interface CustomType {
	(value: any): boolean|string;
}

export function isStruct(value: any): boolean;

export function struct(schema: Types, defaults?: Object, options?: {}): Struct;

interface struct {
	(schema: Types, defaults?: Object, options?: {}): Struct;
	/** `any` structs are the equivalent of using the `struct()` function directly, providing the shorthands for commonly used notations. */
	any(data: any): any;
	/** `dict` structs validate an object's keys and values. But, unlike `object` structs, they do not enforce a specific set of keys. */
	dict(data: [Type, Type]): any;
	/** `enum` structs validate that a value is one of a specific set of literals. */
	enum(literals: any[]): any;
	/** `function` structs will validate using the validation function provided. They're helpful as an escape hatch in cases when you really need to write a one-off validation, and don't want to add it to your set of known data types. */
	function(type: () => boolean): any;
	/** `instance` structs validate that an object is an instance of a particular class, using the built-in instanceof operator. */
	instance(object: any): any;
	/** `interface` structs validate that a value has a set of properties on it, but it does not assert anything about unspecified properties. This allows you to assert that a particular set of functionality exists without a strict equality check for properties. */
	interface(properties: Types): any;
	/** `intersection` structs validate that a value matches all of many structs. Their arguments are any other validate struct schema. */
	intersection(structs: Type[]): any;
	/** `lazy` structs accepts a function that will return a struct. They are useful to create recursive structs. */
	lazy(structs: () => struct): any;
	/** `list` structs will validate that all of the elements in an array match a specific type. The elements's schema can be any valid value for a struct—string, array, object or function. */
	list(elements: Type[]): any;
	/** `literal` structs enforces that a value matches an exact, pre-defined value, using the `===` operator. */
	literal(value: any): any;
	/** `object` structs will validate that each of the properties in an object match a specific type. The properties's schemas can be any valid value for a struct—string, array, object or function. */
	object(properties: Types): any;
	/** `optional` structs validate that a value matches a specific kind of struct, or that it is `undefined`. */
	optional(type: Type): any;
	/** `partial` structs are similar to `object` structs, but they only require that the specified properties exist, and they don't care about other properties on the object. They differ from `interface` structs in that they only return the specified properties. */
	partial(properties: Types): any;
	/** `scalar` structs are the lowest-level type of struct. They validate that a single scalar value matches a type, denoted by a type string. */
	scalar(value: string): any;
	/** `tuple` structs validate that a value is a specific array tuple of values. */
	tuple(values: Type[]): any;
	/** `union` structs validate that a value matches at least one of many structs. Their arguments are any other validate struct schema. */
	union(schemas: Types[]): any;
}

interface Struct {
	(data: any): any;
	/** @throws {StructError} */
	assert(value: any): any;
	test(value: any): boolean;
	validate(value: any): [StructError]|[undefined, any];
}

interface StructError extends TypeError {
	data: any;
	path: string[];
	value: any;
	reason: any;
	type: string;
	errors: StructError[];
}

export function superstruct(config?: Config): struct;

type Type = string|any;

interface Types {
	[type: string]: Type;
}

export as namespace superstruct;