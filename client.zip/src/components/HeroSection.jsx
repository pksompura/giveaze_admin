import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const HeroSection = () => {
  return (
    <section className="relative bg-gray-200 mt-[60px]">
      <div className="md:container mx-auto">
        {/* Swiper Slider */}
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation, Pagination, Autoplay]}
          className="mySwiper"
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="relative w-full h-[400px] lg:h-[600px] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url(/images/banner.png)" }}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-50 z-[1]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] text-center px-4 lg:px-0">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Be a Real-Life Hero
                </h1>
                <p className="mt-4 text-base md:text-xl lg:text-2xl text-gray-200">
                  Make essential commodities accessible to every life in India.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="relative w-full h-[400px] lg:h-[600px] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url(/images/back.png)" }}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-50 z-[1]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] text-center px-4 lg:px-0">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Empower the Future
                </h1>
                <p className="mt-4 text-base md:text-xl lg:text-2xl text-gray-200">
                  Your donations ensure education for children in need.
                </p>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative w-full h-[400px] lg:h-[600px] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: "url(/images/back1.webp)" }}>
              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-50 z-[1]"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[2] text-center px-4 lg:px-0">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Help Us Save Lives
                </h1>
                <p className="mt-4 text-base md:text-xl lg:text-2xl text-gray-200">
                  Support medical supplies and save countless lives in rural areas.
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Bottom Section */}
      <div className="bg-yellow-100 py-6 md:py-10 mt-8 z-[22] border-dashed rounded border-yellow-500 absolute w-[80%] md:w-[60%] -translate-x-1/2 left-1/2 -bottom-[66px] md:-bottom-[73px]">
        <div className="md:container mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold text-yellow-800">
            Trustworthy & Transparent Donations
          </h2>
          <p className="mt-2 text-gray-600 text-xs md:text-normal">
            We keep you in the loop with regular updates and complete transparency on how your donation is used.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
