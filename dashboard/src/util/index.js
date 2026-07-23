import axios from "axios";
import profileFallback from "../assets/profile.png";

export const API_URI = process.env.REACT_APP_API_URL;

// Default avatar shown when a user/profile image is missing or fails to load
// (e.g. old dead Firebase URLs). Use both as a src fallback and via onImageError.
export const DEFAULT_AVATAR = profileFallback;
export const onImageError = (e) => {
  e.currentTarget.onerror = null; // prevent loops if the fallback itself fails
  e.currentTarget.src = profileFallback;
};

// Cloudinary (unsigned upload) — replaces Firebase Storage.
// These values are public by design for client-side unsigned uploads.
const CLOUDINARY_CLOUD_NAME = "dolymlrl5";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

export const uploadFile = (setFileURL, file, setIsFileUploaded) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  axios
    .post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = (event.loaded / event.total) * 100;
            setIsFileUploaded(progress);
            console.log("Upload is " + progress + "% done");
          }
        },
      }
    )
    .then((res) => {
      console.log("Successfully uploaded");
      setFileURL(res.data.secure_url);
      setIsFileUploaded(100);
    })
    .catch((error) => {
      console.log(error);
      setIsFileUploaded(0);
    });
};

// Cloudinary can't be securely deleted from the browser (needs a signed,
// server-side request), so this is a no-op. Replaced images simply remain
// in Cloudinary unreferenced.
export const deleteFile = (fileURL) => {
  return Promise.resolve();
};

export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }

  return num.toString();
}

export function getInitials(fullName) {
  const names = fullName.split(" "); //code wave asante

  const initials = names.slice(0, 2).map((name) => name[0].toUpperCase());

  const initialsStr = initials.join("");

  return initialsStr;
}

export function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export const updateURL = ({ page, navigate, location }) => {
  const params = new URLSearchParams();

  if (page && page > 1) {
    params.set("page", page);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
