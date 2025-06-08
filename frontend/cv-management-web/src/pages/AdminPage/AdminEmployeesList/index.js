import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import fetchWithAuth from '../../../utils/FetchWithAuth';
import EmployeesList from '../../../components/EmployeesList';
import SearchBar from '../../../components/SearchBar';
import FilterBar from '../../../components/FilterBar';

const API = "http://127.0.0.1:8000";

const AdminEmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const filteredEmployees = employees.filter(emp => {
        const matchSearch =
            (emp.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.last_name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchDept = selectedDepartment ? emp.department === selectedDepartment : true;
        return matchSearch && matchDept;
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetchWithAuth(`${API}/admin/employeeslist`, {
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

        const fetchDepartments = async () => {
            try {
                const response = await fetchWithAuth(`${API}/departments`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDepartments(data.departments); 
                }
            } catch {}
        };


        fetchEmployees();
        fetchDepartments();
    }, []);

    const handleRowClick = (emp) => {
        navigate(`cv/${emp.emp_id}`, { state: { emp } });
    };

    if (loading) {
        return <p>Đang tải danh sách nhân viên...</p>
    }
    if (error) {
        return <p>Lỗi: {error}</p>
    }

    return (
        <div>
            <SearchBar onSearch={setSearchTerm} />
            <FilterBar
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
            />

            <EmployeesList
                employees={filteredEmployees}
                title="Danh sách nhân viên"
                onRowClick={handleRowClick}
                groupByDepartment={selectedDepartment === ""}
            />

            <Outlet />
        </div>
    );
};

export default AdminEmployeesList;