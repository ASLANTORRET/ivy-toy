import React from 'react';
import { handleRecoverPassword } from '../../modules/recover-password';

export class RecoverPassword extends React.Component {
  componentDidMount() {
    handleRecoverPassword({ component: this });
    document.title = "Восстановление пароля";
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return <div>
      <div>
        <h5 className="page-header">Восстановление пароля</h5>
          Введите ваш E-mail адрес для получения ссылки на восстановление пароля.
        <form ref="recoverPassword" className="recover-password" onSubmit={ this.handleSubmit }>
            <input
              type="email"
              ref="emailAddress"
              name="emailAddress"
              placeholder="Email Address"
            />
          <button type="submit" className="btn waves-effect waves-light btn-width100">Восстановить пароль</button>
        </form>
      </div>
    </div>;
  }
}
