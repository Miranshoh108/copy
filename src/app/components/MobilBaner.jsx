"use client";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import $api from "../http/api";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function MobilBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await $api.get(
          "/banners/all?page=1&limit=10&position=header"
        );

        if (response.data.success && response.data.data) {
          setBanners(response.data.data);
        } else {
          setError("Bannerlar topilmadi");
        }
      } catch (err) {
        console.error("Banner yuklashda xato:", err);
        setError("Bannerlarni yuklashda xato yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/placeholder.png";

    if (imageUrl.startsWith("/")) {
      return `${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/${imageUrl}`;
  };

  const settings = {
    dots: true,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    arrows: false,
    centerPadding: "20px",
    pauseOnHover: true,
  };

  if (loading) {
    return (
      <section className="text-center relative mt-4 mb-3 hidden max-[720px]:block">
        <div className="relative max-w-[1240px] max-[750px]:max-w-[95%] max-[1400px]:max-w-[80%] mx-auto">
          <div
            className="rounded-2xl overflow-hidden bg-gray-200 animate-pulse"
            style={{ height: "180px" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-500">Yuklanmoqda...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="text-center relative mt-4 mb-3 hidden max-[720px]:block">
        <div className="relative max-w-[1240px] max-[750px]:max-w-[95%] max-w-[1400px]:max-w-[80%] mx-auto">
          <div
            className="rounded-2xl overflow-hidden bg-red-100 border border-red-300"
            style={{ height: "180px" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-red-600">{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="text-center relative mt-4 mb-3 hidden max-[720px]:block">
        <div className="relative max-w-[1240px] max-[750px]:max-w-[95%] max-[1400px]:max-w-[80%] mx-auto">
          <div
            className="rounded-2xl overflow-hidden bg-gray-100"
            style={{ height: "180px" }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-gray-500">Bannerlar topilmadi</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="text-center relative mt-4 mb-3 hidden max-[720px]:block">
      <div className="relative max-w-[1240px] max-[750px]:max-w-[100%] max-[1400px]:max-w-[80%] mx-auto">
        <div
          className="mobil-banner-slider rounded-2xl overflow-hidden"
          style={{ height: "180px" }}
        >
          <Slider ref={sliderRef} {...settings}>
            {banners.map((banner, index) => (
              <div key={banner._id || index} className="h-full">
                <div className="h-full relative">
                  <Image
                    src={getImageUrl(banner.mobile_image_url)}
                    alt={`Banner ${index + 1}`}
                    className="w-[400px] h-full object-contain"
                    width={360}
                    height={200}
                    priority={index === 0}
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABklEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII="
                    onError={(e) => {
                      console.error(
                        "Rasm yuklashda xato:",
                        banner.mobile_image_url
                      );
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <style jsx global>{`
        .mobil-banner-slider .slick-list {
          overflow: hidden !important;
          height: 180px !important;
        }
      
        .mobil-banner-slider .slick-track {
          display: flex !important;
          height: 180px !important;
        }
        .mobil-banner-slider .slick-slide > div {
          height: 180px !important;
          overflow: hidden !important;
        }
        .mobil-banner-slider .slick-dots {
          bottom: -30px !important;
        }
        .mobil-banner-slider .slick-dots li button:before {
          color: green;
          opacity: 0.3;
        }
        .mobil-banner-slider .slick-dots li.slick-active button:before {
          opacity: 1;
          color: #249b73;
        }
      `}</style>
    </section>
  );
}
