import "./FilterBar.css";

const FilterBar = ({
    departments = [],
    selectedDepartment = "",
    onDepartmentChange,
    projects = [],
    selectedProject = "",
    onProjectChange,
}) => {
    return (
    <div className="filter-bar-container">
        {/* lọc phòng ban */}
        {departments.length > 0 && (
        <select
            className="filter-select"
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange && onDepartmentChange(e.target.value)}
        >
            <option value="">Tất cả phòng ban</option>
            {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_name}>
                    {dept.dept_name}
                </option>
            ))}
        </select>
        )}

        {/* lọc project */}
        {projects.length > 0 && (
        <select
            className="filter-select"
            value={selectedProject}
            onChange={(e) => onProjectChange && onProjectChange(e.target.value)}
        >
            <option value="">Tất cả project bạn quản lý</option>
            {projects.map((project) => (
                <option key={project.proj_id} value={project.proj_id}>
                    {project.proj_name}
                </option>
            ))}
        </select>
        )}
    </div>
    );
};

export default FilterBar;