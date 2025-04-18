import React from 'react';

const ImpactKartComponent = () => {
  return (
    <div className="px-8 py-3" style={{backgroundImage:"url(/images/back12.png)"}}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl font-bold text-white">
            Impactkart - India's Trusted Donation-Based Crowdfunding Platform <span role="img" aria-label="heart">💛</span>
          </h1>
          <p className="mt-4 text-[13px] text-white">
            With Impactkart, we provide a platform that supports various initiatives - be it increasing access to healthcare or providing education for all, be it making basic necessities available to the needy or providing food and shelter to the voiceless animals.
          </p>
          <p className="mt-4 text-[13px] text-white">
            Our platform connects you with meaningful causes, providing a seamless donation experience with complete transparency and accountability. <em>Together, we can make basic needs accessible to every life in India.</em>
          </p>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8 flex justify-center md:justify-end">
          <img
            src="https://d2aq6dqxahe4ka.cloudfront.net/themes/neumorphism/images/impact_kart/cow.png"
            alt="Cow"
            className="w-full h-auto max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ImpactKartComponent;
