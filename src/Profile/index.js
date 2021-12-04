import React, { useEffect, useState } from "react";
import Uploader from "../Base";
import "../tailwind.css";

const ProfilePicture = function ({ uploadFiles }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => console.log("image url", imageUrl), [imageUrl]);

  return (
    <div className="flex flex-row items-center">
      {imageUrl && <img className="h-10 object-cover" src={imageUrl} />}

      {!imageUrl && (
        <div className="rounded-full h-40 w-40 border text-center flex justify-center items-center">
          Not Set
        </div>
      )}

      <Uploader
        multiple={false}
        accept={"image/*"}
        autoUpload={true}
        openFileUploader={(triggerClickHandler) => (
          <button
            type="button"
            className="bg-transparent ml-3"
            onClick={() => {
              triggerClickHandler();
            }}
          >
            <span className="p-2 bg-blue-600 rounded text-white">
              Change Picture
            </span>
          </button>
        )}
        uploadFiles={(e) => uploadFiles(e)}
        afterUpload={(e) => setImageUrl(e.download_url)}
      />
    </div>
  );
};

export default ProfilePicture;
