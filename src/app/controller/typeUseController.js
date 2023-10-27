import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('typeUseController');

export const create = async (req, res) => {
	let { pieceOfClothingType, local } = req.body;
	const query = 'INSERT INTO type_use (piece_of_clothing_type, local) VALUES ($1, $2) RETURNING *;';
	log('create', { pieceOfClothingType, local });
	try {
		const { rows } = await dbQuery.query(query, [pieceOfClothingType, local]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'create', error, res);
	}
};

export const deleteTypeUse = async (req, res) => {
	let { pieceOfClothingType, local } = req.body;
	const query = 'DELETE FROM type_use WHERE piece_of_clothing_type = $1 AND local = $2 RETURNING *;';
	log('deleteTypeUse', { pieceOfClothingType, local });
	try {
		const { rows } = await dbQuery.query(query, [pieceOfClothingType, local]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'deleteTypeUse', error, res);
	}
};

