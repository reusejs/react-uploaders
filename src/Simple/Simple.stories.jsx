import React, { useState, useRef } from "react";
import { BASE_URL, ACCESS_TOKEN, ID_TOKEN } from "../../config";
import Uploader from "../Base/index"

export default {
  title: "Uploader/Uploader",
  component: Uploader,
};

const uploadFile = async (file) => {

  let formData = new FormData();

  formData.append("file", file);

  let url = `${BASE_URL}/files/upload`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        AccessToken: `${ACCESS_TOKEN}`,
        IdToken: `${ID_TOKEN}`,
      },
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }

};

const Template = (args) => {

  const fileUploadRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([])

  return (
    <div className="w-64">

      <div className="flex flex-col">
        <Uploader
          ref={fileUploadRef}
          {...args}
          openFileUploader={(triggerClickHandler) => (
            <button
              type="button"
              className="bg-transparent"
              onClick={() => {
                triggerClickHandler();
              }}
            >
              <span className="p-2 bg-blue-600 rounded text-white">
                Select File
              </span>
            </button>
          )}
          uploadFile={(file) => uploadFile(file)}
          beforeUpload={(files) => {
            consol.log("beforeUpload", setSelectedFiles(files));
          }}
          afterUpload={(files) => {
            console.log("AfterUpload", files);
          }}
          UploadingUI={() => {
            return (
              <div className="mt-3 border p-3">
                <div>Uploading File.. Please Wait</div>
              </div>
            );
          }}
        />

        <div className="mt-2">
          <button onClick={() => fileUploadRef.current.triggerUpload()}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export const SingleFile = Template.bind({});

SingleFile.args = {
  debug: true,
  multiple: false,
  accept: "*",
  autoUpload: false
};

export const SingleFileAutoUpload = Template.bind({});

SingleFileAutoUpload.args = {
  debug: true,
  multiple: false,
  accept: "*",
  autoUpload: true
};
