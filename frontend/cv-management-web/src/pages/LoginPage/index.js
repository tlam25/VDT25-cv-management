import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useState} from 'react';

import { FaUser } from 'react-icons/fa';
import { RiLockPasswordLine } from 'react-icons/ri';

const API = "http://127.0.0.1:8000";

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null); 
    const [selectedRole, setSelectedRole] = useState(''); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // reset error truoc khi submit
        localStorage.removeItem('access_token'); // xoa accessToken cu truoc khi login lai

        try {
            // gui yeu cau dang nhap toi /login
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const loginResponse = await fetch(`${API}/login`, {
                method: 'POST',
                body: formData,
            });

            if (!loginResponse.ok) {
                throw new Error('Đăng nhập thất bại!');
            }

            const loginData = await loginResponse.json();
            const accessToken = loginData.access_token;

            // luu accessToken vao localStorage
            localStorage.setItem('access_token', accessToken);

            // goi toi api /accounts/me de lay thong tin current user
            const userResponse = await fetch(`${API}/accounts/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error('Không thể lấy thông tin người dùng!');
            }

            const userData = await userResponse.json();
            console.log('Current User:', userData);

            localStorage.setItem('user', JSON.stringify(userData));
            setUserData(userData);

            if (userData.roles.length === 1) {
                navigateRole(userData.roles[0]);
            }
        } catch (err) {
            setError('Tên người dùng hoặc mật khẩu không đúng!');
            console.error(err);
        }
    };

    const handleRoleSelect = (e) => {
        setSelectedRole(e.target.value);
    };

    const handleRoleSubmit = () => {
        if (selectedRole) {
            navigateRole(selectedRole);
        } else {
            setError('Vui lòng chọn vai trò!');
        }
    };

    const navigateRole = (role) => {
        switch (role) {
            case 'Admin':
                navigate('/admin');
                break;
            case 'Project Manager':
                navigate('/pm');
                break;
            case 'Leader':
                navigate('/lead');
                break;
            case 'Staff':
                navigate('/staff');
                break;
            default:
                setError('Vai trò không hợp lệ!');
        }
    };



    return (
        <div className="login-body">
            <div className="login-container">
                <div className="login-header">
                    <div className="welcome-text">Chào mừng tới</div>
                    <div className="text">Hệ thống Quản lý CV Nhân sự!</div>
                    <div className="underline"></div>
                </div>
                
                <div className="login-form">
                    {userData ? (
                        <div className="role-selection">
                            <h3>Chọn vai trò của bạn trước khi vào hệ thống:</h3>
                            <select value={selectedRole} onChange={handleRoleSelect}>
                                <option value="" disabled>Chọn vai trò</option>
                                {userData.roles.map((role, index) => (
                                    <option key={index} value={role}>{role}</option>
                                ))}
                            </select>
                            <button onClick={handleRoleSubmit} className="login-button">Xác nhận</button>
                            {error && <p>{error}</p>}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Tên người dùng</label>
                                <div className="icon-input">
                                    <FaUser />
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Nhập tên đăng nhập"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="icon-input">
                                    <RiLockPasswordLine />
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="submit-container">
                                <button type="submit" className="login-button">Đăng nhập</button>
                            </div>
                        </form>
                    )}
                    
                    {error && !userData && <p>{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;