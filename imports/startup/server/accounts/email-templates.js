import { Accounts } from 'meteor/accounts-base';

const name = 'Mimimishki.kz';
const email = 'mimimishki.kz@yandex.com';
const from = `${name} ${email}`;
const emailTemplates = Accounts.emailTemplates;

emailTemplates.siteName = name;
emailTemplates.from = from;

emailTemplates.resetPassword = {
  subject() {
    return `[${name}] Сброс пароля`;
  },
  text(user, url) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace('#/', '');

    return `Вы запросили восстановление пароля по адресу (${userEmail}).
    Для сброса пароля перейдите по следующей ссылке:
    \n\n${urlWithoutHash}\n\n
    Если вы не запрашивали восстановление пароля, проигнорируйте это сообщение.
    Если у вас есть какие-либо вопросы, свяжитесь с нами по адресу:${email}.`;
  },
};
Accounts.emailTemplates.verifyEmail = {
  subject() {
    return `[${name}] Подтверждение E-mail адреса`;
  },
  text( user, url ) {
    const userEmail = user.emails[0].address;
    const urlWithoutHash = url.replace( '#/', '' );

    return `Для подтверждения вашего E-mail адреса (${userEmail}) перейтиде по ссылке:
    \n\n${urlWithoutHash}\n\n
    Если у вас есть какие-либо вопросы, свяжитесь с нами по адресу:
    ${email}.`;;
  }
};
