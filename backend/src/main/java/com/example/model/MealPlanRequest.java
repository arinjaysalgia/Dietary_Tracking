package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealPlanRequest {
    private double fatPercentage;
    private double proteinPercentage;
    private double carbPercentage;
    private double totalDailyCalories;
}
