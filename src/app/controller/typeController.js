import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('typeController');

export const createType = async (req, res) => {
	const query = 'INSERT INTO piece_of_clothing_type (name) VALUES ($1) RETURNING *';
	let { name } = req.body;
	log('createType', { name });
	try {
		const { rows } = await dbQuery.query(query, [name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createType', error, res);
	}
};

export const getType = async (req, res) => {
	const query = 'SELECT p_o_c_t.id, p_o_c_t.name, (SELECT COUNT(*) FROM piece_of_clothing p_o_c WHERE p_o_c.type = p_o_c_t.id) > 0 AS has_dependency FROM piece_of_clothing_type p_o_c_t ORDER BY name;';
	log('getType');
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getType', error, res);
	}
};

export const deleteCascadePieceOfClothingType = async (req, res) => {
	let { id } = req.body;
	const query = 'CALL delete_cascade_piece_of_clothing_type($1);';
	log('deleteCascadePieceOfClothingType', { id });
	try {
		const { rows } = await dbQuery.query(query, [id]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'deleteCascadePieceOfClothingType', error, res);
	}
};

export const updateType = async (req, res) => {
	const query = 'UPDATE piece_of_clothing_type SET name = $2 WHERE id = $1 RETURNING *;';
	let { id, name } = req.body;
	log('updateType', { name });
	try {
		const { rows } = await dbQuery.query(query, [id, name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'updateType', error, res);
	}
};
