import './Header.css';
import logo from '../../assets/logo-vtit.png';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src={logo} alt="VTIT Logo" className="logo-image" />
                </div>

                <nav className="nav">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/">About</a></li>
                        <li><a href="/">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;