import React from 'react';
import { handleResetPassword } from '../../modules/reset-password';

export class ResetPassword extends React.Component {
  componentDidMount() {
    handleResetPassword({
      component: this,
      token: this.props.params.token,
    });
    document.title = "Сброс пароля";
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return <div>
      <div>
        <h5 className="page-header">Сброс пароля</h5>
        <div bsStyle="info">
          Введите новый пароль. Вы будете сразу залогинены с новым паролем.
        </div>
        <form ref="resetPassword" className="reset-password" onSubmit={ this.handleSubmit }>
          <div>
            <label>Новый пароль</label>
            <input
              type="password"
              ref="newPassword"
              name="newPassword"
              placeholder="Новый пароль"
            />
          </div>
          <div>
            <label>Повторите новый пароль</label>
            <input
              type="password"
              ref="repeatNewPassword"
              name="repeatNewPassword"
              placeholder="Повторите новый пароль"
            />
          </div>
          <button type="submit" className="btn waves-effect waves-light btn-width100">Сбросить пароль &amp; Залогиниться</button>
        </form>
      </div>
    </div>;
  }
}

ResetPassword.propTypes = {
  params: React.PropTypes.object,
};
