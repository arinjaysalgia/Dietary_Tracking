package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DayPlan {
    private int dayNumber;
    private String dayName;
    private List<MealPlanItem> items;
    private double totalCalories;
    private double totalProteinInGrams;
    private double totalCarbsInGrams;
    private double totalFatInGrams;
}
