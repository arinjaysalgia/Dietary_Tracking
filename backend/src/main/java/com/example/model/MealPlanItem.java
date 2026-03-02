package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealPlanItem {
    private String itemName;
    private double portionInGrams;
    private double calories;
    private double proteinInGrams;
    private double carbsInGrams;
    private double fatInGrams;
}
