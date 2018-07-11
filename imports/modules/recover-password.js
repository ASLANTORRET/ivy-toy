import $ from 'jquery';
import 'jquery-validation';
import { Accounts } from 'meteor/accounts-base';

import { getInputValue } from './get-input-value';

let component;

const handleRecovery = () => {
  Accounts.forgotPassword({
    email: getInputValue(component.refs.emailAddress),
  }, (error) => {
    if (error) {
      Materialize.toast(error.reason, 4000);
    } else {
      Materialize.toast('Check your inbox for a reset link!', 4000);
    }
  });
};

const validate = () => {
  $(component.refs.recoverPassword).validate({
    rules: {
      emailAddress: {
        required: true,
        email: true,
      },
    },
    messages: {
      emailAddress: {
        required: 'Укажите E-mail адрес.',
        email: 'Неверный формат E-mail адреса',
      },
    },
    submitHandler() { handleRecovery(); },
  });
};

export const handleRecoverPassword = (options) => {
  component = options.component;
  validate();
};
