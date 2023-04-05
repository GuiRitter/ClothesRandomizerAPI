import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('useController');

export const getUse = async (req, res) => {
	let { local, pieceOfClothingType } = req.query;
	const query = 'SELECT p_o_c.id, p_o_c.name, u.counter FROM piece_of_clothing p_o_c LEFT OUTER JOIN use u ON u.piece_of_clothing = p_o_c.id AND u.local = $1 WHERE p_o_c.type = $2 ORDER BY p_o_c.name';
	log('getUse', { local, pieceOfClothingType });
	try {
		const { rows } = await dbQuery.query(query, [local, pieceOfClothingType]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getUse', error, res);
	}
};

// TODO always UPDATE to set the use counter
// TODO trigger on UPDATE to check if need to CREATE
// TODO trigger on UPDATE to only allow counter to change by 1
