import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('typeController');

export const getType = async (req, res) => {
	const query = 'SELECT id, name FROM piece_of_clothing_type ORDER BY name;';
	log('getType');
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getType', error, res);
	}
};
