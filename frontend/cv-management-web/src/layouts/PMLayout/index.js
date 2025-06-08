import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';
import useAuthGuard from '../../utils/UseAuthGuard';

import { Outlet } from 'react-router-dom';

import './PMLayout.css';

const PMLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    useAuthGuard(['Project Manager']);

    return (
        <div className="pm-layout">
            <Header />

            <MenuBar role='pm' />

            <div className="pm-content">
                <div className="pm-greeting">
                    <p>Xin chào: {user?.first_name}</p>
                </div>
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default PMLayout;