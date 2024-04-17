import { defaultSecurityTemplate } from '@email-templates/default-security.template';
import { SecurityPayloadInterface } from '@interfaces/security-payload.interface';

export const forgotPasswordTemplate = ({
  userInfo,
  link
}: SecurityPayloadInterface) => {
  const title = `Hello, ${userInfo.firstName} ${userInfo.lastName}!`;
  const content =
    'In order to reset your password, please, click the button below. You will have to provide not only the new password, but also confirm the change using MFA. Link will be valid for 24h.';
  const button = 'Reset password';

  return defaultSecurityTemplate({
    title,
    content,
    button,
    link
  });
};
