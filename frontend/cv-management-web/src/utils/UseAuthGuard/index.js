import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const normalizeRoleName = (role) => {
    return role
        .toLowerCase()
        .replace(/\s+/g, '') // "Project Manager" -> "projectmanager"
        .replace('projectmanager', 'pm')
        .replace('leader', 'lead');
};

const useAuthGuard = (rolesAllowed = []) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (!accessToken || !user) {
            alert("Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại.");
            navigate('/', { replace: true });
            return;
        }

        const pathFirstSegment = location.pathname.split('/').filter(Boolean)[0] || '';
        const userPathRoles = (user.roles || []).map(normalizeRoleName);

        const acceptedRoles = rolesAllowed.length > 0
            ? rolesAllowed.map(normalizeRoleName)
            : userPathRoles;

        // nếu user là admin thì chỉ được vào /admin, staff thì chỉ được vào /staff, pm hoặc lead mà có 2 roles thì có thể vào cả 2
        // không thì về lại login hết
        if (!userPathRoles.includes(pathFirstSegment)) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            alert("Bạn không có quyền truy cập vào trang này!");
            navigate('/', { replace: true });
            return;
        } 

        // chỉ cho phép truy cập nếu segment đầu trùng với 1 role hợp lệ
        // vd: locahost:3000/rusfkjsskw thì về lại login
        const isRoleMatch = acceptedRoles.includes(pathFirstSegment);

        if (!isRoleMatch) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            alert("Không tồn tại trang này hoặc bạn không có quyền truy cập!");
            navigate('/', { replace: true });
            return;
        }
    }, [navigate, rolesAllowed, location]);
};

export default useAuthGuard;