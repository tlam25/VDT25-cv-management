import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import fetchWithAuth from '../../../utils/FetchWithAuth';
import EmployeesList from '../../../components/EmployeesList';
import SearchBar from '../../../components/SearchBar';

const API = "http://127.0.0.1:8000";

const LeaderEmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [employeesWithoutCV, setEmployeesWithoutCV] = useState([]);
    const [showEmployeesWithoutCV, setShowEmployeesWithoutCV] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const filteredEmployees = (showEmployeesWithoutCV ? employeesWithoutCV : employees).filter(emp => 
        (emp.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.last_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetchWithAuth(`${API}/lead/employeeslist`, {
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

        const fetchEmployeesWithoutCV = async () => {
            try {
                const response = await fetchWithAuth(`${API}/lead/employees_without_cv`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách nhân viên chưa có CV!');
                }

                const data = await response.json();
                setEmployeesWithoutCV(data.employees_without_cv);
            } catch (err) {
                setError(err.message);
            }
        };

        Promise.all([fetchEmployees(), fetchEmployeesWithoutCV()])
            .finally(() => setLoading(false));
    }, []);

    const handleRowClick = (emp) => {
        navigate(`cv/${emp.emp_id}`, { state: { emp } });
    };
    const toggleEmployeeList = () => {
        setShowEmployeesWithoutCV(!showEmployeesWithoutCV);
    };

    if (loading) {
        return <p>Đang tải danh sách nhân viên...</p>
    }
    if (error) {
        return <p>Lỗi: {error}</p>
    }

    return (
        <div>
            <div className="filter-container">
                <SearchBar onSearch={setSearchTerm} />

                <button className="toggle-emp-list" onClick={toggleEmployeeList}>
                    {showEmployeesWithoutCV ? "Xem tất cả nhân viên" : "Xem nhân viên chưa có CV"}
                </button>
            </div>

            <p>
                {showEmployeesWithoutCV
                    ? `Số nhân viên chưa có CV: ${filteredEmployees.length}`
                    : `Tổng số nhân viên: ${filteredEmployees.length}`}
            </p>

            <EmployeesList
                employees={filteredEmployees}
                title={showEmployeesWithoutCV ? "Danh sách nhân viên chưa có CV" : "Danh sách nhân viên"}
                onRowClick={handleRowClick}
            />

            <Outlet />
        </div>
    );
};

export default LeaderEmployeesList;