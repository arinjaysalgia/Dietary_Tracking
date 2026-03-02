export interface FoodItem {
  itemName: string;
  quantityInGrams: number;
  calories: number;
  proteinInGrams: number;
  carbohydratesInGrams: number;
  fatInGrams: number;
}

export interface MealPlanRequest {
  fatPercentage: number;
  proteinPercentage: number;
  carbPercentage: number;
  totalDailyCalories: number;
}

export interface MealPlanItem {
  itemName: string;
  portionInGrams: number;
  calories: number;
  proteinInGrams: number;
  carbsInGrams: number;
  fatInGrams: number;
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  items: MealPlanItem[];
  totalCalories: number;
  totalProteinInGrams: number;
  totalCarbsInGrams: number;
  totalFatInGrams: number;
}

export interface MealPlanResponse {
  days: DayPlan[];
  targetCalories: number;
  targetProteinInGrams: number;
  targetCarbsInGrams: number;
  targetFatInGrams: number;
}
