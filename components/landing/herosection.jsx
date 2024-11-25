"use client"
import { useRef } from "react";

const HeroSection = () => {
  let imgs = [];
  let currentIndex = 0;
  let steps = 0;
  let nbOfImages = 0;

  const getCurrentImages = () => {
    let images = [];
    let indexOfFirst = currentIndex - nbOfImages;

    for (let i = indexOfFirst; i < currentIndex; i++) {
      let targetIndex = i;
      if (targetIndex < 0) targetIndex += imgs.length;
      images.push(imgs[targetIndex].current);
    }

    return images;
  };

  let maxNumberOfImages = 7;
  const manageMouseMove = e => {
    const { clientX, clientY, movementX, movementY } = e;
    steps += Math.abs(movementX) + Math.abs(movementY);

    if (steps >= currentIndex * 150) {
      moveImage(clientX, clientY);
      if (nbOfImages == maxNumberOfImages) {
        removeImage();
      }
    }

    if (currentIndex == imgs.length) {
      currentIndex = 0;

      steps = -150;
    }
  };

  const removeImage = () => {
    const images = getCurrentImages();
    images[0].style.display = "none";
    nbOfImages--;
  };

  const moveImage = (x, y) => {
    const currentImage = imgs[currentIndex].current;
    currentImage.style.left = x + "px";
    currentImage.style.top = y + "px";
    currentImage.style.display = "block";
    currentIndex++;
    nbOfImages++;
    setZIndex();
  };

  const setZIndex = () => {
    const images = getCurrentImages();
    for (let i = 0; i < images.length; i++) {
      images[i].style.zIndex = i;
    }
  };

  return (
    <section
      onMouseMove={e => {
        manageMouseMove(e);
      }}
      className="h-svh flex items-end p-16 relative overflow-hidden"
    >
      {[...Array(7).keys()].map((_, i) => {
        const ref = useRef(null);
        imgs.push(ref);
        return (
          <img
            className="absolute hidden mix-blend-normal z-10 w-[20vw]"
            key={i}
            ref={ref}
            src={`./termal/${i}.jpg`}
          />
        );
      })}
      <div className="relative z-20 text-start mix-blend-normal">
        <h1 className="font-sunday text-white text-8xl">
          EARTH <br /> CONNECT
        </h1>
        <p className="text-white text-start font-satoshi font-medium text-2xl w-[38vw]">
          Discover how wildfires affect the air we breathe. Explore real-time
          data, visualize the impact, and take action for a healthier planet.
        </p>
      </div>
      <div className="absolute top-0 left-0 h-full w-full bg-[#3000EE] mix-blend-saturation" />
    </section>
  );
};

export default HeroSection;
