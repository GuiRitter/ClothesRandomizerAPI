export const chunkTableList = (() => {
	const generator = (modelName, databaseName) => ({ modelName, databaseName, });
	return [
		generator('local', 'local'),
		generator('pieceOfClothingType', 'piece_of_clothing_type'),
		generator('pieceOfClothing', 'piece_of_clothing'),
		generator('typeUse', 'type_use'),
	];
})();
