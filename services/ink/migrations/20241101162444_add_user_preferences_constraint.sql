ALTER TABLE users_preferences
ADD CONSTRAINT users_preferences_user_id_key UNIQUE (user_id);
