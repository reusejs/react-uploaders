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
    uploadFile = () => {},
    UploadingUI = () => {
      return (
        <div className="mt-3">
          <div>Uploading...</div>
        </div>
      );
    },
    autoUpload = true,
    accept = "*",
    debug = false,
    ...props
  },
  ref
) {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
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
      console.log("Error", error);
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
      console.log("Error", error);
    }
  };

  return (
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

      {!busy &&
        openFileUploader(() => {
          fileInputRef.current.click();
        })}

      {busy && <UploadingUI />}
    </>
  );
});

export default UploaderBase;
