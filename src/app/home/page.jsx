"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import PriceFilter from "../components/Sidebar/PriceFilter";
import CheckboxFilters from "../components/Sidebar/Checkbox-filters";
import ProductGrid from "../components/Sidebar/ProductGrid";
import Button from "../components/ui/button";
import Navbar from "../components/Navbar";

export default function Home() {
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [filters, setFilters] = useState([]);
  const [sortOption, setSortOption] = useState("all");

  const handleResetFilters = () => {
    setPriceRange([0, 10000000]);
    setFilters([]);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar className='w-90%' />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar (Faqat Desktop) */}
          <div className="hidden md:block w-72 bg-white p-6 rounded-lg shadow-sm">
            <Sidebar />
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold text-gray-700">
                Narx so‘mda
              </h3>
              <PriceFilter
                min={0}
                max={10000000}
                range={priceRange}
                onRangeChange={setPriceRange}
              />
            </div>
            <div className="mt-8">
              <CheckboxFilters checked={filters} onCheckedChange={setFilters} />
            </div>
            <div className="mt-8">
              <Button
                className="w-full bg-pink-500 text-white hover:bg-pink-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2 text-sm font-medium rounded-lg py-2.5 transition-colors duration-200 ease-in-out"
                onClick={handleResetFilters}
                aria-label="Filtrlarni tozalash"
              >
                Filtrni tozalash
              </Button>
            </div>
          </div>

          {/* Asosiy kontent */}
          <div className="flex-1">
            {/* Breadcrumb va Saralash */}
            <div className="bg-white p-5 mb-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  Notebooklar / Kompyuterlar va notebooklar / Laptop Notebooklar
                </span>
              </div>
              <div className="w-full sm:w-auto">
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors"
                  aria-label="Saralash opsiyasi"
                >
                  <option value="all">Barcha</option>
                  <option value="price-asc">Narx: Pastdan yuqoriga</option>
                  <option value="price-desc">Narx: Yuqoridan pastga</option>
                  <option value="popularity">Mashhurlik bo‘yicha</option>
                </select>
              </div>
            </div>

            <ProductGrid
              priceRange={priceRange}
              filters={filters}
              sortOption={sortOption}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
