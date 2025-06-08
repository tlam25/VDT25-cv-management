import './Footer.css';
import logo from '../../assets/logo-vtit.png';

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                        <img src={logo} alt="VTIT Logo" className="logo-image" />
                    </div>

                <div className="footer-contact">
                    <h2>Liên hệ</h2>
                    <div className = "contact-list">
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <a href="https://maps.app.goo.gl/rRPsxYZfu9sD9hfq6">36A Địch Vọng Hậu, Cầu Giấy, Hà Nội</a>
                        </div>
                        <div className="contact-item">
                            <FaPhoneAlt className="contact-icon" />
                            <a href="tel:+84988889446">+84 988889446</a>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <a href="mailto:contact@viettelsoftware.com">contact@viettelsoftware.com</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;