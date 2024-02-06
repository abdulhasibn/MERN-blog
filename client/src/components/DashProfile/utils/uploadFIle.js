import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../firebase";

export function uploadFile(
  setImageFileUploading,
  setImageFileUploadError,
  imageFile,
  setImageFileUploadingProgress,
  setImageFile,
  setImageFileUrl,
  formData,
  setFormData
) {
  setImageFileUploading(true);
  setImageFileUploadError(null);

  const storage = getStorage(app); //locates the storage of our firebase app
  const fileName = new Date().getTime() + imageFile.name; //adding the current time to the file name to make it unique
  const storageRef = ref(storage, fileName);
  const uploadTask = uploadBytesResumable(storageRef, imageFile);

  //When the image file is uploading, we need display the circular progress bar around the image
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
