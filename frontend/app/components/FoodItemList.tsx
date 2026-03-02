'use client'

import { FoodItem } from '../types'

interface FoodItemListProps {
  items: FoodItem[]
  onDelete: (itemName: string) => void
}

export default function FoodItemList({ items, onDelete }: FoodItemListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
        <p className="text-gray-400 text-lg">No food items yet.</p>
        <p className="text-gray-300 text-sm mt-1">Use the form above to add your first item.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Food Items</h2>
        <p className="text-sm text-gray-500 mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} tracked</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
              <th className="px-6 py-3 text-left font-semibold">Item Name</th>
              <th className="px-6 py-3 text-right font-semibold">Qty (g)</th>
              <th className="px-6 py-3 text-right font-semibold">Calories</th>
              <th className="px-6 py-3 text-right font-semibold">Protein (g)</th>
              <th className="px-6 py-3 text-right font-semibold">Carbs (g)</th>
              <th className="px-6 py-3 text-right font-semibold">Fat (g)</th>
              <th className="px-6 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, index) => (
              <tr
                key={item.itemName}
                className={`hover:bg-green-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-800">{item.itemName}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.quantityInGrams}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.calories}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.proteinInGrams}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.carbohydratesInGrams}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.fatInGrams}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onDelete(item.itemName)}
                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-md hover:bg-red-100 hover:text-red-700 transition-colors border border-red-100"
                    aria-label={`Delete ${item.itemName}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
