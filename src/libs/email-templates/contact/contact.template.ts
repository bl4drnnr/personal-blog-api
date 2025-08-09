import { ContactEmailInterface } from '@interfaces/contact-email.interface';
import { baseEmailTemplate } from './shared/base-template';

export const contactTemplate = ({ message, name, email }: ContactEmailInterface) => {
  const content = `
    <!-- Sender Information -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: inherit; text-align: inherit">
                            <span style="color: #000; font-size: 15px"><strong>From:</strong> ${name} (${email})</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Message Content -->
    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
        <tbody>
            <tr>
                <td style="padding:18px 30px 18px 30px; line-height:22px; text-align:inherit; background-color:#fff;" height="100%" valign="top" bgcolor="#fff" role="module-content">
                    <div>
                        <div style="font-family: inherit; text-align: inherit">
                            <span style="color: #000; font-size: 15px">${message}</span>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  `;

  return baseEmailTemplate({
    title: 'New Contact Message',
    content
  });
};
