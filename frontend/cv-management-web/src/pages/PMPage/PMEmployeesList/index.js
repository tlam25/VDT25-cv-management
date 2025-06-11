import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from "react-router-dom";
import fetchWithAuth from '../../../utils/FetchWithAuth';
import EmployeesList from '../../../components/EmployeesList';
import SearchBar from '../../../components/SearchBar';
import FilterBar from '../../../components/FilterBar';

import './PMEmployeesList.css';

const API = "http://127.0.0.1:8000"

const PMEmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const [employeesWithoutCV, setEmployeesWithoutCV] = useState([]);
    const [showEmployeesWithoutCV, setShowEmployeesWithoutCV] = useState(false);

    const filteredEmployees = (showEmployeesWithoutCV ? employeesWithoutCV : employees).filter(emp => {
        const matchSearch =
            (emp.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.first_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.last_name || "").toLowerCase().includes(searchTerm.toLowerCase());

        const matchProject = selectedProject ? (emp.project_ids || []).includes(selectedProject) : true;
        return matchSearch && matchProject;
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetchWithAuth(`${API}/pm/employeeslist`, {
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
                const response = await fetchWithAuth(`${API}/pm/employees_without_cv`, {
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

        const fetchProjects = async () => {
            try {
                const response = await fetchWithAuth(`${API}/pm/projects`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.projects);
                }
            } catch {}
        };

        Promise.all([fetchEmployees(), fetchEmployeesWithoutCV(), fetchProjects()])
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
                <FilterBar
                    projects={projects}
                    selectedProject={selectedProject}
                    onProjectChange={setSelectedProject}
                />

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
                groupByProject={setSelectedProject === ""}
            />

            <Outlet />
        </div>
    );
};

export default PMEmployeesList;