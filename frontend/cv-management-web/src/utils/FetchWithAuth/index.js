const fetchWithAuth = async (url, options = {}) => {
    const accessToken = localStorage.getItem('access_token');
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        // token hết hạn hoặc không hợp lệ: logout & về login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/'; // hoặc navigate('/') nếu đang trong component
        alert('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        return null;
    }
    return response;
};

export default fetchWithAuth;