import { IKContext, IKUpload } from "imagekitio-react";
import React, { useRef } from "react";
import { toast } from "react-toastify";

const authenticator = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/upload-auth`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    // Parse and destructure the response JSON for upload credentials.
    const data = await response.json();
    const { signature, expire, token, publicKey } = data;
    return { signature, expire, token, publicKey };
  } catch (error) {
    // Log the original error for debugging before rethrowing a new error.
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

const Upload = ({ children, type, setProgress, setData }) => {
  const ref = useRef(null);

  const onError = (err) => {
    console.log(err);
    toast.error("Image upload failed");
  };

  const onSuccess = (res) => {
    console.log(res);
    setData(res);
  };

  const onUploadProgress = (progressEvent) => {
    setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IK_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINTS}
      authenticator={authenticator}
    >
      <IKUpload
        useUniqueFileName
        folder="blog-assets/"
        onError={onError}
        onSuccess={onSuccess}
        onUploadProgress={onUploadProgress}
        className="hidden"
        ref={ref}
        accept={`${type}/*`}
      />
      <div className="cursor-pointer" onClick={() => ref.current?.click()}>
        {children}
      </div>
    </IKContext>
  );
};

export default Upload;
