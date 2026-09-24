let showToastFn;

export const setToastRef = fn => {
  showToastFn = fn;
};

export const showToast = ({
  message,
  duration,
  action,
  placement,
  description,
}) => {
  if (showToastFn) {
    showToastFn({ message, duration, action, placement, description });
  } else {
    console.warn('Toast not initialized yet');
  }
};
