package com.example.service;

import com.example.model.GroceryItem;
import com.example.model.GroceryListResponse;
import com.example.model.MealPlanResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.TreeMap;

@Service
public class GroceryListService {

    public GroceryListResponse generate(MealPlanResponse mealPlan) {
        TreeMap<String, Double> totals = new TreeMap<>();

        mealPlan.getDays().forEach(day ->
            day.getItems().forEach(item ->
                totals.merge(item.getItemName(), item.getPortionInGrams(), (a, b) -> a + b)
            )
        );

        List<GroceryItem> items = totals.entrySet().stream()
                .map(e -> new GroceryItem(e.getKey(), round(e.getValue())))
                .toList();

        return new GroceryListResponse(items);
    }

    private double round(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
