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
    <div className="relative mx-auto mt-8 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-scroll items-center gap-5 sm:gap-8">
        {ImageSliderList.map((item, index) => (
          <Image
            key={index}
            src={`${item.src}.png`}
            width={72}
            height={72}
            alt={`Image ${index + 1}`}
            className="h-14 w-14 rounded-xl object-contain shadow-lg sm:h-[72px] sm:w-[72px]"
          />
        ))}
        {/* Repeat the list to create a seamless loop */}
        {ImageSliderList.map((item, index) => (
          <Image
            key={`repeat-${index}`}
            src={`${item.src}.png`}
            width={72}
            height={72}
            alt={`Image Repeat ${index + 1}`}
            className="h-14 w-14 rounded-xl object-contain shadow-lg sm:h-[72px] sm:w-[72px]"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
