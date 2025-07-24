import { defaultSubscriptionTemplate } from '@email-templates/subscription/default-subscription.template';

export const subscriptionTemplate = ({ link }: { link: string }) => {
  const title = 'Confirm newsletters subscription';
  const content =
    'Thank you so much for signing up for newsletters subscription! I will try to post interesting content as often as possible. In case you do not want to get any emails anymore, feel free to hit the "Unsubscribe" button at the bottom of the email that you get as the subscriber.';
  const button = 'Confirm';

  return defaultSubscriptionTemplate({
    title,
    content,
    button,
    link
  });
};
