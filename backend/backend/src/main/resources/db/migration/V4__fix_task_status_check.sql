-- Удаляем старый неправильный CHECK, если он есть
ALTER TABLE task
DROP CONSTRAINT IF EXISTS task_status_check;

-- Создаём новый CHECK под реальные значения статуса
ALTER TABLE task
    ADD CONSTRAINT task_status_check
        CHECK (status IN ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE'));

-- На всякий случай фиксируем default
ALTER TABLE task
    ALTER COLUMN status SET DEFAULT 'TODO';
