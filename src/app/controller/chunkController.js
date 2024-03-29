import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import { chunkTableList } from '../constant/data';

import { getLog } from '../util/log';

const log = getLog('chunkController');

export const getChunk = async (req, res) => {
	log('getChunk');
	const query = `${''
		} select l.id l_id , l.name l_name, null::uuid p_o_c_t_id, null p_o_c_t_name, null::uuid p_o_c_id, null::uuid p_o_c_type, null p_o_c_name, null::uuid t_u_local, null::uuid t_u_piece_of_clothing_type from local l union${''
		}(select null::uuid, null         , p_o_c_t.id           , p_o_c_t.name     , null::uuid         , null::uuid           , null           , null::uuid          , null::uuid                            from piece_of_clothing_type p_o_c_t) union${''
		}(select null::uuid, null         , null::uuid           , null             , p_o_c.id           , p_o_c.type           , p_o_c.name     , null::uuid          , null::uuid                            from piece_of_clothing p_o_c) union${''
		}(select null::uuid, null         , null::uuid           , null             , null::uuid         , null::uuid           , null           , t_u.local           , t_u.piece_of_clothing_type            from type_use t_u);`;
	try {
		const { rows } = await dbQuery.query(query);
		const result = rows.reduce(
			(previousChunk, currentRow) => {
				let object;
				let table;
				if (currentRow['l_id']) {
					object = {
						id: currentRow['l_id'],
						name: currentRow['l_name'],
					};
					table = 'local';
				} else if (currentRow['p_o_c_t_id']) {
					object = {
						id: currentRow['p_o_c_t_id'],
						name: currentRow['p_o_c_t_name'],
					};
					table = 'pieceOfClothingType';
				} else if (currentRow['p_o_c_id']) {
					object = {
						id: currentRow['p_o_c_id'],
						type: currentRow['p_o_c_type'],
						name: currentRow['p_o_c_name'],
					};
					table = 'pieceOfClothing';
				} else if (currentRow['t_u_local']) {
					object = {
						local: currentRow['t_u_local'],
						type: currentRow['t_u_piece_of_clothing_type'],
					};
					table = 'typeUse';
				}
				return ({
					...previousChunk,
					[table]: previousChunk[table].concat(object)
				});
			},
			chunkTableList.reduce((previousObject, currentItem) => ({ ...previousObject, [currentItem.modelName]: [] }), {})
		);
		return res.status(status.success).send(result);
	} catch (error) {
		return buildError(log, 'getLocal', error, res);
	}
};
