import { baseEmailTemplate } from './subscription/shared/base-template';

export const subscriptionTemplate = ({ link }: { link: string }) => {
  const content = `
    <!-- Welcome Message -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:18px 30px 18px 30px; line-height:24px; text-align:center; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: inherit; text-align: center">
                            <span style="color: #000; font-size: 16px">Thank you for subscribing to our newsletter! 🎉</span>
                        </div>
                        <div style="margin-top: 12px;">
                            <span style="color: #666; font-size: 15px">We're excited to share our latest insights, tutorials, and updates with you.</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Instructions -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:center; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: inherit; text-align: center">
                            <span style="color: #000; font-size: 15px">To complete your subscription and start receiving our newsletter, please confirm your email address by clicking the button below:</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Confirmation Button -->
    <table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed;" width="100%">
        <tbody>
            <tr>
                <td align="center" bgcolor="#fff" class="outer-td" style="padding:20px 0px 30px 0px;">
                    <table border="0" cellpadding="0" cellspacing="0" class="wrapper-mobile" style="text-align:center;">
                        <tbody>
                            <tr>
                                <td align="center" bgcolor="#ffc94c" class="inner-td" style="cursor:pointer; border-radius:8px; font-size:16px; text-align:center;">
                                    <a href="${link}" style="cursor:pointer;background-color:#ffc94c; border:1px solid #ffc94c; border-color:#ffc94c; border-radius:8px; border-width:1px; color:#3f4259; display:inline-block; font-size:16px; font-weight:600; letter-spacing:0px; line-height:20px; padding:14px 28px 14px 28px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank">Confirm Subscription</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Additional Information -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:18px 30px 30px 30px; line-height:20px; text-align:center; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: inherit; text-align: center">
                            <span style="color: #666; font-size: 13px">You can unsubscribe at any time by clicking the unsubscribe link in any of our emails.</span>
                        </div>
                        <div style="margin-top: 8px;">
                            <span style="color: #666; font-size: 13px">If you didn't sign up for this newsletter, please ignore this email.</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  `;

  return baseEmailTemplate({
    title: 'Confirm Your Newsletter Subscription',
    content
  });
};
