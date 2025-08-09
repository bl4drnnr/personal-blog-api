import { baseEmailTemplate } from './shared/base-template';
import { ContactReplyInterface } from '@interfaces/contact-reply.interface';
import * as dayjs from 'dayjs';

export const contactReplyTemplate = ({
  userMessage,
  reply
}: ContactReplyInterface) => {
  const formattedDate = dayjs(userMessage.createdAt).format(
    'MMMM DD, YYYY [at] h:mm A'
  );

  const content = `
    <!-- Reply Content -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:24px 30px 24px 30px; line-height:26px; text-align:inherit; background-color:#ffffff; border-radius: 8px;" height="100%" valign="top" bgcolor="#ffffff" role="module-content">
                    <div>
                        <div style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; text-align: inherit">
                            <span style="color: #1a1a1a; font-size: 16px; line-height: 1.6; font-weight: 400;">${reply}</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Divider -->
    <table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:20px 30px 20px 30px;" role="module-content" height="100%" valign="top" bgcolor="#fff">
                    <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="2px" style="line-height:1px; font-size:1px;">
                        <tbody>
                            <tr>
                                <td style="padding:0px 0px 2px 0px; background: linear-gradient(90deg, #ffc94c 0%, #ffb347 100%);" bgcolor="#ffc94c"></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Original Message Section -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:20px 30px 8px 30px; line-height:24px; text-align:inherit; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; text-align: inherit">
                            <span style="color: #4a5568; font-size: 15px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Original Message</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Original Message Metadata -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:12px 30px 12px 30px; line-height:24px; text-align:inherit; background-color:#f8fafc; border-left: 4px solid #ffc94c; border-radius: 6px 0 0 0;" height="100%" valign="top" role="module-content">
                    <div>
                        <div style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; text-align: inherit">
                            <span style="color: #4a5568; font-size: 14px; line-height: 1.5;">
                                <strong style="color: #2d3748; font-weight: 600;">From:</strong> ${userMessage.name} <span style="color: #718096;">(${userMessage.email})</span><br>
                                <strong style="color: #2d3748; font-weight: 600;">Date:</strong> <span style="color: #718096;">${formattedDate}</span>
                            </span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Original Message Content -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:16px 30px 20px 30px; line-height:26px; text-align:inherit; background-color:#f8fafc; border-left: 4px solid #ffc94c; border-radius: 0 0 6px 0;" height="100%" valign="top" role="module-content">
                    <div>
                        <div style="font-family: 'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; text-align: inherit">
                            <span style="color: #2d3748; font-size: 15px; font-style: italic; line-height: 1.6; font-weight: 400;">"${userMessage.message}"</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  `;

  return baseEmailTemplate({
    title: 'Thank you for contacting us!',
    content
  });
};
