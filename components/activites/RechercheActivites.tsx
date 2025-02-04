'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface RechercheActivitesProps {
  types: { id: number; nom: string }[]
  onSearch: (search: string) => void
  onFilterType: (typeId: number | null) => void
  onSort: (sort: 'date' | 'places') => void
}

export default function RechercheActivites({
  types,
  onSearch,
  onFilterType,
  onSort
}: RechercheActivitesProps) {
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch(value)
  }

  const handleTypeFilter = (typeId: number | null) => {
    setSelectedType(typeId)
    onFilterType(typeId)
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher une activité..."
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        <div className="filters-header">
          <h3 className="filters-title">
            <Filter className="filter-icon" />
            Filtres
          </h3>
          <button
            onClick={() => {
              setSelectedType(null)
              setSearchValue('')
              onFilterType(null)
              onSearch('')
            }}
            className="reset-button"
          >
            Réinitialiser
          </button>
        </div>

        <div className="filter-buttons">
          <button
            onClick={() => handleTypeFilter(null)}
            className={`filter-button ${selectedType === null ? 'active' : ''}`}
          >
            Toutes
          </button>
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeFilter(type.id)}
              className={`filter-button ${selectedType === type.id ? 'active' : ''}`}
            >
              {type.nom}
            </button>
          ))}
        </div>

        <div className="sort-section">
          <select
            onChange={(e) => onSort(e.target.value as 'date' | 'places')}
            className="sort-select"
          >
            <option value="date">Trier par date</option>
            <option value="places">Trier par places disponibles</option>
          </select>
        </div>
      </div>
    </div>
  )
} 