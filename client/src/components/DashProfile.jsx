import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput, Button, Alert } from "flowbite-react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../redux/user/userSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(0);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();
  const dispatch = useDispatch();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.entries(formData).length < 1) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for the image to be uploaded");
      return;
    }

    try {
      dispatch(updateStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  function uploadFile() {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File size might be more than 2 mb)"
        );
        setImageFile(null);
        setImageFileUploadingProgress(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadableUrl) => {
          setImageFileUrl(downloadableUrl);
          setImageFileUploading(false);
          setImageFileUploadingProgress(null);
          setFormData({ ...formData, profilePicture: downloadableUrl });
        });
      }
    );
  }

  useEffect(() => {
    if (imageFile) {
      uploadFile();
    }
  }, [imageFile]);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="text-3xl my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
        />
        <div className="w-32 h-32 relative rounded-full self-center shadow-md overflow-hidden">
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress}
              text={`${imageFileUploadingProgress}% `}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${
                    imageFileUploadingProgress / 100
                  })`,
                },
                text: {
                  fill: "black",
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="Profile Picture"
            className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover cursor-pointer ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
            onClick={() => filePickerRef.current.click()}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          onChange={handleFormDataChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser?.email}
          onChange={handleFormDataChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Password"
          onChange={handleFormDataChange}
        />

        <Button type="submit" outline gradientDuoTone="purpleToBlue">
          Update
        </Button>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer">Delete Account</span>
          <span className="text-red-500 cursor-pointer">Sign Out</span>
        </div>
        {updateUserSuccess && (
          <Alert color={"success"}>{updateUserSuccess}</Alert>
        )}
        {updateUserError && <Alert color={"failure"}>{updateUserError}</Alert>}
      </form>
    </div>
  );
}
