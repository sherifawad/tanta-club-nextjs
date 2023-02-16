export function divvyUp<T>(array: T[], predicate: (el: T, index?: number, arr?: Array<T>) => any) {
	// const filterTrue: T[] = [],
	// 	filterFalse: T[] = [];
	// array.forEach(function (value) {
	// 	(predicate(value) ? filterTrue : filterFalse).push(value);
	// });
	const filterTrue = array.filter(predicate);
	const filterFalse = array.filter(function (data) {
		return !predicate(data);
	});
	return [filterTrue, filterFalse];
}
