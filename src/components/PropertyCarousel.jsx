import Slider from 'react-slick';
import PropertyCard from './PropertyCard';

function PropertyCarousel({ properties }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </Slider>
  );
}

export default PropertyCarousel;
