import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import fetchWithAuth from '../../../utils/FetchWithAuth';
import EmployeesList from '../../../components/EmployeesList';
import SearchBar from '../../../components/SearchBar';

const API = "http://127.0.0.1:8000";

const StaffEmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const filteredEmployees = employees.filter(emp => 
        (emp.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.last_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetchWithAuth(`${API}/staff/employeeslist`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách nhân viên!');
                }

                const data = await response.json();
                setEmployees(data.employees);
            }
            catch (err) {
                setError(err.message);
            } 
            finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleRowClick = (emp) => {
        navigate(`cv/${emp.emp_id}`, { state: { emp } });
    };

    if (loading) {
        return <p>Thông tin nhân viên</p>
    }
    if (error) {
        return <p>Lỗi: {error}</p>
    }

    return (
        <div>
            <SearchBar onSearch={setSearchTerm} />

            <EmployeesList
                employees={filteredEmployees}
                title="Danh sách nhân viên"
                onRowClick={handleRowClick}
            />

            <Outlet />
        </div>
    );
};

export default StaffEmployeesList;