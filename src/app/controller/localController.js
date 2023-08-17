import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('localController');

export const getLocal = async (req, res) => {
	const query = 'SELECT id, name, (SELECT COUNT(*) FROM use u WHERE u.local = l.id) > 0 AS has_dependency FROM local l ORDER BY name;';
	log('getLocal');
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getLocal', error, res);
	}
};

export const deleteCascadeLocal = async (req, res) => {
	let { id } = req.body;
	const query = 'CALL delete_cascade_local($1);';
	log('getLocal');
	try {
		const { rows } = await dbQuery.query(query, [id]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getLocal', error, res);
	}
};
