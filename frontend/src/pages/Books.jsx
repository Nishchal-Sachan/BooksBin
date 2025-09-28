import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Filter, SortAsc } from 'lucide-react'

const Books = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Books</h1>
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Books Page</h2>
          <p className="text-gray-500">This page will display the book listing with filters and search functionality.</p>
        </div>
      </div>
    </div>
  )
}

export default Books
