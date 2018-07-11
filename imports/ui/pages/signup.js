import React from 'react';
import { Link } from 'react-router';
import { handleSignup } from '../../modules/signup';

export class Signup extends React.Component {
  componentDidMount() {
    handleSignup({ component: this });

    document.title = "Регистрация";
    $(".phone").inputmask();
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return <div>
      <h5 className="page-header">Зарегистрироваться</h5>
      <form ref="signup" className="signup" onSubmit={ this.handleSubmit }>
        <div>
          <div>
            <div className="input-field">
              <input
                id="firstName"
                type="text"
                ref="firstName"
                name="firstName"
                placeholder="Ваше имя"
                className="validate"
              />
              {/* <label htmlFor="firstName">Имя</label> */}
            </div>
          </div>
          <div>
            <div className="input-field">
              <input
                type="text"
                id="lastName"
                ref="lastName"
                name="lastName"
                placeholder="Ваша фамилия"
                className="validate"
              />
              {/* <label htmlFor="lastName">Фамилия</label> */}
            </div>
          </div>
        </div>
        <div className="input-field">
          <input
            type="text"
            id="emailAddress"
            ref="emailAddress"
            name="emailAddress"
            placeholder="Адрес E-mail"
            className="validate"
          />
          {/* <label htmlFor="emailAddress">E-mail</label> */}
        </div>
        <div className="input-field">
          <input
            type="tel"
            // className="phone"
            id="phone"
            ref="phone"
            name="phone"
            placeholder="Контактный номер телефона"
            // data-inputmask="'mask': '+7(999)999-99-99'"
            className="validate"
          />
          {/* <label htmlFor="phone">Телефон</label> */}
        </div>
        <div className="input-field">
          <input
            type="password"
            id="password"
            ref="password"
            name="password"
            placeholder="Пароль"
            className="validate"
          />
          {/* <label htmlFor="password">Пароль</label> */}
        </div>
        <button type="submit" className="btn waves-effect waves-light btn-width100">Зарегистрироваться</button>
      </form>
      <p>Уже регистрировались? <Link to="/login">Войти</Link>.</p>
    </div>;
  }
}
