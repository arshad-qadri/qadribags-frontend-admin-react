import { useState } from 'react'
import ReactSlick from 'react-slick'

const Slider = ReactSlick.default || ReactSlick

function ImageSlider({
  images,
  altBase,
  emptyLabel = 'No image available',
  aspectClass = 'aspect-[4/3]',
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div
        className={`flex ${aspectClass} items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500 ${className}`}
      >
        {emptyLabel}
      </div>
    )
  }

  const hasMultipleImages = images.length > 1
  const safeActiveIndex = activeIndex >= images.length ? 0 : activeIndex
  const activeImage = images[safeActiveIndex]

  const sliderSettings = {
    arrows: true,
    dots: true,
    infinite: hasMultipleImages,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: false,
    autoplay:true,
    beforeChange: (_, next) => setActiveIndex(next),
  }

  return (
    <div className={className}>
      {hasMultipleImages ? (
        <div className="product-gallery-slider relative">
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <div key={image.public_id  || index}>
                <img
                  src={image.url}
                  alt={`${altBase} ${index + 1}`}
                  className={`${aspectClass} w-full object-cover`}
                />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <img
          src={activeImage.url}
          alt={altBase}
          className={`${aspectClass} w-full object-cover`}
        />
      )}
    </div>
  )
}

export default ImageSlider
