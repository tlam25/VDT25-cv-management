import './EmployeesList.css';
import { FaEye } from "react-icons/fa";

const EmployeesList = ({ employees, title, onRowClick }) => {
    return (
        <div className="employees-list">
            <h2>{title}</h2>

            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Mã nhân viên</th>
                        <th>Chức vụ</th>
                        <th>Phòng ban</th>
                        <th>Email</th>
                        <th>CV</th>
                    </tr>
                </thead>

                <tbody>
                    {employees.map((emp, idx) => (
                        <tr
                            key={emp.emp_id}
                        >
                            <td>{idx + 1}</td>
                            <td>{emp.fullname}</td>
                            <td>{emp.emp_id}</td>
                            <td>{Array.isArray(emp.roles) ? emp.roles.join(', ') : emp.roles}</td>
                            <td>{emp.department}</td>
                            <td>{emp.email}</td>
                            <td>
                                <span 
                                    onClick = {() => onRowClick && onRowClick(emp)}
                                    style={{ cursor: onRowClick ? 'pointer' : 'default', color: '#e71039' }}
                                >
                                    <FaEye className="view-icon" /> 
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeesList;