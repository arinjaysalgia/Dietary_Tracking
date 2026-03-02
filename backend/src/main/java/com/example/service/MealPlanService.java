package com.example.service;

import com.example.model.DayPlan;
import com.example.model.FoodItem;
import com.example.model.MealPlanItem;
import com.example.model.MealPlanRequest;
import com.example.model.MealPlanResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MealPlanService {

    private static final String[] DAY_NAMES = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
    // Caloric densities in calories per gram
    private static final double PROTEIN_CAL_PER_GRAM = 4.0;
    private static final double CARBS_CAL_PER_GRAM = 4.0;
    private static final double FAT_CAL_PER_GRAM = 9.0;

    private final FoodItemService foodItemService;

    public MealPlanService(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    public MealPlanResponse generate(MealPlanRequest request) {
        double totalCalories = request.getTotalDailyCalories();
        double proteinGrams = (totalCalories * request.getProteinPercentage() / 100.0) / PROTEIN_CAL_PER_GRAM;
        double carbsGrams   = (totalCalories * request.getCarbPercentage()     / 100.0) / CARBS_CAL_PER_GRAM;
        double fatGrams     = (totalCalories * request.getFatPercentage()      / 100.0) / FAT_CAL_PER_GRAM;

        List<FoodItem> allFoods = foodItemService.findAll();
        List<FoodItem> proteinFoods = new ArrayList<>();
        List<FoodItem> carbFoods = new ArrayList<>();
        List<FoodItem> fatFoods = new ArrayList<>();

        for (FoodItem food : allFoods) {
            double proteinCal = food.getProteinInGrams() * PROTEIN_CAL_PER_GRAM;
            double carbCal = food.getCarbohydratesInGrams() * CARBS_CAL_PER_GRAM;
            double fatCal = food.getFatInGrams() * FAT_CAL_PER_GRAM;

            if (proteinCal >= carbCal && proteinCal >= fatCal) {
                proteinFoods.add(food);
            } else if (carbCal >= proteinCal && carbCal >= fatCal) {
                carbFoods.add(food);
            } else {
                fatFoods.add(food);
            }
        }

        // Calorie budgets per group — these sum exactly to totalCalories
        double proteinCalBudget = totalCalories * request.getProteinPercentage() / 100.0;
        double carbCalBudget    = totalCalories * request.getCarbPercentage()     / 100.0;
        double fatCalBudget     = totalCalories * request.getFatPercentage()      / 100.0;

        List<DayPlan> days = new ArrayList<>();
        for (int dayIndex = 0; dayIndex < 5; dayIndex++) {
            List<MealPlanItem> items = new ArrayList<>();

            // Pick 3 protein foods for the day (rotating by day)
            List<FoodItem> dayProteinFoods = rotatePick(proteinFoods, dayIndex, 3);
            double calPerProteinFood = proteinCalBudget / dayProteinFoods.size();
            for (FoodItem food : dayProteinFoods) {
                double portion = food.getQuantityInGrams() * (calPerProteinFood / food.getCalories());
                items.add(scale(food, portion));
            }

            // Pick 3 carb foods for the day (rotating by day)
            List<FoodItem> dayCarbFoods = rotatePick(carbFoods, dayIndex, 3);
            double calPerCarbFood = carbCalBudget / dayCarbFoods.size();
            for (FoodItem food : dayCarbFoods) {
                double portion = food.getQuantityInGrams() * (calPerCarbFood / food.getCalories());
                items.add(scale(food, portion));
            }

            // Pick 2 fat foods for the day (rotating by day)
            List<FoodItem> dayFatFoods = rotatePick(fatFoods, dayIndex, 2);
            double calPerFatFood = fatCalBudget / dayFatFoods.size();
            for (FoodItem food : dayFatFoods) {
                double portion = food.getQuantityInGrams() * (calPerFatFood / food.getCalories());
                items.add(scale(food, portion));
            }

            double dayCalories = items.stream().mapToDouble(MealPlanItem::getCalories).sum();
            double dayProtein = items.stream().mapToDouble(MealPlanItem::getProteinInGrams).sum();
            double dayCarbs = items.stream().mapToDouble(MealPlanItem::getCarbsInGrams).sum();
            double dayFat = items.stream().mapToDouble(MealPlanItem::getFatInGrams).sum();

            days.add(new DayPlan(dayIndex + 1, DAY_NAMES[dayIndex], items,
                    round(dayCalories), round(dayProtein), round(dayCarbs), round(dayFat)));
        }

        return new MealPlanResponse(days,
                round(totalCalories), round(proteinGrams), round(carbsGrams), round(fatGrams));
    }

    private List<FoodItem> rotatePick(List<FoodItem> foods, int dayIndex, int count) {
        if (foods.isEmpty()) return foods;
        List<FoodItem> result = new ArrayList<>();
        int size = foods.size();
        int actualCount = Math.min(count, size);
        int offset = (dayIndex * actualCount) % size;
        for (int i = 0; i < actualCount; i++) {
            result.add(foods.get((offset + i) % size));
        }
        return result;
    }

    private MealPlanItem scale(FoodItem food, double portion) {
        double factor = portion / food.getQuantityInGrams();
        return new MealPlanItem(
                food.getItemName(),
                round(portion),
                round(food.getCalories() * factor),
                round(food.getProteinInGrams() * factor),
                round(food.getCarbohydratesInGrams() * factor),
                round(food.getFatInGrams() * factor)
        );
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
