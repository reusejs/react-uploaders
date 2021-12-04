import React, { useState, useRef, useCallback } from "react";
import { BASE_URL, ACCESS_TOKEN, ID_TOKEN } from "../../../config";
import Base from "./index";

export default {
  title: "Uploader/Base",
  component: Base,
};

const Template = (args) => {
  const baseRef = useRef();
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState(null);
  const uploadFiles = useCallback(async (payload) => {
    if (payload.length > 1) {
      await Promise.all(
        payload.map(async (_payload) => {
          let formData = new FormData();

          formData.append("file", _payload.file);

          let url = `${BASE_URL}/files/upload`;
          setBusy(true);
          try {
            console.log("in try block");
            const response = await fetch(url, {
              method: "POST",
              headers: {
                AccessToken: `${ACCESS_TOKEN}`,
                IdToken: `${ID_TOKEN}`,
              },
              body: formData,
            });
            const data = await response.json();
            setBusy(false);
            return data;
          } catch (error) {
            setBusy(false);
            return error;
          }
        })
      );
    } else {
      let formData = new FormData();

      formData.append("file", payload[0].file);

      let url = `${BASE_URL}/files/upload`;
      setBusy(true);
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
        setBusy(false);
        setText("Upload done");
        return data;
      } catch (error) {
        setBusy(false);
        return error;
      }
    }
  }, []);
  return (
    <div className="w-64 flex flex-col gap-y-2">
      <Base
        {...args}
        ref={baseRef}
        uploadFiles={(e) => uploadFiles(e)}
        busy={busy}
      />
      {text ? <p>{text}</p> : <br />}

      <button onClick={() => baseRef.current.triggerUpload()}>Upload</button>
    </div>
  );
};

export const Default = Template.bind({});

Default.args = {
  multiple: false,
  afterUpload: () => { },
  beforeUpload: () => { },
  openFileUploader: () => { },
  uploadFiles: () => { },
  autoUpload: false,
  busy: false,
};
0;
