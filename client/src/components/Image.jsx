import React from "react";
import { IKImage } from "imagekitio-react";

const Image = ({ path, src, className, w, h, alt }) => {
  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINTS}
      path={path}
      src={src}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      transformation={[
        {
          width: w,
          height: h,
          crop: "at_max", // Preserves aspect ratio while fitting within dimensions
          background: "transparent", // Optional: Set padding color
        },
      ]}
    />
  );
};

export default Image;
