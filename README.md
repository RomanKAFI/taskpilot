📍СЕЙЧАС

✅ Backend ↔ Frontend связаны, всё работает E2E
✅ Swagger создаёт задачу → фронт показывает её
✅ Project ID 73275c86-6e9b-42b0-93cc-4b5e193ebb6f синхронизирован
✅ Dashboard рендерит реальные данные из БД

📦 ДОСТИЖЕНИЯ

🐘 PostgreSQL и Flyway миграции отлажены

⚙️ Бэкенд стабилен (GET / POST /api/v1/tasks работают)

🧩 Proxy в vite.config.ts настроен корректно

💡 Фронт (React + Vite) подключен и видит БД через API

🧱 Создан базовый seed-проект (V7__seed_demo_project.sql)

✅ E2E тест “E2E seed” прошёл — 200 OK и отображение в UI

🚀 ПЛАН ДАЛЬНЕЙШИХ ШАГОВ
1️⃣ Backend

 Добавить PATCH /api/v1/tasks/{id}/status
→ менять статус задачи (TODO → IN_PROGRESS → DONE).

 Валидировать enum TaskStatus.

 Добавить DELETE /api/v1/tasks/{id} — удалить задачу.

 Добавить seed для нескольких задач с разными статусами.

2️⃣ Frontend

 Разделить Dashboard на 3 колонки (Kanban):

🟦 TODO

🟨 IN PROGRESS

🟩 DONE

 Добавить кнопки для изменения статуса задачи.

 Добавить loader и “empty state”.

 Возможность “обновить” или “seed demo data”.

3️⃣ Docs & DevOps

 Написать README для GitHub (backend + frontend).

 Добавить инструкцию по миграциям и env.

 Вынести seed-проект в отдельный SQL.

 Подготовить docker-compose.yml для сборки всего проекта.

⚡ КОМАНДЫ

Backend

cd backend/backend
./mvnw spring-boot:run


Frontend

cd web
npm install
npm run dev


Swagger UI: http://localhost:8080/swagger-ui/index.html

Frontend: http://localhost:5173
