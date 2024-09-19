import React, { useState } from 'react';
import '../../css/landing-page/FaqSection.css';

const FaqSection = ({ faqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="faq-section">
      {faqs.map((faq, index) => (
        <div key={index} className={`faq-item ${activeIndex === index ? 'open' : ''}`}>
          <div className="faq-title" onClick={() => toggleAccordion(index)}>
            {faq.title}
          </div>
          <div className={`faq-content ${activeIndex === index ? 'open' : ''}`}>
            <p>{faq.description}</p>
            {faq.videoUrl && (
              <div className="faq-video">
                <iframe
                  width="560"
                  height="315"
                  src={faq.videoUrl}
                  title={faq.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqSection;
