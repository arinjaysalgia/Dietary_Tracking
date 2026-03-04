'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MealPlanRequest, MealPlanResponse, DayPlan, GroceryListResponse } from '../types'

const defaultForm: MealPlanRequest = {
  proteinPercentage: 30,
  carbPercentage: 40,
  fatPercentage: 30,
  totalDailyCalories: 2000,
}

export default function MealPlanPage() {
  const router = useRouter()
  const [form, setForm] = useState<MealPlanRequest>(defaultForm)
  const [result, setResult] = useState<MealPlanResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [groceryLoading, setGroceryLoading] = useState(false)
  const [groceryError, setGroceryError] = useState<string | null>(null)

  const percentageSum = form.proteinPercentage + form.carbPercentage + form.fatPercentage

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (Math.abs(percentageSum - 100) > 1) {
      setError(`Macro percentages must sum to 100. Currently: ${percentageSum}%`)
      return
    }
    if (form.totalDailyCalories <= 0) {
      setError('Total daily calories must be greater than 0.')
      return
    }

    setLoading(true)
    setResult(null)
    setGroceryError(null)
    try {
      const res = await fetch('/api/meal-plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Request failed with status ${res.status}`)
      }
      const data: MealPlanResponse = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate meal plan.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateGroceryList() {
    if (!result) return
    setGroceryLoading(true)
    setGroceryError(null)
    try {
      const res = await fetch('/api/grocery-list/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      })
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      const data: GroceryListResponse = await res.json()
      sessionStorage.setItem('groceryList', JSON.stringify(data))
      router.push('/grocery-list')
    } catch (err: unknown) {
      setGroceryError(err instanceof Error ? err.message : 'Failed to create grocery list.')
    } finally {
      setGroceryLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Generate Weekly Meal Plan</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Enter your macro targets and daily calorie goal to get a personalised 5-day meal plan.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protein&nbsp;<span className="text-gray-400">(%)</span>
            </label>
            <input
              type="number"
              name="proteinPercentage"
              value={form.proteinPercentage}
              onChange={handleChange}
              min={0}
              max={100}
              step={1}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carbohydrates&nbsp;<span className="text-gray-400">(%)</span>
            </label>
            <input
              type="number"
              name="carbPercentage"
              value={form.carbPercentage}
              onChange={handleChange}
              min={0}
              max={100}
              step={1}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fat&nbsp;<span className="text-gray-400">(%)</span>
            </label>
            <input
              type="number"
              name="fatPercentage"
              value={form.fatPercentage}
              onChange={handleChange}
              min={0}
              max={100}
              step={1}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Daily Calories&nbsp;<span className="text-gray-400">(kcal)</span>
            </label>
            <input
              type="number"
              name="totalDailyCalories"
              value={form.totalDailyCalories}
              onChange={handleChange}
              min={1}
              step={1}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className={`text-sm font-medium ${Math.abs(percentageSum - 100) <= 1 ? 'text-green-600' : 'text-red-500'}`}>
          Macro total: {percentageSum}% {Math.abs(percentageSum - 100) <= 1 ? '✓' : '(must equal 100%)'}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Generating…' : 'Generate Meal Plan'}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Targets summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Daily Targets</h3>
            <div className="flex flex-wrap gap-4 text-sm text-green-900">
              <span><strong>{result.targetCalories} kcal</strong></span>
              <span>Protein: <strong>{result.targetProteinInGrams} g</strong></span>
              <span>Carbs: <strong>{result.targetCarbsInGrams} g</strong></span>
              <span>Fat: <strong>{result.targetFatInGrams} g</strong></span>
            </div>
          </div>

          {result.days.map(day => <DayCard key={day.dayNumber} day={day} />)}

          {/* Grocery list CTA */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleCreateGroceryList}
              disabled={groceryLoading}
              className="bg-white hover:bg-gray-50 disabled:opacity-50 border-2 border-green-600 text-green-700 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {groceryLoading ? 'Creating…' : 'Create Grocery List'}
            </button>
            {groceryError && (
              <p className="text-sm text-red-600">{groceryError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function DayCard({ day }: { day: DayPlan }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-green-700 text-white px-5 py-3 flex items-center justify-between">
        <span className="font-semibold">Day {day.dayNumber} — {day.dayName}</span>
        <span className="text-green-200 text-sm">{day.totalCalories} kcal</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <th className="text-left px-4 py-2">Food</th>
              <th className="text-right px-4 py-2">Portion (g)</th>
              <th className="text-right px-4 py-2">Calories</th>
              <th className="text-right px-4 py-2">Protein (g)</th>
              <th className="text-right px-4 py-2">Carbs (g)</th>
              <th className="text-right px-4 py-2">Fat (g)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {day.items.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 font-medium text-gray-800">{item.itemName}</td>
                <td className="px-4 py-2 text-right text-gray-600">{item.portionInGrams}</td>
                <td className="px-4 py-2 text-right text-gray-600">{item.calories}</td>
                <td className="px-4 py-2 text-right text-gray-600">{item.proteinInGrams}</td>
                <td className="px-4 py-2 text-right text-gray-600">{item.carbsInGrams}</td>
                <td className="px-4 py-2 text-right text-gray-600">{item.fatInGrams}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-green-50 font-semibold text-green-900 text-sm">
              <td className="px-4 py-2">Total</td>
              <td className="px-4 py-2 text-right">—</td>
              <td className="px-4 py-2 text-right">{day.totalCalories}</td>
              <td className="px-4 py-2 text-right">{day.totalProteinInGrams}</td>
              <td className="px-4 py-2 text-right">{day.totalCarbsInGrams}</td>
              <td className="px-4 py-2 text-right">{day.totalFatInGrams}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
