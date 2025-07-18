import { toast, type ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warn';

export const showToast = (
  message: string,
  type: ToastType = 'success',
  options: ToastOptions = {}
) => {
  const toastMap = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warn: toast.warn,
  } as const;

  toastMap[type](message, {
    position: 'top-right',
    autoClose: 3000,
    pauseOnHover: true,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
    theme: 'colored',
    ...options,
  });
};
