package com.example.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodItem {
    private String itemName;
    private double quantityInGrams;
    private double calories;
    private double proteinInGrams;
    private double carbohydratesInGrams;
    private double fatInGrams;
}
