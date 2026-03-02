package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealPlanResponse {
    private List<DayPlan> days;
    private double targetCalories;
    private double targetProteinInGrams;
    private double targetCarbsInGrams;
    private double targetFatInGrams;
}
