export default function PaymentMethod({ formData, onFormChange }) {
  const handleClickPayment = () => {
    // Click to'lov parametrlari
    const clickParams = {
      service_id: "YOUR_SERVICE_ID", // Bu yerda haqiqiy service_id ni kiriting
      merchant_id: "YOUR_MERCHANT_ID", // Bu yerda haqiqiy merchant_id ni kiriting
      amount: formData.totalAmount || 100000, // To'lov miqdori (tiyin hisobida)
      transaction_param: `order_${Date.now()}`, // Unique transaction ID
      return_url: window.location.origin + "/payment/success", // Qaytish URL'i
      card_type: "uzcard", // yoki "humo"
    };

    // Click URL ni yaratish
    const clickUrl = `https://my.click.uz/services/pay?service_id=${
      clickParams.service_id
    }&merchant_id=${clickParams.merchant_id}&amount=${
      clickParams.amount
    }&transaction_param=${
      clickParams.transaction_param
    }&return_url=${encodeURIComponent(clickParams.return_url)}&card_type=${
      clickParams.card_type
    }`;

    window.open(clickUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">To'lov turi</h2>

      <div className="border rounded-lg p-4 mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="click"
            checked={formData.payment === "click"}
            onChange={onFormChange}
            className="w-4 h-4 text-[#249B73]"
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 bg-[#249B73] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <div>
              <div className="font-medium">Click orqali to'lash</div>
              <div className="text-sm text-gray-600 max-[500px]:hidden">
                Click tizimi orqali xavfsiz to'lov amalga oshiring
              </div>
            </div>
          </div>
        </label>
      </div>

      <div className="border rounded-lg p-4 mb-4 opacity-50">
        <label className="flex items-center gap-3 cursor-not-allowed">
          <input
            type="radio"
            name="payment"
            value="payme"
            disabled
            className="w-4 h-4 text-gray-400"
          />
          <div className="flex items-center gap-3">
            <div className="w-8 h-6 bg-[#00E6CC] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <div>
              <div className="font-medium text-gray-500">
                Payme orqali to'lash
              </div>
              <div className="text-sm text-gray-400 max-[500px]:hidden">
                Tez orada... (integratsiya jarayonida)
              </div>
            </div>
          </div>
        </label>
      </div>

      {formData.payment === "click" && (
        <div className="mt-4">
          <button
            onClick={handleClickPayment}
            className="w-full bg-[#249B73] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#249B73] transition-colors"
          >
            Click orqali to'lash
          </button>
        </div>
      )}

      {formData.payment === "payme" && (
        <div className="mt-4">
          <button className="w-full bg-[#249B73] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1e7a5a] transition-colors">
             Payme orqali to'lash
          </button>
        </div>
      )}
    </div>
  );
}
