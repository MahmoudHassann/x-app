import { toast } from "react-toastify";

const toastOptions = {
  position: "bottom-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

let lastToast = { type: null, message: null, timestamp: 0 };

const isDuplicateToast = (type, message) => {
  const now = Date.now();
  if (
    lastToast.type === type &&
    lastToast.message === message &&
    now - lastToast.timestamp < 1500
  ) {
    return true;
  }
  lastToast = { type, message, timestamp: now };
  return false;
};

export const notifySuccess = (message) => {
  if (!isDuplicateToast("success", message)) {
    toast.success(message, toastOptions);
  }
};

export const notifyError = (message) => {
  if (!isDuplicateToast("error", message)) {
    toast.error(message, toastOptions);
  }
};
export const notifyWarning = (message) => {
  if (!isDuplicateToast("warn", message)) {
    toast.warn(message, toastOptions);
  }
};
