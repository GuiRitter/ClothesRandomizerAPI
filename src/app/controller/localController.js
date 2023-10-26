import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import { getLog } from '../util/log';

const log = getLog('localController');

export const createLocal = async (req, res) => {
	const query = 'INSERT INTO local (name) VALUES ($1) RETURNING *;';
	let { name } = req.body;
	log('createLocal', { name });
	try {
		const { rows } = await dbQuery.query(query, [name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'createLocal', error, res);
	}
};

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
	log('deleteCascadeLocal');
	try {
		const { rows } = await dbQuery.query(query, [id]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'deleteCascadeLocal', error, res);
	}
};

export const updateLocal = async (req, res) => {
	const query = 'UPDATE local SET name = $2 WHERE id = $1 RETURNING *;';
	let { id, name } = req.body;
	log('updateLocal', { name });
	try {
		const { rows } = await dbQuery.query(query, [id, name]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'updateLocal', error, res);
	}
};
