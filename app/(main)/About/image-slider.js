import React, { useMemo } from 'react';
import Image from 'next/image';

const ImageSlider = () => {
  const ImageSliderList = useMemo(
    () => [
      { src: '/slide/php' },
      { src: '/slide/aws' },
      { src: '/slide/shellscript' },
      { src: '/slide/centos' },
      { src: '/slide/c' },
      { src: '/slide/cpp' },
      { src: '/slide/css' },
      { src: '/slide/docker' },
      { src: '/slide/git' },
      { src: '/slide/github' },
      { src: '/slide/html' },
      { src: '/slide/jenkins' },
      { src: '/slide/js' },
      { src: '/slide/kubernetes' },
      { src: '/slide/linux' },
      { src: '/slide/nextjs' },
      { src: '/slide/node' },
      { src: '/slide/python' },
      { src: '/slide/react' },
      { src: '/slide/terraform' },
      { src: '/slide/terraform' },
    ],
    []
  );

  return (
    <div className="relative overflow-hidden w-full h-auto mx-auto mt-8">
      <div className="flex animate-scroll  space-x-8 items-center">
        {ImageSliderList.map((item, index) => (
          <Image
            key={index}
            src={`${item.src}.png`}
            width={80}
            height={80}
            alt={`Image ${index + 1}`}
            className="rounded-lg shadow-lg"
          />
        ))}
        {/* Repeat the list to create a seamless loop */}
        {ImageSliderList.map((item, index) => (
          <Image
            key={`repeat-${index}`}
            src={`${item.src}.png`}
            width={80}
            height={80}
            alt={`Image Repeat ${index + 1}`}
            className="rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
