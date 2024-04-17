import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const registrationTemplate = ({
  userInfo,
  link
}: SecurityPayloadInterface) => {
  const title = `Welcome, ${userInfo.firstName} ${userInfo.lastName}!`;
  const content =
    'Thank you for choosing to be the part of our community. Click on the link below to complete registration and set up your profile, as well as configure your security settings and recovery keys.';
  const button = 'Complete registration';

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
