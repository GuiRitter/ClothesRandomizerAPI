-- sudo -u postgres createdb clothes_randomizer

-- sudo -u postgres psql clothes_randomizer

CREATE EXTENSION "uuid-ossp";

-- psql clothes_randomizer

create table ´user´ (
	login text primary key,
	password text not null
);

create table local (
	id uuid default uuid_generate_v4() primary key,
	name text not null
);

create table piece_of_clothing_type (
	id uuid default uuid_generate_v4() primary key,
	name text not null
);

create table piece_of_clothing (
	id uuid default uuid_generate_v4() primary key,
	type uuid references piece_of_clothing_type(id) not null,
	name text not null
);

create table type_use (
	local uuid references local(id) not null,
	piece_of_clothing_type uuid references piece_of_clothing_type(id) not null
);

create table use (
	local uuid references local(id) not null,
	piece_of_clothing uuid references piece_of_clothing(id) not null,
	counter smallint not null
);

-- DROP PROCEDURE normalize_use;
CREATE PROCEDURE normalize_use(
	piece_of_clothing_type_selected uuid,
	local_selected uuid
)
LANGUAGE plpgsql
AS $$
DECLARE
	smallest_counter SMALLINT;
BEGIN
	SELECT MIN(COALESCE(u.counter, 0)) INTO smallest_counter FROM piece_of_clothing p_o_c LEFT OUTER JOIN use u ON u.piece_of_clothing = p_o_c.id AND u.local = local_selected WHERE p_o_c.type = piece_of_clothing_type_selected;
	UPDATE use u SET counter = u.counter - smallest_counter FROM piece_of_clothing p_o_c WHERE u.piece_of_clothing = p_o_c.id AND p_o_c.type = piece_of_clothing_type_selected AND u.local = local_selected;
END; $$;

-- DROP PROCEDURE update_use;
CREATE PROCEDURE update_use(
	piece_of_clothing_selected uuid,
	local_selected uuid,
	delta integer
)
LANGUAGE plpgsql
AS $$
DECLARE
	has boolean;
	piece_of_clothing_type_selected uuid;
BEGIN
	WITH updated AS (UPDATE use SET counter = counter + delta WHERE local = local_selected AND piece_of_clothing = piece_of_clothing_selected RETURNING counter) SELECT COUNT(counter) > 0 INTO has FROM updated;
	IF NOT has THEN
		INSERT INTO use (local, piece_of_clothing, counter) VALUES (local_selected, piece_of_clothing_selected, CASE WHEN delta > 0 THEN 1 ELSE 0 END);
	END IF;
	SELECT type INTO piece_of_clothing_type_selected FROM piece_of_clothing where id = piece_of_clothing_selected LIMIT 1;
	CALL normalize_use(piece_of_clothing_type_selected, local_selected);
END; $$;

-- DROP PROCEDURE increment_use;
CREATE PROCEDURE increment_use(
	piece_of_clothing_selected uuid,
	local_selected uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
	CALL update_use(piece_of_clothing_selected, local_selected, 1);
END; $$;

-- DROP PROCEDURE decrement_use;
CREATE PROCEDURE decrement_use(
	piece_of_clothing_selected uuid,
	local_selected uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
	CALL update_use(piece_of_clothing_selected, local_selected, -1);
END; $$;