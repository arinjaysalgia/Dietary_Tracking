'use client'

import { useState, FormEvent } from 'react'
import { FoodItem } from '../types'

interface AddFoodItemFormProps {
  onAdd: (item: FoodItem) => void
}

const emptyForm = {
  itemName: '',
  quantityInGrams: '',
  calories: '',
  proteinInGrams: '',
  carbohydratesInGrams: '',
  fatInGrams: '',
}

export default function AddFoodItemForm({ onAdd }: AddFoodItemFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(false)

    const payload: FoodItem = {
      itemName: form.itemName.trim(),
      quantityInGrams: parseFloat(form.quantityInGrams),
      calories: parseFloat(form.calories),
      proteinInGrams: parseFloat(form.proteinInGrams),
      carbohydratesInGrams: parseFloat(form.carbohydratesInGrams),
      fatInGrams: parseFloat(form.fatInGrams),
    }

    try {
      const res = await fetch('/api/food-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Server returned HTTP ${res.status}`)
      }

      const created: FoodItem = await res.json()
      onAdd(created)
      setForm(emptyForm)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add food item')
    } finally {
      setSubmitting(false)
    }
  }

  const fields: {
    name: keyof typeof emptyForm
    label: string
    type: string
    placeholder: string
  }[] = [
    { name: 'itemName', label: 'Item Name', type: 'text', placeholder: 'e.g. Apple' },
    { name: 'quantityInGrams', label: 'Quantity (g)', type: 'number', placeholder: 'e.g. 150' },
    { name: 'calories', label: 'Calories', type: 'number', placeholder: 'e.g. 80' },
    { name: 'proteinInGrams', label: 'Protein (g)', type: 'number', placeholder: 'e.g. 0.3' },
    { name: 'carbohydratesInGrams', label: 'Carbs (g)', type: 'number', placeholder: 'e.g. 21' },
    { name: 'fatInGrams', label: 'Fat (g)', type: 'number', placeholder: 'e.g. 0.2' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">Add Food Item</h2>
      <p className="text-sm text-gray-500 mb-5">Fill in the nutritional details for a new food item.</p>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
          Food item added successfully!
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label
                htmlFor={field.name}
                className="text-xs font-semibold text-gray-600 uppercase tracking-wide"
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
                required
                min={field.type === 'number' ? 0 : undefined}
                step={field.type === 'number' ? 'any' : undefined}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              'Add Food Item'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
