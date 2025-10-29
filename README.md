🧭 TaskPilot — MVP Progress Report
🚀 Статус проекта

✅ Backend и Frontend связаны и успешно обмениваются данными.
На текущий момент:

Spring Boot backend (port 8080) стабильно запускается, применяет миграции Flyway и подключается к PostgreSQL.

Vite + React frontend (port 5173) корректно проксирует запросы /api/v1/... на backend.

Swagger UI работает и позволяет создавать задачи (endpoint: /api/v1/tasks).

📦 Текущее состояние
Компонент	Статус	Детали
PostgreSQL	✅ Работает	Схема task с колонками: id, project_id, title, status, created_at
Flyway миграции	✅	Исправлен enum status (TODO, IN_PROGRESS, BLOCKED, DONE)
Backend API	✅	GET /api/v1/tasks?projectId=... и POST /api/v1/tasks возвращают корректные JSON
Frontend (Vite + React)	✅	Отображает Dashboard и подключён к backend через proxy
Proxy config	✅	vite.config.ts правильно проксирует /api → http://localhost:8080
Связка Front–Back	✅	Проверена: Swagger создаёт задачу → появляется на фронте при совпадении PROJECT_ID
🧩 Что мы сделали сегодня

Починили миграции Flyway (V3_fix_task_status_check.sql)

Исправили TaskStatus enum

Настроили рабочее окружение (mvnw spring-boot:run + npm run dev)

Протестировали backend через Swagger — получили 200 OK при POST /api/v1/tasks

Настроили vite.config.ts для корректного проксирования запросов

Подняли фронт (http://localhost:5173
) и увидели подключение к backend

Проверили вывод на Dashboard — сообщение "Задач пока нет" корректно обрабатывается

🧠 На чём остановились

Dashboard не показывает задачи, если PROJECT_ID во фронте не совпадает с проектом, к которому добавлены задачи.

Необходимо синхронизировать PROJECT_ID:

либо заменить ID в web/src/pages/Dashboard.tsx на тот, что используется в Swagger;

либо создавать задачи с projectId, который указан в Dashboard.

🔜 Что сделать завтра

Синхронизировать PROJECT_ID

Выбрать актуальный ID проекта и обновить его во фронте.

Проверить, что Dashboard показывает созданные задачи.

Добавить PATCH /api/v1/tasks/{id}/status

Проверить обновление статуса через Swagger.

Убедиться, что изменения видны на фронте (столбцы TODO / IN PROGRESS / DONE).

Добавить в Dashboard визуальное разделение по статусам

Сделать базовую канбан-доску (три колонки по статусу).

Написать короткий README для GitHub

Краткое описание проекта, стек, команды запуска, ссылки на Swagger и фронт.

🧰 Команды запуска
# Backend
cd ~/Desktop/taskpilot/backend/backend
./mvnw spring-boot:run

# Frontend
cd ~/Desktop/taskpilot/web
npm install
npm run dev


Swagger UI: http://localhost:8080/swagger-ui/index.html

Frontend: http://localhost:5173
