export const addClass = (element?: HTMLElement | null, ...classes: string[]) => {
  element?.classList.add(...classes);
};

export const removeClass = (element?: HTMLElement | null, ...classes: string[]) => {
  element?.classList.remove(...classes);
};

export const toggleClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.toggle(className));
};

export const showAlert = ({
  msg,
  bgColor,
  textColor,
  zIndex = '0',
  duration = 3000,
}: AlertProps) => {
  const alertDiv: HTMLDivElement = document.createElement('div');
  alertDiv.className = 'alert';
  addClass(
    alertDiv,
    'p-4',
    'mb-8',
    'fixed',
    'w-max',
    'left-1/2',
    'z-[9999]',
    'text-base',
    'shadow-lg',
    'rounded-md',
    'text-white',
    'ease-in-out',
    'text-center',
    'max-w-[80vw]',
    'duration-500',
    'font-semibold',
    'bg-primary-500',
    'transition-all',
    '-translate-x-1/2',
    'tracking-[0.04em]'
  );

  alertDiv.style.bottom = '-150px';
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    if (bgColor) alertDiv.style.background = bgColor;
    if (textColor) alertDiv.style.color = textColor;
    alertDiv.innerHTML = msg;
    alertDiv.style.bottom = '0px';

    if (zIndex !== '0') alertDiv.style.zIndex = zIndex;

    setTimeout(() => {
      alertDiv.style.bottom = '-150px';
      setTimeout(() => document.body.removeChild(alertDiv), 1000);
    }, duration);
  }, 200);
};

export const secondsToMMSS = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
};

export const convertToUTC = (localDateTimeStr: string): string => {
  // Create a Date object using the local time
  const localDate = new Date(localDateTimeStr);

  // Convert to ISO string and slice to remove milliseconds and 'Z'
  const utcString = localDate.toISOString().split('.')[0];

  return utcString;
};

export const updateFormData = (formData: FormData) => {
  return ([field, value]: [string, any]) => {
    const isPrimitive = typeof value === 'string' || value instanceof Blob;
    formData.append(field, isPrimitive ? value : JSON.stringify(value));
  };
};

export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
