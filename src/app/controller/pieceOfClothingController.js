import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('pieceOfClothingController');

export const createPieceOfClothing = async (req, res) => {
	const query = 'INSERT INTO piece_of_clothing (type, name) VALUES ($1, $2) RETURNING *';
	let { type, name } = req.body;
	log('createPieceOfClothing', { type, name });
	try {
		const { rows } = await dbQuery.query(query, [type, name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createPieceOfClothing', error, res);
	}
};

export const getPieceOfClothing = async (req, res) => {
	const query = 'SELECT p_o_c.id, p_o_c.type, p_o_c_t.name as type__display, p_o_c.name, (SELECT COUNT(*) FROM use u WHERE u.piece_of_clothing = p_o_c.id) > 0 AS has_dependency FROM piece_of_clothing p_o_c JOIN piece_of_clothing_type p_o_c_t ON p_o_c.type = p_o_c_t.id ORDER BY p_o_c_t.name, p_o_c.name;';
	log('getPieceOfClothing');
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getPieceOfClothing', error, res);
	}
};

export const deleteCascadePieceOfClothing = async (req, res) => {
	let { id } = req.body;
	const query = 'CALL delete_cascade_piece_of_clothing($1);';
	log('deleteCascadePieceOfClothing', { id });
	try {
		const { rows } = await dbQuery.query(query, [id]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'deleteCascadePieceOfClothing', error, res);
	}
};

export const updatePieceOfClothing = async (req, res) => {
	const { id } = req.body;

	const { columnNameList, columnValueList } = Object.entries(req.body).reduce((previousObject, currentEntry) => {
		if (currentEntry[0] === 'id') {
			return previousObject;
		}
		return {
			columnNameList: previousObject.columnNameList.concat(currentEntry[0]),
			columnValueList: previousObject.columnValueList.concat(currentEntry[1]),
		};
	}, { columnNameList: [], columnValueList: [] });

	log('updatePieceOfClothing', { columnNameList, columnValueList });

	if (columnNameList.length < 1) {
		return buildError(log, 'No changes to update.', error, res);
	}

	const columnList = columnNameList
		.map((mColumnName, index) => `${mColumnName} = $${index + 2}`)
		.join(', ');

	const query = `UPDATE piece_of_clothing SET ${columnList} WHERE id = $1 RETURNING *;`;
	try {
		const { rows } = await dbQuery.query(query, [id, ...columnValueList]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'updatePieceOfClothing', error, res);
	}
};

