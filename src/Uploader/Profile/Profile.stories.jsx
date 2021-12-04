import React, { useState, useRef } from "react";
import { BASE_URL, ACCESS_TOKEN, ID_TOKEN } from "../../../config";

import Profile from "./index";

export default {
  title: "Uploader/Profile",
  component: Profile,
};

const Template = (args) => {
  const uploadFiles = async (payload) => {
    if (payload.length > 1) {
      await Promise.all(
        payload.map(async (_payload) => {
          let formData = new FormData();

          formData.append("file", _payload.file);

          let url = `${BASE_URL}/files/upload`;

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
            return data;
          } catch (error) {
            return error;
          }
        })
      );
    } else {
      let formData = new FormData();

      formData.append("file", payload[0].file);

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
    }
  };
  return (
    <div className="w-64">
      <Profile {...args} uploadFiles={(e) => uploadFiles(e)} />
    </div>
  );
};

export const ProfileBase = Template.bind({});

ProfileBase.args = {
  uploadFiles: () => {},
};
