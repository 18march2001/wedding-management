const FALLBACK_CONTENT = `At HareKrishna Photography, we capture the essence of your most cherished moments
              with precision and creativity. We believe in telling stories through our lens,
              transforming fleeting moments into timeless memories. Our approach blends modern
              techniques with a deep understanding of traditional aesthetics, ensuring every shot
              is as unique as the love story it portrays.`;

export default function DescriptionSection({ websiteContent, leftSideImage, rightSideImage }) {
  return (
    <section className="description-container">
      <div className="header">
        <h1>HareKrishna Photography</h1>
      </div>
      <div className="row">
        <div className="col-6 col-md-4 order-1 order-md-1">
          <div className="description-image-cover cover-1">
            <img src={leftSideImage?.url || '/images/Description page/desc-2.webp'} alt="Wedding couple portrait" />
          </div>
        </div>
        <div className="col-12 p-3 col-md-4 order-3 order-md-2 fixed-margin-100">
          <div className="description-content-main">
            <p>{websiteContent || FALLBACK_CONTENT}</p>
          </div>
        </div>
        <div className="col-6 col-md-4 order-2 order-md-3">
          <div className="description-image-cover cover-2">
            <img src={rightSideImage?.url || '/images/Description page/desc-1.webp'} alt="Wedding celebration" />
          </div>
        </div>
      </div>
    </section>
  );
}
