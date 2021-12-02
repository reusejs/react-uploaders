import React, { useEffect, useState } from 'react';
import Uploader from '../base/index.js';
import { logger } from '@frontend/utils';
import { getFile } from '@frontend/services';

const ProfilePicture = function ({ onUploaded, file_uuid }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        if (file_uuid !== '') {
          let profilePic = await getFile(file_uuid);
          setImageUrl(profilePic.download_url);
        }
      } catch (error) {
        //
      }
    })();
  }, [file_uuid]);

  return (
    <div className="flex flex-row items-center">
      {imageUrl && (
        <div
          className="bg-contain bg-no-repeat bg-center rounded-full h-40 w-40 border"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
      )}

      {!imageUrl && (
        <div className="rounded-full h-40 w-40 border text-center flex justify-center items-center">
          Not Set
        </div>
      )}

      <Uploader
        multiple={true}
        accept={'image/*'}
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
        afterUpload={(uploadedFiles) => {
          if (uploadedFiles.length > 0) {
            onUploaded(uploadedFiles[0]['uuid']);
          }
        }}
        beforeUpload={(uploadedFiles) => {
          // logger('files to be uploaded', uploadedFiles);
        }}
      />
    </div>
  );
};

export default ProfilePicture;
