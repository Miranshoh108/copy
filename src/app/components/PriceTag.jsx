"use client";

export default function PriceTag({ price, oldPrice, installmentPrice, loanPrice }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-3xl font-bold text-gray-900">
          {price.toLocaleString()} so'm
        </span>
        {oldPrice && (
          <span className="ml-3 text-lg text-gray-500 line-through">
            {oldPrice.toLocaleString()} so'm
          </span>
        )}
      </div>
      
      {installmentPrice && (
        <div className="text-green-600 font-medium">
          {installmentPrice.toLocaleString()} so'mga muddatli to'lov
        </div>
      )}
      
      {loanPrice && (
        <div className="text-blue-600 font-medium">
          {loanPrice.toLocaleString()} so'mga kredit
        </div>
      )}
    </div>
  );
}