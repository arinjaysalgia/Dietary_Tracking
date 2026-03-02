package com.example.controller;

import com.example.model.FoodItem;
import com.example.service.FoodItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class FoodItemController {

    private final FoodItemService foodItemService;

    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoodItems() {
        List<FoodItem> items = foodItemService.findAll();
        return ResponseEntity.ok(items);
    }

    @PostMapping
    public ResponseEntity<FoodItem> addFoodItem(@RequestBody FoodItem foodItem) {
        FoodItem created = foodItemService.add(foodItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{itemName}")
    public ResponseEntity<FoodItem> updateFoodItem(
            @PathVariable String itemName,
            @RequestBody FoodItem foodItem) {
        FoodItem updated = foodItemService.updateByName(itemName, foodItem);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{itemName}")
    public ResponseEntity<Void> deleteFoodItem(@PathVariable String itemName) {
        boolean deleted = foodItemService.deleteByName(itemName);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
