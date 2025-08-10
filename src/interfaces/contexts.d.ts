interface RegisterAdminContext {
  navigateOtpSection: () => void;
  navigateDetailsSection: () => void;
  navigatePasswordSection: () => void;
  registerPayload: React.MutableRefObject<RegisterAdminPayload>;
}

interface RegisterUserContext {
  navigateOtpSection: () => void;
  navigateCardSection: () => void;
  navigateDetailsSection: () => void;
  navigatePasswordSection: () => void;
  registerPayload: React.MutableRefObject<RegisterUserPayload>;
}
