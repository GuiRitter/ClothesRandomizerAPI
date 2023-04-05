import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('localController');

export const getLocal = async (req, res) => {
	let { pieceOfClothingType } = req.query;
	const query = 'SELECT l.id, l.name FROM type_use t_u JOIN local l on t_u.local = l.id WHERE t_u.piece_of_clothing_type = $1 ORDER BY l.name;';
	log('getLocal', { pieceOfClothingType });
	try {
		const { rows } = await dbQuery.query(query, [pieceOfClothingType]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getLocal', error, res);
	}
};
