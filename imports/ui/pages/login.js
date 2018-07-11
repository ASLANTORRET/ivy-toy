import React from 'react';
import { Link } from 'react-router';
import { handleLogin } from '../../modules/login';

export class Login extends React.Component {
  componentDidMount() {
    handleLogin({ component: this });
    document.title = "Войти";
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return <div>
      <div>
        <h5 className="page-header">Войти</h5>
        <form ref="login" className="login" onSubmit={ this.handleSubmit }>
          <div className="input-field">
            <input
              type="email"
              id="emailAddress"
              ref="emailAddress"
              name="emailAddress"
              placeholder="Email Address"
              className="validate"
            />
            {/* <label htmlFor="emailAddress">E-mail</label> */}
          </div>

          <div className="input-field">
            {/* <span className="pull-left">Пароль</span> */}
              <Link className="right" to="/recover-password">Забыли пароль?</Link>
            <input
              id="password"
              type="password"
              ref="password"
              name="password"
              placeholder="Пароль"
            />
            {/* <label htmlFor="password">Пароль</label> */}
          </div>
          <button type="submit" className="btn waves-effect waves-light btn-width100">Залогиниться</button>
        </form>
        <p>Ещё не регистрировались? <Link to="/signup">Зарегистрироваться</Link>.</p>
      </div>
    </div>;
  }
}
