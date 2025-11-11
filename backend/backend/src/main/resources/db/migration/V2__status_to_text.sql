-- Преобразуем тип enum -> text
ALTER TABLE task
ALTER COLUMN status TYPE TEXT USING status::text;

-- (опц.) Контроль допустимых значений
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'task_status_check'
  ) THEN
ALTER TABLE task
    ADD CONSTRAINT task_status_check
        CHECK (status IN ('TODO','IN_PROGRESS','BLOCKED','DONE'));
END IF;
END $$;

-- (опц.) Сделать NOT NULL, если нужно
ALTER TABLE task
    ALTER COLUMN status SET NOT NULL;
