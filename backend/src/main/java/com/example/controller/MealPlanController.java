package com.example.controller;

import com.example.model.MealPlanRequest;
import com.example.model.MealPlanResponse;
import com.example.service.MealPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meal-plan")
@CrossOrigin(origins = {"http://localhost:3000", "http://frontend:3000"})
public class MealPlanController {

    private final MealPlanService mealPlanService;

    public MealPlanController(MealPlanService mealPlanService) {
        this.mealPlanService = mealPlanService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateMealPlan(@RequestBody MealPlanRequest request) {
        double sum = request.getProteinPercentage() + request.getCarbPercentage() + request.getFatPercentage();
        if (Math.abs(sum - 100.0) > 1.0) {
            return ResponseEntity.badRequest()
                    .body("Macro percentages must sum to 100. Got: " + Math.round(sum));
        }
        if (request.getTotalDailyCalories() <= 0) {
            return ResponseEntity.badRequest().body("Total daily calories must be greater than 0.");
        }
        MealPlanResponse response = mealPlanService.generate(request);
        return ResponseEntity.ok(response);
    }
}
