import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';

const LoginLayout = () => {
    return (
        <div>
            <Header />
            {/* danh cho route child cua LoginLayout (LoginPage) */}
            <>
                <Outlet /> 
            </> 
        </div>
    );
};

export default LoginLayout;