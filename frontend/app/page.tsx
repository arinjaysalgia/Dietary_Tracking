'use client'

import { useEffect, useState, useCallback } from 'react'
import { FoodItem } from './types'
import FoodItemList from './components/FoodItemList'
import AddFoodItemForm from './components/AddFoodItemForm'

export default function Home() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/food-items')
      if (!res.ok) {
        throw new Error(`Failed to fetch food items (HTTP ${res.status})`)
      }
      const data: FoodItem[] = await res.json()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleAdd = useCallback((newItem: FoodItem) => {
    setItems((prev) => [...prev, newItem])
  }, [])

  const handleDelete = useCallback(async (itemName: string) => {
    try {
      const res = await fetch(
        `/api/food-items/${encodeURIComponent(itemName)}`,
        { method: 'DELETE' }
      )
      if (!res.ok) {
        throw new Error(`Failed to delete item (HTTP ${res.status})`)
      }
      setItems((prev) => prev.filter((item) => item.itemName !== itemName))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item')
    }
  }, [])

  return (
    <div className="space-y-8">
      <AddFoodItemForm onAdd={handleAdd} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="font-medium">Error:</span> {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600 font-bold"
            aria-label="Dismiss error"
          >
            x
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 text-sm">Loading food items...</p>
          </div>
        </div>
      ) : (
        <FoodItemList items={items} onDelete={handleDelete} />
      )}
    </div>
  )
}
