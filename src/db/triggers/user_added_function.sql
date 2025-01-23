BEGIN;

-- Make sure pgcrypto extension is available (for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION fn_insert_user_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    /*
      Create the 'user_audits' table if it doesn't already exist.
      This table has:
       - guid (UUID) as primary key (defaulted to a new random UUID)
       - user_added_timestamp (timestamp, defaulted to now())
       - user_id (int) referencing users(id)
    */
    EXECUTE '
        CREATE TABLE IF NOT EXISTS user_audits (
            guid UUID NOT NULL DEFAULT gen_random_uuid(),
            user_added_timestamp TIMESTAMP NOT NULL DEFAULT now(),
            user_id INTEGER NOT NULL,
            CONSTRAINT pk_user_audits PRIMARY KEY (guid),
            CONSTRAINT fk_user_audits_users FOREIGN KEY (user_id)
                REFERENCES users (id)
        )
    ';

    /*
      Insert a new audit record referencing the newly added user.
      NEW is the record that was just inserted into 'users'.
    */
    INSERT INTO user_audits (user_id)
    VALUES (NEW.id);

    -- Return the newly inserted row in 'users'
    RETURN NEW;
END;
$$;

COMMIT;
