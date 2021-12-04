import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import "../tailwind.css";

const UploaderBase = forwardRef(function (
  {
    multiple = false,
    afterUpload = () => {},
    beforeUpload = () => {},
    openFileUploader = () => {},
    uploadFiles = () => {},
    autoUpload = true,
    busy = false,
    accept = "*",
    ...props
  },
  ref
) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  // const [uploadedFiles, setUploadedFiles] = useState([]);

  useImperativeHandle(ref, () => ({
    triggerUpload: async () => {
      await uploadFiles(files);
    },
  }));

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
    setFiles(addedFiles);
    try {
      if (autoUpload) {
        const results = await uploadFiles(addedFiles);
        afterUpload(results);
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <div>
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
      </div>
      <div className="mt-3">{busy && <div>Uploading...</div>}</div>
    </>
  );
});

export default UploaderBase;
