import React from 'react';
import { FaHandHoldingHeart, FaShoppingCart, FaCheckSquare, FaGift } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaHandHoldingHeart className="text-orange-600" size={50} />,
      heading: 'Choose a Cause',
      subHeading: 'Donate towards campaigns that you wish to support.',
    },
    {
      icon: <FaShoppingCart className="text-orange-600" size={50} />,
      heading: 'Add Products to Donate',
      subHeading: 'Select products and add them to your cart.',
    },
    {
      icon: <FaCheckSquare className="text-orange-600" size={50} />,
      heading: 'Complete Your Donation',
      subHeading: 'Checkout and pay for the selected products.',
    },
    {
      icon: <FaGift className="text-orange-600" size={50} />,
      heading: 'Products Reach the NGOs',
      subHeading: 'We ensure that the donated products reach the NGOs and people in need.',
    },
  ];

  return (
    <div className=' w-full md:w-[82%] my-4 mx-auto px-4' >
    
      <h1 className='text-xl font-bold text-orange-500'>How It Works</h1>
    <div className="grid gid-cols-1 md:grid-cols-4  gap-6 pt-2">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-4 bg-orange-200 rounded-lg  border-2"
        >
          <div className="mb-4 w-fit mr-auto">
            {step.icon}
          </div>
          <div className="font-semibold text-lg text-left w-full">{step.heading}</div>
          <div className="text-gray-600 text-left mt-2">{step.subHeading}</div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default HowItWorks;
