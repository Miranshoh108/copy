import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Column 1 - Services */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Hujjatlar Servisi
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/catalog"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Mahsulotlar katalogi
                </Link>
              </li>
              <li>
                <Link
                  href="/transport"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Avbarot xizmati
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Umumiy shartlar
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Do'konlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - About Us */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Biz haqimizda
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/archive"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Ofertalar arxivi
                </Link>
              </li>
              <li>
                <Link
                  href="/regulations"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Nizom
                </Link>
              </li>
              <li>
                <Link
                  href="/certificate"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Guvohnoma
                </Link>
              </li>
              <li>
                <Link
                  href="/promocodes"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Promokodlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Catalogs */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Kataloglar
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/catalog-1"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Elektronika katalogi
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog-2"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Kiyim-kechak katalogi
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog-3"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Uy jihozlari katalogi
                </Link>
              </li>
              <li>
                <Link
                  href="/all-catalogs"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 text-sm inline-block"
                >
                  Barcha kataloglar
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Aloqa ma'lumotlari
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#ECF4FF] rounded-md flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#1862D9]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:info@customs.uz"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors text-sm break-all"
                >
                 -
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#ECF4FF] rounded-md flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#1862D9]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+998937476105"
                  className="text-gray-600 hover:text-[#1862D9] transition-colors text-sm"
                >
                  +998 93 747 61 05
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#ECF4FF] rounded-md flex items-center justify-center mt-1 flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#1862D9]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <address className="not-italic text-gray-600 text-sm leading-relaxed">
                  3-manzil, Islom Karimov ko'chasi,
                  <br />
                  Toshkent, 100003,
                  <br />
                  O'zbekiston
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                Yangiliklar uchun obuna bo'ling
              </h4>
              <p className="text-gray-600 text-sm">
                Eng so'nggi takliflar va yangiliklar haqida bilib oling
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <input
                type="email"
                placeholder="Email manzilingiz..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1862D9] focus:border-transparent bg-white text-sm w-full sm:w-64"
              />
              <button className="px-6 py-2 bg-[#1862D9] text-white cursor-pointer rounded-lg hover:bg-[#0052d9] transition-colors duration-200 font-medium text-sm whitespace-nowrap">
                Obuna bo'lish
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-3 sm:space-x-4 justify-center sm:justify-start">
              <a
                href="#"
                className="w-10 h-10 bg-[#ECF4FF] rounded-md flex items-center justify-center hover:bg-[#dbeafe] transition-colors duration-200 group"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5 text-[#1862D9] group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#ECF4FF] rounded-md flex items-center justify-center hover:bg-[#dbeafe] transition-colors duration-200 group"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 text-[#1862D9] group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#ECF4FF] rounded-md flex items-center justify-center hover:bg-[#dbeafe] transition-colors duration-200 group"
                aria-label="Pinterest"
              >
                <svg
                  className="w-5 h-5 text-[#1862D9] group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.753 2.295c-.27 1.045-1.004 2.352-1.486 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#ECF4FF] rounded-md flex items-center justify-center hover:bg-[#dbeafe] transition-colors duration-200 group"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 text-[#1862D9] group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.025 2.486c2.731 0 3.058.01 4.14.06 1.074.049 1.658.228 2.048.379.515.2.882.44 1.27.828.388.388.628.755.828 1.27.15.39.33.974.379 2.048.05 1.082.06 1.409.06 4.14s-.01 3.058-.06 4.14c-.049 1.074-.228 1.658-.379 2.048-.2.515-.44.882-.828 1.27-.388.388-.755.628-1.27.828-.39.15-.974.33-2.048.379-1.082.05-1.409.06-4.14.06s-3.058-.01-4.14-.06c-1.074-.049-1.658-.228-2.048-.379-.515-.2-.882-.44-1.27-.828-.388-.388-.628-.755-.828-1.27-.15-.39-.33-.974-.379-2.048-.05-1.082-.06-1.409-.06-4.14s.01-3.058.06-4.14c.049-1.074.228-1.658.379-2.048.2-.515.44-.882.828-1.27.388-.388.755-.628 1.27-.828.39-.15.974-.33 2.048-.379 1.082-.05 1.409-.06 4.14-.06M12.025 0c-2.782 0-3.131.012-4.22.063-1.087.05-1.831.219-2.48.468-.673.262-1.244.612-1.813 1.18-.568.569-.918 1.14-1.18 1.813-.249.649-.418 1.393-.468 2.48C2.012 6.894 2 7.243 2 10.025s.012 3.131.063 4.22c.05 1.087.219 1.831.468 2.48.262.673.612 1.244 1.18 1.813.569.568 1.14.918 1.813 1.18.649.249 1.393.418 2.48.468 1.089.051 1.438.063 4.22.063s3.131-.012 4.22-.063c1.087-.05 1.831-.219 2.48-.468.673-.262 1.244-.612 1.813-1.18.568-.569.918-1.14 1.18-1.813.249-.649.418-1.393.468-2.48.051-1.089.063-1.438.063-4.22s-.012-3.131-.063-4.22c-.05-1.087-.219-1.831-.468-2.48-.262-.673-.612-1.244-1.18-1.813-.569-.568-1.14-.918-1.813-1.18-.649-.249-1.393-.418-2.48-.468C15.156.012 14.807 0 12.025 0z" />
                  <path d="M12.025 5.848c-2.805 0-5.081 2.276-5.081 5.081s2.276 5.081 5.081 5.081 5.081-2.276 5.081-5.081-2.276-5.081-5.081-5.081zm0 8.378c-1.82 0-3.297-1.477-3.297-3.297s1.477-3.297 3.297-3.297 3.297 1.477 3.297 3.297-1.477 3.297-3.297 3.297z" />
                  <circle cx="17.338" cy="6.691" r="1.188" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-[#ECF4FF] rounded-md flex items-center justify-center hover:bg-[#dbeafe] transition-colors duration-200 group"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5 text-[#1862D9] group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>

            <div className="text-sm text-gray-600 text-center sm:text-left">
              Ijtimoiy tarmoqlarda biz bilan bog'laning
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0 text-center sm:text-left">
              <div className="text-lg sm:text-xl font-bold">
                <span className="text-gray-800">BOJXONA</span>
                <span className="text-[#249B73] ml-1">SERVIS</span>
              </div>
              <span className="text-gray-400 hidden sm:inline">•</span>
              <p className="text-gray-600 text-sm">
                © 2025 Barcha huquqlar himoyalangan
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-center sm:text-left">
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 inline-block"
              >
                Maxfiylik siyosati
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 inline-block"
              >
                Foydalanish shartlari
              </Link>
              <Link
                href="/cookies"
                className="text-gray-600 hover:text-[#1862D9] transition-colors duration-200 inline-block"
              >
                Cookie siyosati
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;