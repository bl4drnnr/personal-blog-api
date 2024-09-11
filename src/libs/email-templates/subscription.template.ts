import { defaultSubscriptionTemplate } from '@email-templates/subscription/default-subscription.template';
import { Language } from '@interfaces/language.enum';
import { NewslettersSubscriptionPayloadInterface } from '@interfaces/newsletters-subscription-payload.interface';

export const subscriptionTemplate = ({
  link,
  language
}: NewslettersSubscriptionPayloadInterface) => {
  let title: string;
  let content: string;
  let button: string;

  switch (language) {
    case Language.EN:
      title = 'Confirm newsletters subscription';
      content =
        'Thank you so much for singing up for newsletters subscription! I will try to post interesting content as often as it is possible. In case if you do not want to get any emails anymore, feel free to hit the "Unsubscribe" button at the bottom of the email that you get as the subscriber.';
      button = 'Confirm';
      break;
    case Language.RU:
      title = 'Подтвердите подписку на рассылку';
      content =
        'Большое спасибо за подписку на рассылку! Я постараюсь публиковать интересный контент так часто, как это возможно. Если вы больше не хотите получать письма, смело нажимайте кнопку «Отписаться» в нижней части письма, которое вы получите как подписчик.';
      button = 'Подтвердить';
      break;
    case Language.PL:
      title = 'Potwierdź subskrypcję newsletterów';
      content =
        'Dziękuję bardzo za zapisanie się na subskrypcję newsletterów! Postaram się zamieszczać ciekawe treści tak często, jak to możliwe. Jeśli nie chcesz już otrzymywać żadnych wiadomości e-mail, możesz nacisnąć przycisk „Anuluj subskrypcję” na dole wiadomości e-mail, którą otrzymasz jako subskrybent.';
      button = 'Potwierdź';
      break;
    default:
      title = 'Confirm newsletters subscription';
      content =
        'Thank you so much for singing up for newsletters subscription! I will try to post interesting content as often as it is possible. In case if you do not want to get any emails anymore, feel free to hit the "Unsubscribe" button at the bottom of the email that you get as the subscriber.';
      button = 'Confirm';
      break;
  }

  return defaultSubscriptionTemplate({
    title,
    content,
    button,
    link
  });
};
