import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/banner.css";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/banners/")
      .then((response) => {
        setBanners(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching banners:", error);
        setError("Failed to fetch banners");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="banner-carousel">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Navigation, Pagination]}
        className="mySwiper"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <div className="banner-overlay"></div> {/* Dark overlay */}
            <img
              src={`http://127.0.0.1:8000/${banner.banner_image}`} // Ensure the path is correct
              alt={banner.title}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <div className="banner-content">
              <h2>{banner.title}</h2>
              <p>{banner.description}</p> {/* Add description if available */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Banner;
