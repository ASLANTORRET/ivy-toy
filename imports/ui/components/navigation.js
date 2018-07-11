import React from 'react';
import $ from 'jquery';
import { Link, browserHistory } from 'react-router';

export class Navigation extends React.Component {
  // componentDidUpdate() {
  //   $('.button-collapse').sideNav('destroy');
  //   $(".js-button-collapse").sideNav();
  // }
  componentDidMount() {
    $(".js-button-collapse").sideNav();
  }
  componentWillUnmount() {
     $('.js-button-collapse').sideNav('destroy');
  }
  renderMenu ({categories, className, id}) {
    const { onLogout, hasUser } = this.props;
    return <ul className={className} id={id}>
      <li><Link to='/latest'>
        <img src="/images/heart.png" className="heart" />
        Новинки
      </Link></li>
      <li><Link to='/discount'>
        <img src="/images/heart.png" className="heart" />
        Акции и распродажи
      </Link></li>
      {categories.map(category => (
        <li key={category._id}><Link to={`/${category.slug}`}>
          <img src="/images/heart.png" className="heart" />
          {category.name}
        </Link></li>
      ))}
      <li><div className="divider"></div></li>
      <li><Link to='/about'>
        <img src="/images/heart.png" className="heart" />
        О нас
      </Link></li>
      { hasUser ? (<li><a href="#" onClick={()=>{ onLogout() }}>Выйти</a></li>) : ''}
    </ul>
  }
  render () {
    const { categories, showSearch, toggleSearch, onSearch } = this.props;
    return (
      <nav role="navigation">

        { showSearch
          ? <div className="nav-wrapper">
              <form onSubmit={ onSearch }>
                <div className="input-field">
                  <input id="search" type="search" required autoFocus onBlur={()=>{ toggleSearch(false) }} />
                  <label htmlFor="search"><i className="material-icons">search</i></label>
                  <i className="material-icons" onClick={(e) => { toggleSearch(false) }}>close</i>
                </div>
              </form>
            </div>
          : <div className="nav-wrapper padding-left-10">
              <ul className="left">
                <li>
                  <a href="#" onClick={ (event) => { event.preventDefault(); browserHistory.goBack() } } className="left">
                    <i className="material-icons">arrow_back</i>
                  </a>
                </li>
              </ul>
              <Link to="/" id="logo-container" className="brand-logo">
                <img src="/images/logo.png"/>
              </Link>
              {this.renderMenu({categories, className:'left hide-on-med-and-down'})}
              {this.renderMenu({categories, className:'side-nav', id:'nav-mobile'})}
              <ul className="right">
                <li><a href="#" onClick={(e) => {e.preventDefault(); toggleSearch(true) }}>
                  <i className="material-icons">search</i>
                </a></li>
                <li><a href="#" data-activates="nav-mobile" className="js-button-collapse button-collapse">
                  <i className="material-icons">menu</i>
                  {/* <img src="/images/menu.png" className="icon"/> */}
                </a></li>
              </ul>
            </div>
        }
      </nav>
    )
  }
}
