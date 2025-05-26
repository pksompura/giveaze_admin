import Donations from "../components/WhytoDonate";
import FormModal from "../components/CampaignForm";
import FAQ from "../components/FAQAccordian";
import FundraisingBanner from "../components/YourCampaign";
import Testimonials from "../components/Testimonial";
// import Footer from "@/components/Footer";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { CiHeart } from "react-icons/ci";
// import "swiper/css/navigation";
// import 'swiper/components/navigation/navigation.min.css';
// import 'swiper/components/pagination/pagination.min.css';

import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { useGetAllCampaignQuery } from "../redux/services/campaignApi";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import ImpactKartComponent from "../components/ImpactKartComponent";

const HeroSlider = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const slides = [
    {
      id: 1,
      background: "/images/back1.webp",
      title: "GUITAR CLASSES FOR KIDS",
      text: "Want to see your kid become more expressive?",
    },
    {
      id: 2,
      background: "/images/back4.webp",
      title: "GUITAR CLASSES FOR KIDS",
      text: "Want to see your kid become more expressive?",
    },
    {
      id: 3,
      background: "/images/back3.webp",
      title: "GUITAR CLASSES FOR KIDS",
      text: "Want to see your kid become more expressive?",
    },
  ];
  const paginationRef = useRef(null);
  const { data: campaigns } = useGetAllCampaignQuery();
  console.log(campaigns);
  useEffect(() => {
    if (paginationRef.current) {
      paginationRef.current.classList.add("custom-swiper-pagination");
    }
  }, [paginationRef]);

  const faqs = [
    { question: "What is Devaseva?", answer: "Devaseva is a platform that..." },
    {
      question: "What are various services offered by Devaseva?",
      answer: "We offer...",
    },
    {
      question: "How can I trust Devaseva?",
      answer: "You can trust us because...",
    },
    {
      question:
        "Will I receive the same benefits if I am not physically present?",
      answer: "Yes, you will receive...",
    },
    {
      question: "Who conducts the pujas?",
      answer: "The pujas are conducted by...",
    },
    {
      question: "Where do you conduct the rituals?",
      answer: "The rituals are conducted...",
    },
    // Add more FAQs as needed
  ];
  return (
    <section>
      <HeroSection />

      {/* <Donations campaigns={campaigns?.campaigns}/> */}
      <div className="py-10 px-3  bg-center bg-cover mt-[50px]">
        <h1 className="text-3xl font-bold text-center text-red-500 ">
          Featured Campaigns
        </h1>
        <p className=" mx-auto my-1 text-center ">
          Discover urgent causes in need of your support
        </p>
        <img
          src="/images/back2.png"
          className="mx-auto w-[20%]"
          alt=""
          srcset=""
        />
        <div className="min-h-96 px-2 w-full md:w-[80%] mx-auto">
          <Swiper
            slidesPerView={1}
            // spaceBetween={10}
            navigation={true}
            pagination={{
              clickable: true,
              el: ".swiper-pagination",
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            breakpoints={{
              480: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 50,
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            loop
            speed={1000}
            modules={[Autoplay, Pagination, Navigation]}
            className="w-full my-3 "
          >
            {campaigns?.campaigns?.map((data, i) => (
              <SwiperSlide
                className="flex items-center w-full justify-center h-96 mb-6 "
                key={i + "1"}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden border-2 p-2">
                  <img
                    src={data?.main_picture}
                    alt={data?.campaign_title}
                    className="w-full h-48 object-cover rounded"
                  />
                  <div className="p-4">
                    <Tooltip
                      title={
                        data?.is_approved
                          ? "Tax Benefits Available"
                          : "Not Available"
                      }
                    >
                      <span
                        className={`rounded-full px-2 text-xs cursor-pointer font-semibold ${
                          data?.is_approved
                            ? "bg-orange-600 text-white"
                            : "bg-gray-400 text-white"
                        }`}
                      >
                        {data?.is_approved
                          ? "Tax Benefits Available"
                          : "No Tax Benefits"}
                      </span>
                    </Tooltip>
                    <h3 className="mt-1 text-xl font-bold">{data?.ngo_name}</h3>
                    <h3 className="mt-1 text-[15px] text-red-500">
                      {data?.campaign_title}
                    </h3>
                    {/* <p className="text-gray-600 mt-1 mb-4 text-base h-28 overflow-auto vertical-scroller">
          {data?.campaign_description}
        </p> */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {Math.round(
                            (Math.round(data?.minimum_amount?.$numberDecimal) /
                              Math.round(data?.target_amount?.$numberDecimal)) *
                              100
                          )}
                          % raised
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-orange-500 h-2.5 rounded-full"
                          style={{
                            width: `${Math.round(
                              (Math.round(
                                data?.minimum_amount?.$numberDecimal
                              ) /
                                Math.round(
                                  data?.target_amount?.$numberDecimal
                                )) *
                                100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 my-1">
                        200 Donations
                      </p>
                      <hr className="h-2 my-2" />
                      <Link to={`/campaign/${data?._id}`}>
                        <button className="w-full bg-gradient-to-r flex gap-2 items-center justify-center from-red-500 via-pink-500 to-yellow-500 hover:via-brown-500 text-white font-bold py-2 px-4 rounded-full">
                          Donate Now{" "}
                          <span>
                            <CiHeart className="animate-ping" />
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <div ref={paginationRef} className="swiper-pagination"></div>
          </Swiper>
        </div>
      </div>
      <FundraisingBanner />

      <div className="px-3 md:px-10 my-4 w-full md:w-[85%] mx-auto">
        <h2 className="text-2xl font-bold text-center ">FAQs</h2>
        <p className="text-center">
          Clear you all your doubts here regarding how things work
        </p>
        <FAQ />
      </div>
      <HowItWorks />
      <ImpactKartComponent />
      <Testimonials />
      {/* <FormModal open={open} onClose={handleClose} /> */}
    </section>
  );
};

export default HeroSlider;
