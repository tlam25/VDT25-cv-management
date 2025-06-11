import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import fetchWithAuth from '../../../utils/FetchWithAuth';
import EmployeesList from '../../../components/EmployeesList';

const API = "http://127.0.0.1:8000";

const Me = () => {
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetchWithAuth(`${API}/lead/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy thông tin cá nhân!');
                }

                const data = await response.json();
                setEmployee(data.employee); 
            }
            catch (err) {
                setError(err.message);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, []);

    const handleRowClick = (emp) => {
        navigate(`cv/${emp.emp_id}`, { state: { emp } });
    };

    if (loading) {
        return <p>Đang tải thông tin cá nhân...</p>
    }
    if (error) {
        return <p>Lỗi: {error}</p>
    }

    return (
        <div>
            <EmployeesList
                employees={employee ? [employee] : []}
                title="Thông tin cá nhân"
                onRowClick={handleRowClick}
            />

            <Outlet />
        </div>
    );
};

export default Me;