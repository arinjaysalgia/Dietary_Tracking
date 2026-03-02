package com.example.service;

import com.example.model.FoodItem;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

@Service
public class FoodItemService {

    private final ConcurrentLinkedDeque<FoodItem> foodItems = new ConcurrentLinkedDeque<>();

    @PostConstruct
    public void loadCsvData() {
        InputStream is = getClass().getClassLoader().getResourceAsStream("data/sample_food.csv");
        if (is == null) {
            System.err.println("Warning: data/sample_food.csv not found on classpath. Starting with empty list.");
            return;
        }
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            String line;
            boolean firstLine = true;
            while ((line = reader.readLine()) != null) {
                // Skip header row
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                line = line.trim();
                if (line.isEmpty()) {
                    continue;
                }
                String[] parts = line.split(",");
                // Expect exactly 6 fields: Item_Name,Quantity_InGrams,Calories,Protien_InGrams,Carbohydrates_InGrams,Fat_InGrams
                if (parts.length != 6) {
                    System.err.println("Skipping invalid row (unexpected column count): " + line);
                    continue;
                }
                try {
                    String itemName = parts[0].trim();
                    double quantityInGrams = Double.parseDouble(parts[1].trim());
                    double calories = Double.parseDouble(parts[2].trim());
                    double proteinInGrams = Double.parseDouble(parts[3].trim());
                    double carbohydratesInGrams = Double.parseDouble(parts[4].trim());
                    double fatInGrams = Double.parseDouble(parts[5].trim());
                    foodItems.add(new FoodItem(itemName, quantityInGrams, calories, proteinInGrams, carbohydratesInGrams, fatInGrams));
                } catch (NumberFormatException e) {
                    System.err.println("Skipping invalid row (number parse error): " + line);
                }
            }
        } catch (Exception e) {
            System.err.println("Error reading CSV: " + e.getMessage());
        }
    }

    public List<FoodItem> findAll() {
        return new ArrayList<>(foodItems);
    }

    public FoodItem add(FoodItem foodItem) {
        foodItems.add(foodItem);
        return foodItem;
    }

    public FoodItem updateByName(String itemName, FoodItem updated) {
        List<FoodItem> snapshot = new ArrayList<>(foodItems);
        for (FoodItem item : snapshot) {
            if (item.getItemName().equalsIgnoreCase(itemName)) {
                foodItems.remove(item);
                // Preserve the itemName from the path variable or allow update from body
                updated.setItemName(item.getItemName());
                foodItems.add(updated);
                return updated;
            }
        }
        return null;
    }

    public boolean deleteByName(String itemName) {
        List<FoodItem> snapshot = new ArrayList<>(foodItems);
        for (FoodItem item : snapshot) {
            if (item.getItemName().equalsIgnoreCase(itemName)) {
                foodItems.remove(item);
                return true;
            }
        }
        return false;
    }
}
