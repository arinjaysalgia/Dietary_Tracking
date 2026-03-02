# Dietary Tracker

A full-stack web application for tracking dietary intake and nutritional information. Built with a Spring Boot REST API backend and a Next.js TypeScript frontend, orchestrated via Docker Compose.

## What It Does

- View a table of food items with nutritional details (calories, protein, carbohydrates, fat)
- Add new food items with custom nutritional values
- Delete food items from the list
- Preloaded with sample data (Apple, Banana, Egg, Orange) on startup

## Project Structure

```
Dietary_Tracking/
├── backend/                         # Spring Boot Java REST API
│   ├── src/main/java/com/example/
│   │   ├── DietaryTrackingApplication.java   # Application entry point
│   │   ├── controller/FoodItemController.java # REST endpoints
│   │   ├── model/FoodItem.java               # Data model
│   │   └── service/FoodItemService.java      # Business logic & in-memory store
│   ├── src/main/resources/
│   │   ├── application.properties            # Server config (port 8080)
│   │   └── data/sample_food.csv              # Preloaded food data
│   ├── pom.xml                      # Maven build config (Java 21, Spring Boot 3.2.3)
│   └── Dockerfile                   # Multi-stage build (Maven → JRE Alpine)
├── frontend/                        # Next.js 14 TypeScript app
│   ├── app/
│   │   ├── page.tsx                 # Home page (client component)
│   │   ├── layout.tsx               # Root layout
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── globals.css              # Tailwind CSS imports
│   │   └── components/
│   │       ├── AddFoodItemForm.tsx  # Form for adding food items
│   │       └── FoodItemList.tsx     # Table displaying all food items
│   ├── package.json                 # Dependencies (Next.js, Tailwind, TypeScript)
│   ├── next.config.js               # Standalone output for Docker
│   └── Dockerfile                   # Multi-stage build (Node 20 Alpine)
├── docker-compose.yml               # Orchestrates backend + frontend
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 21, Spring Boot 3.2.3, Maven |
| Frontend | Next.js 14, TypeScript 5, React 18, Tailwind CSS 3 |
| Deployment | Docker, Docker Compose |
| Data Storage | In-memory (`ConcurrentLinkedDeque`), CSV seed data |

## Getting Started

### Option 1: Docker Compose (Recommended)

Requires [Docker](https://docs.docker.com/get-docker/) and Docker Compose.

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)

To stop:
```bash
docker-compose down
```

### Option 2: Local Development

**Backend** — requires Java 21 and Maven:

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Runs on `http://localhost:8080`.

**Frontend** — requires Node.js 18+:

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`.

## API Reference

Base URL: `http://localhost:8080/api/food-items`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/food-items` | Get all food items |
| `POST` | `/api/food-items` | Add a new food item |
| `PUT` | `/api/food-items/{itemName}` | Update a food item by name |
| `DELETE` | `/api/food-items/{itemName}` | Delete a food item by name |

**FoodItem JSON schema:**

```json
{
  "itemName": "Apple",
  "quantityInGrams": 150,
  "calories": 80,
  "proteinInGrams": 0.3,
  "carbohydratesInGrams": 21,
  "fatInGrams": 0.2
}
```

## Configuration

### Backend (`backend/src/main/resources/application.properties`)

```properties
server.port=8080
spring.application.name=dietary-tracking
```

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API base URL |

Override in `docker-compose.yml` or a `.env.local` file in the `frontend/` directory.

## Data Persistence

Data is stored **in-memory only** and is reset on each restart. The application seeds initial data from `backend/src/main/resources/data/sample_food.csv` on startup.
