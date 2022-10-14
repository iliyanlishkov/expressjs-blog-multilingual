export interface RoutesObject {
	readonly method: string;
	readonly path: string;
	readonly controller: string;
	readonly name: string;
}

export interface RouteGroupsObject {
	readonly method: string;
	readonly pattern: string;
	readonly controller: string;
	readonly name: string;
}

export interface NamedRoutesObject {
	readonly method: string;
	readonly pattern: string;
	readonly controller: string;
	readonly name: string;
	readonly pathTrace: string;
}
