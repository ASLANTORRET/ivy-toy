import $ from 'jquery';
import 'jquery-validation';
import { browserHistory } from 'react-router';
import { Accounts } from 'meteor/accounts-base';

import { getInputValue } from './get-input-value';

let component;

$.validator.addMethod("phone", function(value, element) {
  // allow any non-whitespace characters as the host part
  return this.optional( element ) || /^[\+]{1}[7]{1}[\(]{1}[0-9]{3}[\)]{1}[ ]{1}[0-9]{3}[\-]{1}[0-9]{4}$/.test( value );
}, 'Введите телефон в формате +7(123)456-78-90');

const getUserData = () => ({
  email: getInputValue(component.refs.emailAddress),
  // phone: getInputValue(component.refs.phone),
  password: getInputValue(component.refs.password),
  profile: {
    name: {
      first: getInputValue(component.refs.firstName),
      last: getInputValue(component.refs.lastName),
    },
    phone: getInputValue(component.refs.phone),
  },
});

const signUp = () => {
  const user = getUserData();

  Accounts.createUser(user, (error, result) => {
    if (error) {
      Materialize.toast(error.reason, 4000);
    } else {
      const afterLogin = Session.get('afterLogin');
      if (afterLogin) {
        Session.set('afterLogin', false);
        browserHistory.push(afterLogin);
      } else {
        Meteor.call( 'sendVerificationLink', ( error, response ) => {
          if ( error ) {
            Materialize.toast( error.reason, 4000 );
          } else {
            browserHistory.push('/');
            Materialize.toast('Добро пожаловать!', 4000);
          }
        });
      }
    }
  });
};

const validate = () => {
  $(component.refs.signup).validate({
    rules: {
      firstName: {
        required: true,
      },
      lastName: {
        required: true,
      },
      phone: {
        required: true,
        // phone: true,
      },
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
        minlength: 6,
      },
    },
    messages: {
      firstName: {
        required: 'Ваше имя?',
      },
      lastName: {
        required: 'Ваша фамилия?',
      },
      phone: {
        required: 'Ваш телефон?',
      },
      emailAddress: {
        required: 'Укажите E-mail.',
        email: 'Вы верно ввели E-mail?',
      },
      password: {
        required: 'Введите пароль.',
        minlength: 'Не менее 6 символов.',
      },
    },
    submitHandler() { signUp(); },
  });
};

export const handleSignup = (options) => {
  component = options.component;
  validate();
};
