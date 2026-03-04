package com.example.controller;

import com.example.model.GroceryListResponse;
import com.example.model.MealPlanResponse;
import com.example.service.GroceryListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/grocery-list")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class GroceryListController {

    private final GroceryListService groceryListService;

    public GroceryListController(GroceryListService groceryListService) {
        this.groceryListService = groceryListService;
    }

    @PostMapping("/generate")
    public ResponseEntity<GroceryListResponse> generateGroceryList(@RequestBody MealPlanResponse mealPlan) {
        return ResponseEntity.ok(groceryListService.generate(mealPlan));
    }
}
