import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';
import useAuthGuard from '../../utils/UseAuthGuard';

import './AdminLayout.css'; 

import { Outlet } from 'react-router-dom';

const AdminLayout = ({}) => {
    const user = JSON.parse(localStorage.getItem('user'));
    useAuthGuard(['Admin']);

    return (
        <div className="admin-layout">
            <Header />

            <MenuBar role='admin' />

            <div className="admin-content">
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default AdminLayout;