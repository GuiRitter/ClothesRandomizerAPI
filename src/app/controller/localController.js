import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('localController');

export const getLocal = async (req, res) => {
	const query = 'SELECT id, name FROM local ORDER BY name;';
	log('getLocal');
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getLocal', error, res);
	}
};
