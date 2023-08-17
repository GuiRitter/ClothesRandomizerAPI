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
	counter smallint not null,
	last_date_time text not null,
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

-- DROP TRIGGER use_date_time_format ON bet; DROP FUNCTION test_use_date_time_format;
CREATE FUNCTION test_use_date_time_format() RETURNS trigger AS $$
DECLARE
  matches boolean;
BEGIN
  select new.last_date_time similar to '[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3}(Z|((\+|-)([0-9]{2}:[0-9]{2})))' into matches;
  IF matches THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Use date/time must be formatted according to ISO 8601.';
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER use_date_time_format BEFORE INSERT OR UPDATE ON use
FOR EACH ROW EXECUTE PROCEDURE test_use_date_time_format();

-- DROP PROCEDURE update_use;
CREATE PROCEDURE update_use(
	piece_of_clothing_selected uuid,
	local_selected uuid,
	last_date_time_new text,
	delta integer
)
LANGUAGE plpgsql
AS $$
DECLARE
	has boolean;
	piece_of_clothing_type_selected uuid;
BEGIN
	WITH updated AS (UPDATE use SET counter = counter + delta, last_date_time = last_date_time_new WHERE local = local_selected AND piece_of_clothing = piece_of_clothing_selected RETURNING counter) SELECT COUNT(counter) > 0 INTO has FROM updated;
	IF NOT has THEN
		INSERT INTO use (local, piece_of_clothing, counter, last_date_time) VALUES (local_selected, piece_of_clothing_selected, CASE WHEN delta > 0 THEN 1 ELSE 0 END, last_date_time_new);
	END IF;
	SELECT type INTO piece_of_clothing_type_selected FROM piece_of_clothing where id = piece_of_clothing_selected LIMIT 1;
	CALL normalize_use(piece_of_clothing_type_selected, local_selected);
END; $$;

-- DROP PROCEDURE increment_use;
CREATE PROCEDURE increment_use(
	piece_of_clothing_selected uuid,
	local_selected uuid,
	last_date_time_new text
)
LANGUAGE plpgsql
AS $$
BEGIN
	CALL update_use(piece_of_clothing_selected, local_selected, last_date_time_new, 1);
END; $$;

-- DROP PROCEDURE decrement_use;
CREATE PROCEDURE decrement_use(
	piece_of_clothing_selected uuid,
	local_selected uuid,
	last_date_time_new text
)
LANGUAGE plpgsql
AS $$
BEGIN
	CALL update_use(piece_of_clothing_selected, local_selected, last_date_time_new, -1);
END; $$;

-- DROP PROCEDURE delete_cascade_local;
CREATE PROCEDURE delete_cascade_local(
	local_selected uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM type_use WHERE local = local_selected;
	DELETE FROM use WHERE local = local_selected;
	DELETE FROM local WHERE id = local_selected;
END; $$;

-- DROP PROCEDURE delete_cascade_piece_of_clothing;
CREATE PROCEDURE delete_cascade_piece_of_clothing(
	piece_of_clothing_selected uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM use WHERE piece_of_clothing = piece_of_clothing_selected;
	DELETE FROM piece_of_clothing WHERE id = piece_of_clothing_selected;
END; $$;

-- DROP PROCEDURE delete_cascade_piece_of_clothing_type;
CREATE PROCEDURE delete_cascade_piece_of_clothing_type(
	piece_of_clothing_type_selected uuid
)
LANGUAGE plpgsql
AS $$
BEGIN
	DELETE FROM type_use WHERE piece_of_clothing_type = piece_of_clothing_type_selected;
	DELETE FROM use AS u USING piece_of_clothing AS p_o_c WHERE u.piece_of_clothing = p_o_c.id AND p_o_c.type = piece_of_clothing_type_selected;
	DELETE FROM piece_of_clothing where type = piece_of_clothing_type_selected;
	DELETE FROM piece_of_clothing_type WHERE id = piece_of_clothing_type_selected;
END; $$;
