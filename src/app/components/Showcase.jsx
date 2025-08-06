"use client";

import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

export default function Showcase() {
  const images = [
    "/images/showcase.jpg",
    "/images/bacgraund.jpg",
    "/images/showcase.jpg",
    "/images/bacgraund.jpg",
    "/images/showcase.jpg",
  ];

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerPadding: "20px",
  };

  return (
    <section className="text-center relative mt-10">
      <div className="relative max-w-[1240px] mx-auto">
        {/* Arrow buttons */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="absolute top-[calc(50%)] -left-16 z-20 cursor-pointer -translate-y-1/2 bg-linear-to-r from-[#EED3DC] to-[#CDD6FD] text-black p-2 rounded-full shadow-lg hover:scale-110 transition"
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="absolute top-[calc(50%)] -right-16 z-20 cursor-pointer -translate-y-1/2 bg-gradient-to-r from-[#3ed890] to-[#388ef0] text-white p-2 rounded-full shadow-lg hover:scale-110 transition"
        >
          <ChevronRight />
        </button>

        {/* Slider container with fixed 366px height */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ height: "366px" }}
        >
          <Slider ref={sliderRef} {...settings}>
            {images.map((image, index) => (
              <div key={index} className="h-full">
                <div className="h-full">
                  <Image
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full"
                    width={1240}
                    height={366}
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx global>{`
        .slick-list {
          overflow: hidden !important;
          border-radius: 16px !important;
          height: 366px !important;
        }
        .slick-slide {
          padding: 0 !important;
          margin: 0 !important;
        }
        .slick-track {
          display: flex !important;
          height: 366px !important;
        }
        .slick-slide > div {
          height: 366px !important;
          border-radius: 16px !important;
          overflow: hidden !important;
        }
        .slick-dots {
          bottom: -30px !important;
        }
        .slick-dots li button:before {
          color: blue;
          opacity: 0.3;
        }
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: darkblue;
        }
      `}</style>
    </section>
  );
}
