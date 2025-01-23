BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'trg_after_user_insert_add_audit'
          AND tgrelid = 'users'::regclass
    ) THEN
        CREATE TRIGGER trg_after_user_insert_add_audit
        AFTER INSERT
        ON users
        FOR EACH ROW
        EXECUTE FUNCTION fn_insert_user_audit();
    END IF;
END;
$$;

COMMIT;
