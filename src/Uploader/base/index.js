import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { uploadFile, user } from '@frontend/services';

const UploaderBase = function ({
  multiple = false,
  afterUpload = () => {},
  beforeUpload = () => {},
  openFileUploader,
  autoUpload = true,
  accept = '*',
  fwdref,
  ...props
}) {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useImperativeHandle(fwdref, () => ({
    triggerUpload: async () => {
      await uploadFiles(files);
    },
  }));

  const uploadFiles = async (filesToUpload) => {
    beforeUpload(filesToUpload);
    setBusy(true);

    try {
      let uploadedFiles = await Promise.all(
        filesToUpload.map(async (f) => {
          let result = await uploadFile(f.file);
          return result;
        })
      );

      setBusy(false);
      afterUpload(uploadedFiles);
    } catch (error) {
      setBusy(false);
      console.log('Error', error);
    }
  };

  const fileListToArray = (list) => {
    const filesList = [];

    for (var i = 0; i < list.length; i++) {
      let fileItem = {
        file: list.item(i),
        uploaded: null,
      };
      filesList.push(fileItem);
    }
    return filesList;
  };

  const onFilesAdded = async (evt) => {
    const addedFiles = fileListToArray(evt.target.files);
    await setFiles(addedFiles);
    beforeUpload(addedFiles);
    try {
      if (autoUpload) {
        await uploadFiles(addedFiles);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  return (
    <div>
      {!busy && (
        <>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => {
              onFilesAdded(e);
            }}
          />
          {openFileUploader(() => {
            fileInputRef.current.click();
          })}
        </>
      )}

      {busy && (
        <span className="relative inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-purple-400 text-base leading-6 font-medium rounded-md text-purple-800 bg-white hover:text-purple-700 focus:border-purple-300 transition ease-in-out duration-150"
          >
            Uploading...
          </button>
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500" />
          </span>
        </span>
      )}
    </div>
  );
};

export default UploaderBase;
