# Dietary Tracker

A full-stack web application for tracking dietary intake and generating personalised meal plans. Built with a Spring Boot REST API backend and a Next.js TypeScript frontend, orchestrated via Docker Compose.

## What It Does

- View a table of food items with nutritional details (calories, protein, carbohydrates, fat)
- Add new food items with custom nutritional values
- Delete food items from the list
- Generate a 5-day vegetarian meal plan from macro targets (protein %, carb %, fat %) and a total daily calorie goal
- Preloaded with 26 vegetarian food items on startup

## Project Structure

```
Dietary_Tracking/
├── backend/                         # Spring Boot Java REST API
│   ├── src/main/java/com/example/
│   │   ├── DietaryTrackingApplication.java        # Application entry point
│   │   ├── controller/
│   │   │   ├── FoodItemController.java            # CRUD endpoints for food items
│   │   │   └── MealPlanController.java            # Meal plan generation endpoint
│   │   ├── model/
│   │   │   ├── FoodItem.java                      # Food item data model
│   │   │   ├── MealPlanRequest.java               # Meal plan request body
│   │   │   ├── MealPlanItem.java                  # Scaled food item in a plan
│   │   │   ├── DayPlan.java                       # Single day in the plan
│   │   │   └── MealPlanResponse.java              # Full 5-day plan response
│   │   └── service/
│   │       ├── FoodItemService.java               # In-memory store & CSV loader
│   │       └── MealPlanService.java               # Meal plan generation algorithm
│   ├── src/main/resources/
│   │   ├── application.properties                 # Server config (port 8080)
│   │   └── data/sample_food.csv                   # 26 preloaded vegetarian foods
│   ├── pom.xml                      # Maven build config (Java 21, Spring Boot 3.2.3)
│   └── Dockerfile                   # Multi-stage build (Maven → JRE Alpine)
├── frontend/                        # Next.js 14 TypeScript app
│   ├── app/
│   │   ├── page.tsx                 # Food items home page
│   │   ├── layout.tsx               # Root layout with navigation
│   │   ├── types.ts                 # TypeScript interfaces
│   │   ├── globals.css              # Tailwind CSS imports
│   │   ├── meal-plan/
│   │   │   └── page.tsx             # Meal plan generator page
│   │   ├── api/[...path]/
│   │   │   └── route.ts             # Runtime proxy to backend API
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

> The local override (`docker-compose.override.yml`) assigns ephemeral host ports to avoid conflicts. Run `docker-compose ps` after startup to see the assigned ports.

To stop:
```bash
docker-compose down
```

### Option 2: Local Development

**Backend** — requires Java 21 and Maven:

```bash
cd backend
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

### Food Items

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
  "itemName": "Tofu",
  "quantityInGrams": 100,
  "calories": 76,
  "proteinInGrams": 8.0,
  "carbohydratesInGrams": 2.0,
  "fatInGrams": 4.5
}
```

### Meal Plan

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/meal-plan/generate` | Generate a 5-day meal plan |

**Request body:**

```json
{
  "proteinPercentage": 30,
  "carbPercentage": 40,
  "fatPercentage": 30,
  "totalDailyCalories": 2000
}
```

> `proteinPercentage + carbPercentage + fatPercentage` must equal 100 (±1 tolerance).

**Response** — a `MealPlanResponse` containing:
- `days`: array of 5 `DayPlan` objects (Monday–Friday), each with a list of scaled food items and macro totals
- `targetCalories`, `targetProteinInGrams`, `targetCarbsInGrams`, `targetFatInGrams`: the computed daily targets

### Meal Plan Algorithm

1. Foods from the CSV are categorised by their dominant macro (protein, carb, or fat).
2. Each group is allocated a calorie budget equal to `totalCalories × groupPercentage%`, ensuring the day total equals the target exactly.
3. 3 protein foods + 3 carb foods + 2 fat foods are selected per day, rotating the selection across the 5 days for variety.
4. Each food's portion is scaled so its calorie contribution fills its share of the group budget.

## Configuration

### Backend (`backend/src/main/resources/application.properties`)

```properties
server.port=8080
spring.application.name=dietary-tracking
```

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BACKEND_URL` | `http://localhost:8080` | Backend base URL used by the server-side API proxy |

Set in `docker-compose.yml` (uses `http://backend:8080` for Docker internal DNS) or override in a `.env.local` file in the `frontend/` directory.

## Data Persistence

Data is stored **in-memory only** and is reset on each restart. The application seeds initial data from `backend/src/main/resources/data/sample_food.csv` on startup. The CSV contains 26 vegetarian food items across protein-dominant, carb-dominant, and fat-dominant categories.
