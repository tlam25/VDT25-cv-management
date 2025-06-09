import './Header.css';
import logo from '../../assets/logo-vtit.png';

const Header = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <img src={logo} alt="VTIT Logo" className="logo-image" />
                </div>
            </div>
        </header>
    );
};

export default Header;