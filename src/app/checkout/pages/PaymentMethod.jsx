export default function PaymentMethod({ formData, onFormChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">To'lov turi</h2>

      <div className="border rounded-lg p-4 mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="card"
            checked={formData.payment === "card"}
            onChange={onFormChange}
            className="w-4 h-4 text-[#249B73] "
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 bg-[#249B73]  rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">💳</span>
            </div>
            <div>
              <div className="font-medium">BS kartasi bilan</div>
              <div className="text-sm text-gray-600 max-[500px]:hidden">
                BS Bank ilovasida kartani rasmiylashtirishda va buyurtma uchun
                tolash mumkin
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}
