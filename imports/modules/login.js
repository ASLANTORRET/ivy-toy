import $ from 'jquery';
import 'jquery-validation';
import { browserHistory } from 'react-router';
import { Meteor } from 'meteor/meteor';

import { getInputValue } from './get-input-value';

let component;

const login = () => {
  const email = getInputValue(component.refs.emailAddress);
  const password = getInputValue(component.refs.password);

  Meteor.loginWithPassword(email, password, (error) => {
    if (error) {
      Materialize.toast(error.reason, 4000);
    } else {
      Materialize.toast('Logged in!', 4000);
      const { location } = component.props;
      const afterLogin = Session.get('afterLogin');
      if (afterLogin) {
        Session.set('afterLogin', false);
        browserHistory.push(afterLogin);
      } else if (location.state && location.state.nextPathname) {
        browserHistory.push(location.state.nextPathname);
      } else {
        browserHistory.push('/');
      }
    }
  });
};

const validate = () => {
  $(component.refs.login).validate({
    rules: {
      emailAddress: {
        required: true,
        email: true,
      },
      password: {
        required: true,
      },
    },
    messages: {
      emailAddress: {
        required: 'Укажите E-mail адрес.',
        email: 'Неверный формат E-mail адреса',
      },
      password: {
        required: 'Укажите пароль.',
      },
    },
    submitHandler() { login(); },
  });
};

export const handleLogin = (options) => {
  component = options.component;
  validate();
};
