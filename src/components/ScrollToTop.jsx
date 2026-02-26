import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    show && (
      <button
        onClick={scrollTop}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 999,
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: "#198754",
          color: "#fff",
          cursor: "pointer",
        }}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    )
  );
};

export default ScrollToTop;
