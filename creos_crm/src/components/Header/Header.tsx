import './Header.css'

import { Link } from 'react-router-dom'

function Header() {
    return(
        <header className='header'>
            <div className="container header__container">
                <a className='logo' href="#">
                    <img className='logo__icon' src="/images/logo.png" alt="logo" />
                </a>
                <nav className='nav header__nav'>
                    <ul className='nav__list list-reset'>
                        <li><Link to='/' className='nav__link'>Главная</Link></li>
                        <li><Link to='/diagrams' className='nav__link'>Диаграммы</Link></li>
                        <li><Link to='/designers' className='nav__link'>Дизайнеры</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header