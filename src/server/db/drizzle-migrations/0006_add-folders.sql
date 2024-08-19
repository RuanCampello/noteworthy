CREATE TABLE IF NOT EXISTS "folders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"note_ids" integer[] DEFAULT ARRAY[]::integer[],
	"parent_folder_id" integer
);
--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'folders_parent_folder_id_folders_id_fk'
        AND table_name = 'folders'
    ) THEN
        ALTER TABLE folders
        ADD CONSTRAINT folders_parent_folder_id_folders_id_fk
        FOREIGN KEY (parent_folder_id) REFERENCES folders(id)
        ON DELETE CASCADE ON UPDATE NO ACTION;
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;
END $$;
