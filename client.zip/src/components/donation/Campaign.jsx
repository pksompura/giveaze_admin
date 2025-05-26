import React, { useState, useEffect } from "react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import { useLazyGetCampaignQuery } from "../../redux/services/campaignApi";
import { useParams } from "react-router-dom";
import "swiper/css";

// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

const CampaignPage = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const { id } = useParams();
  const [get, { data, error, isLoading }] = useLazyGetCampaignQuery();
  const [images, setImages] = useState([]);
  const [campaign, setCampaign] = useState();
  useEffect(() => {
    if (id) {
      get(id);
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      setCampaign(data?.data?.campaign);
    }
  }, [data]);

  useEffect(() => {
    if (campaign) {
      setImages(campaign.other_pictures);
      console.log(
        campaign.other_pictures?.map((data) => {
          console.log(data);
        })
      );
    }
  }, [campaign]);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading campaign data</div>;

  // const campaign =  || {};

  // const images =   [campaign?.main_picture , ...campaign?.other_pictures]
  images?.map((data) => console.log(data));
  return (
    <div className="w-full lg:w-[1100px] mx-auto p-4 mt-20">
      {/* Top Title Section */}
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">
          {campaign?.campaign_title || "Campaign Title"}
        </h1>
        <p className="text-blue-600 mt-2">
          Fundraiser by{" "}
          <span className="font-bold">{campaign?.ngo_name || "Organizer"}</span>
        </p>
        <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm mt-4">
          {campaign?.beneficiary || "Category"}
        </span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* Left Section - Image Carousel and Stats */}
        <div className="md:col-span-2">
          {/* Image Carousel */}
          <div className="">
            {campaign?.other_pictures?.length > 0 ? (
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
                //  breakpoints={{
                //    480: {
                //      slidesPerView: 1,
                //      spaceBetween: 20,
                //    },
                //    640: {
                //      slidesPerView: 2,
                //      spaceBetween: 20,
                //    },
                //    768: {
                //      slidesPerView: 2,
                //      spaceBetween: 40,
                //    },
                //    1024: {
                //      slidesPerView: 2,
                //      spaceBetween: 50,
                //    },
                //  }}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                loop
                speed={1000}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full my-3 "
              >
                {campaign?.other_pictures?.map((image, i) => (
                  <SwiperSlide
                    className="flex items-center w-full justify-center h-96 mb-6 "
                    key={i + "1"}
                  >
                    <img
                      src={image}
                      alt={`Slide ${i + 1}`}
                      className="w-full h-[300px] rounded-md shadow-md"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p>No images available</p>
            )}

            {/* Slide Number Display */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-md text-sm">
                {currentSlide}/{images?.length}
              </div>
            )}

            {/* Social Stats (dummy) */}
            <div className="absolute top-4 left-4 flex items-center space-x-4 text-white">
              <button className="bg-white text-gray-800 px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                <i className="fas fa-heart"></i> <span>1.9K</span>
              </button>
              <button className="bg-white text-gray-800 px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                <i className="fas fa-share"></i> <span>104</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-2 rounded-md shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-center bg-gray-800 text-white rounded-t-md py-2">
              Description
            </h3>
            <div className="text-gray-700 mb-4 h-[400px] overflow-auto custom-scrollbar">
              {campaign?.campaign_description || "No description available"}
            </div>
          </div>
        </div>

        {/* Right Section - Donation and Details */}
        <div className="space-y-6 md:col-span-2">
          {/* Donation Section */}
          <div className="bg-white p-2 rounded-md shadow-md text-center">
            <h2 className="text-4xl font-bold text-green-600">
              ₹{campaign?.minimum_amount?.$numberDecimal || "0"}
            </h2>
            <p className="text-gray-600">
              Raised of ₹{campaign?.target_amount?.$numberDecimal || "0"}
            </p>
            <p className="text-gray-500 mb-4">(Progress Pending)</p>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md w-full">
              DONATE NOW
            </button>
            <p className="text-gray-500 mt-2">
              Platform will donate 3% extra on your behalf!
            </p>
            <div className="mt-4 flex justify-center">
              <button className="text-blue-500 underline">
                Share this Campaign
              </button>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="bg-white p-2 rounded-md shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4 text-center bg-gray-800 text-white rounded-t-md py-2">
              Campaign Details
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <div className="bg-yellow-500 text-white w-8 h-8 flex justify-center items-center rounded-full font-bold">
                  N
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">
                    {campaign?.ngo_name || "NGO Name"}
                  </p>
                  <p className="text-gray-600">Organizer</p>
                </div>
              </li>
              <li className="flex items-center space-x-3">
                <div className="bg-green-500 text-white w-8 h-8 flex justify-center items-center rounded-full font-bold">
                  L
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">
                    {campaign?.state || "Location"}
                  </p>
                  <p className="text-gray-600">Location</p>
                </div>
              </li>
            </ul>
          </div>

          {/* FAQs */}
          <div className="bg-white p-2 rounded-md shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">FAQs</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">
                  Does the platform charge any service fee?
                </h4>
                <p className="text-gray-700">
                  No, we do not charge a service fee.
                </p>
              </div>
              <div>
                <h4 className="font-semibold">
                  How will my donation reach the person in need?
                </h4>
                <p className="text-gray-700">
                  Your donation goes directly to the NGO handling the cause.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
