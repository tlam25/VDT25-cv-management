import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchWithAuth from "../../utils/FetchWithAuth";

import { FaTrashAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { LuMessageCirclePlus } from "react-icons/lu";
import { LuMessageCircleX } from "react-icons/lu";

import "./CvDetails.css";

const API = "http://127.0.0.1:8000";

const CvDetails = () => {
    const { emp_id } = useParams();
    const { state } = useLocation();
    const empInfo = state?.emp;
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const [hasCv, setHasCv] = useState(true);

    const [cvExtras, setCvExtras] = useState({
        cv_id: null,
        trainings: [],
        courses: [],
        skills: [],
        summary: "",
        email: "",
        phone: "",
        address: "",
        editor_id: null,
        update_date: null,
        status: null,
    });

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestError, setRequestError] = useState("");
    const [requestSuccess, setRequestSuccess] = useState("");
    const [isRequesting, setIsRequesting] = useState(false);

    const [pendingRequest, setPendingRequest] = useState(null);

    // sau khi gui request, pendingRequest luu thong tin ve request do
    const fetchPendingRequest = async (cv_id) => {
    if (!cv_id) {
        setPendingRequest(null);
        return;
    }
    try {
        const res = await fetchWithAuth(`${API}/requests/by_cv/${cv_id}`);
        if (res.status === 404) {
            setPendingRequest(null);
        } else {
            const data = await res.json();
            if (data.status === "pending") {
                setPendingRequest(data);
            }
            else {
                setPendingRequest(null);
            }
        }
    } catch (err) {
        setPendingRequest(null);
    }
}

    useEffect(() => {
        if (cvExtras.cv_id) {
            fetchPendingRequest(cvExtras.cv_id);
        }
    }, [cvExtras.cv_id]);

    // dropdown options
    const [courseOptions, setCourseOptions] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);
    // dialogs for adding new course/skill rows
    const [showAddCourseRow, setShowAddCourseRow] = useState(false);
    const [showAddSkillRow, setShowAddSkillRow] = useState(false);
    const [newCourse, setNewCourse] = useState({
        course_id: "",
        course_name: "",
        description: "",
        status: "In Progress",
        complete_date: "",
        duration: "",
        useNew: false
    });
    const [newSkill, setNewSkill] = useState({
        skill_id: "",
        skill_name: "",
        description: "",
        useNew: false
    });

    // handle edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [isEditMode]);

    // fetch courses, skills
    useEffect(() => {
        fetch(`${API}/courses/`).then(res => res.json()).then(setCourseOptions);
        fetch(`${API}/skills/`).then(res => res.json()).then(setSkillOptions);
    }, []);

    // fetch cv extras va cv existance
    useEffect(() => {
        setLoading(true);
        fetchWithAuth(`${API}/cv/${emp_id}`)
            .then(res => {
                if (res.status === 404) {
                setHasCv(false);
                setLoading(false);
                return null;
            }
            if (!res.ok) {
                throw new Error("Không thể lấy thông tin CV");
            }
            return res.json();
            })
            .then(data => {
                if (!data || data.editor_id === null) {
                    setHasCv(false);
                }
                else {
                    setCvExtras({
                        cv_id: data.cv_id,
                        trainings: data?.trainings || [],
                        courses: data?.courses || [],
                        skills: data?.skills || [],
                        summary: data?.summary || "",
                        email: data?.email || "",
                        phone: data?.phone || "",
                        address: data?.address || "",
                        editor_id: data?.editor_id,
                        update_date: data?.update_date,
                        status: data?.status
                    });
                    setHasCv(true);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [emp_id]);

    const handleCreate = async () => {
        try {
            const newCv = {
                editor_id: currentUser?.emp_id,
                update_date: new Date().toISOString().split('T')[0],
                status: "In Progress",
                summary: "",
                trainings: [],
                courses: [],
                skills: [],
                email: empInfo?.email || "",
                phone: empInfo?.phone || "",
                address: empInfo?.address || ""
            };
            const res = await fetchWithAuth(`${API}/cv/${emp_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCv)
            });
            if (!res.ok) 
                throw new Error("Lỗi khi tạo CV");
            const data = await res.json();
            setCvExtras(data);
            setEditData(data);
            setHasCv(true);
            setIsEditMode(true);
        } catch (err) {
            setError('Lỗi khi tạo CV mới');
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetchWithAuth(`${API}/cv/${emp_id}`, {
                method: 'DELETE',
            });
            if (!res.ok) 
                throw new Error("Lỗi khi xóa CV");
            setCvExtras({
                cv_id: null,
                trainings: [],
                courses: [],
                skills: [],
                summary: "",
                email: "",
                phone: "",
                address: "",
                editor_id: null,
                update_date: null,
                status: null
            });
            setHasCv(false);
            setIsEditMode(false);
        } catch (err) {
            setError('Lỗi khi xóa CV');
        }
    }

    const handleEdit = () => {
        setEditData({ ...cvExtras });
        setIsEditMode(true);
    };

    // SUMMARY
    const handleSummaryChange = (e) => {
        setEditData( { ...editData, summary: e.target.value } );
    }

    // FIELD (email, phone, address)
    const handleFieldChange = (field, value) => {
        setEditData({ ...editData, [field]: value });
    };

    // TRAININGS
    const handleTrainingFieldChange = (idx, field, value) => {
        const arr = [...editData.trainings];
        arr[idx] = { ...arr[idx], [field]: value };
        setEditData({ ...editData, trainings: arr });
    };
    const handleAddTraining = () => {
        setEditData({
            ...editData,
            trainings: [
                ...editData.trainings,
                { training_name: "", start_date: "", end_date: "", status: "", institution: "", degree: "", emp_id: emp_id }
            ]
        });
    };
    const handleRemoveTraining = (idx) => {
        const arr = [...editData.trainings];
        arr.splice(idx, 1);
        setEditData({ ...editData, trainings: arr });
    };

    // COURSES: Only one "+" button, opens dialog for dropdown or new
    const handleAddCourseRow = () => {
        setShowAddCourseRow(true);
        setNewCourse({
            course_id: "",
            course_name: "",
            description: "",
            status: "In Progress",
            complete_date: "",
            duration: "",
            useNew: false
        });
    };
    const handleSaveNewCourseRow = async () => {
        
        let course_id = newCourse.course_id;
        let course_name = "";
        let description = "";

        if (newCourse.useNew || !newCourse.course_id) {
            // create new course
            const res = await fetchWithAuth(`${API}/courses/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    course_name: newCourse.course_name,
                    description: newCourse.description
                })
            });
            //update new course option
            const created = await res.json();
            setCourseOptions([...courseOptions, created]);
            course_id = created.course_id;
            course_name = created.course_name;
            description = created.description;
        } else {
            const courseObj = courseOptions.find(opt => String(opt.course_id) === String(course_id));
            course_name = courseObj?.course_name;
            description = courseObj?.description;
        }
        // tao ra enrollment moi khi da co course_id
        const enrollmentRes = await fetchWithAuth(`${API}/enrollments/${emp_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                course_id: course_id,
                emp_id: Number(emp_id),
                status: newCourse.status || "In Progress",
                complete_date: newCourse.complete_date || null,
                duration: newCourse.duration || null,
            })
        });
        const createdEnrollment = await enrollmentRes.json();

        setEditData({
            ...editData,
            courses: [
                ...editData.courses,
                {
                    course_id: course_id,
                    course_name: course_name,
                    description: description,
                    status: newCourse.status || "In Progress",
                    complete_date: newCourse.complete_date || null,
                    duration: newCourse.duration || "",
                    enrollment_id: createdEnrollment.enrollment_id,
                }
            ]
        });
        setShowAddCourseRow(false);
        setNewCourse({
            course_id: "",
            course_name: "",
            description: "",
            status: "In Progress",
            complete_date: "",
            duration: "",
            useNew: false
        });
    };

    const handleRemoveCourse = async (idx) => {
        const arr = [...editData.courses];
        const course = arr[idx];
        if (course.enrollment_id) {
            await fetchWithAuth(`${API}/enrollments/${course.enrollment_id}`, {
                method: "DELETE",
            });
        }
        arr.splice(idx, 1);
        setEditData({ ...editData, courses: arr });
    };

    const handleSkillFieldChange = (field, value) => {
        setNewSkill({ ...newSkill, [field]: value });
    };
    const handleAddSkillRow = () => {
        setShowAddSkillRow(true);
        setNewSkill({
            skill_id: "",
            skill_name: "",
            description: "",
            useNew: false
        });
    };
    const handleSaveNewSkillRow = async () => {
        let skill_id = newSkill.skill_id;
        let skill_name = "";
        let description = "";

        if (newSkill.useNew || !newSkill.skill_id) {
            const res = await fetchWithAuth(`${API}/skills/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    skill_name: newSkill.skill_name,
                    description: newSkill.description
                })
            });
            const created = await res.json();
            setSkillOptions([...skillOptions, created]);
            skill_id = created.skill_id;
            skill_name = created.skill_name;
            description = created.description;
        } else {
            const skillObj = skillOptions.find(opt => String(opt.skill_id) === String(skill_id));
            skill_name = skillObj?.skill_name;
            description = skillObj?.description;
        }

        await fetchWithAuth(`${API}/has_skill/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                skill_id: skill_id,
                emp_id: Number(emp_id)
            })
        });

        setEditData({
            ...editData,
            skills: [
                ...editData.skills,
                {
                    skill_id: skill_id,
                    skill_name: skill_name,
                    description: description,
                }
            ]
        });
        setShowAddSkillRow(false);
        setNewSkill({
            skill_id: "",
            skill_name: "",
            description: "",
            useNew: false
        });
    };

    const handleRemoveSkill = (idx) => {
        const arr = [...editData.skills];
        arr.splice(idx, 1);
        setEditData({ ...editData, skills: arr });
    };

    // update old enrollment (status, complete_date, duration)
    const handleEditCourseEnrollmentFieldChange = (idx, field, value) => {
        const arr = [...editData.courses];
        arr[idx] = { ...arr[idx], [field]: value };
        setEditData({ ...editData, courses: arr });
    };

    // SAVE
    const handleSave = async () => {
        await fetchWithAuth(`${API}/cv/${emp_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData)
        });
        setIsEditMode(false);
        setHasUnsavedChanges(false);

        // reload data
        setLoading(true);
        fetchWithAuth(`${API}/cv/${emp_id}`)
            .then(res => res.json())
            .then(data => {
                setCvExtras({
                    trainings: data?.trainings || [],
                    courses: data?.courses || [],
                    skills: data?.skills || [],
                    summary: data?.summary || "",
                    email: data?.email || "",
                    phone: data?.phone || "",
                    address: data?.address || "",
                    editor_id: data?.editor_id,
                    update_date: data?.update_date,
                    status: data?.status
                });
                setLoading(false);
            });
    }

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    })

    const handleBack = () => {
        if (hasUnsavedChanges) {
            if (!window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời trang?")) {
                return;
            }
        }
        navigate(-1);
    }

    const handleCreateRequest = async () => {
        setRequestError("");
        setRequestSuccess("");
        setIsRequesting(true);

        try {
            const res = await fetchWithAuth(`${API}/requests/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cv_id: cvExtras.cv_id,
                    message: requestMessage
                }), 
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || "Lỗi khi gửi yêu cầu");
            }
            setRequestSuccess("Yêu cầu đã được gửi thành công!");
            setShowRequestModal(false);
            setRequestMessage("");
            
            setPendingRequest({
                request_id: data.request_id,
                cv_id: cvExtras.cv_id,
                sender_id: currentUser.emp_id,
                message: requestMessage,
                status: "pending"
            });
            console.log('Pending request set:', {
                request_id: data.request_id,
            })

        } catch (err) {
            setRequestError(err.message || "Lỗi khi gửi yêu cầu");
        } finally {
            setIsRequesting(false);
        }
    }

    if (!empInfo) return <div>Không tìm thấy thông tin nhân viên.</div>;

    if (!hasCv && !isEditMode) {
        return (
            <div className="cv-details-container">
                <div className="grp-btn">
                    <button className="back-btn" onClick={handleBack}>
                        <FaArrowLeft className="icon"/> Quay lại
                    </button>
                    {(currentUser?.emp_id === Number(emp_id) || currentUser?.roles.includes("Admin")) && (
                        <button className="edit-btn" onClick={handleCreate}>Tạo CV mới</button>
                    )}
                </div>

                <div className="text-center text-gray-600 mt-4">Chưa tạo CV. Nhấn vào "Tạo CV mới"!</div>
            </div>
        )
    }

    if (isLoading) {
        return <div className="text-center mt-4">Đang tải thông tin CV...</div>;
    }
    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    let editorDisplay = <i>Chưa rõ</i>;
    if (cvExtras.editor_id === 1) editorDisplay = "Admin";
    else if (Number(cvExtras.editor_id) === Number(emp_id)) editorDisplay = "Tôi";

    const fullName = `${empInfo.last_name} ${empInfo.first_name}`.toUpperCase();
    const title = empInfo.roles && empInfo.roles.length > 0 ? empInfo.roles.join(', ') : "";
    const genderDisplay = empInfo.gender === "male" ? "Nam" : empInfo.gender === "female" ? "Nữ" : empInfo.gender;
    return (
        <div className="cv-details-container">
            <div className="grp-btn">
                <button className="back-btn" onClick={handleBack}>
                    <FaArrowLeft className="icon" /> Quay lại
                </button>
                <div className="right-btn-group">
                    <div className="request-btn-group">
                        {hasCv && !isEditMode && (currentUser?.emp_id !== Number(emp_id)) && (
                        
                            <button
                                className="request-btn create-request-btn"
                                onClick={() => {
                                    setRequestError("");
                                    setRequestSuccess("");
                                    setShowRequestModal(true);
                                }}
                            >
                                <LuMessageCirclePlus className="icon" /> Tạo yêu cầu
                            </button>

                        )}

                        {pendingRequest && pendingRequest.sender_id === currentUser?.emp_id && !isEditMode && (
                            <button 
                                className="request-btn cancel-request-btn"
                                onClick={async() => {
                                    try {
                                        const res = await fetchWithAuth(`${API}/requests/${pendingRequest.request_id}/cancel`, {
                                            method: 'PATCH',
                                        });
                                        
                                        if (!res.ok) {
                                            throw new Error("Lỗi khi hủy yêu cầu");
                                        }
                                        setPendingRequest(null);
                                        setRequestSuccess("Yêu cầu đã được hủy thành công!");
                                        
                                        // reload cv
                                        setLoading(true);

                                        fetchWithAuth(`${API}/cv/${emp_id}`)
                                            .then(res => res.json())
                                            .then(data => {
                                                setCvExtras({
                                                    cv_id: data.cv_id,
                                                    trainings: data?.trainings || [],
                                                    courses: data.courses || [],
                                                    skills: data?.skills || [],
                                                    summary: data?.summary || "",
                                                    email: data?.email || "",
                                                    phone: data?.phone || "",
                                                    address: data?.address || "",
                                                    editor_id: data?.editor_id,
                                                    update_date: data?.update_date,
                                                    status: data?.status
                                                });
                                                setLoading(false);
                                            })
                                    } catch (err) {
                                        setRequestError(err.message || "Lỗi khi hủy yêu cầu");
                                    }
                                }}
                            >
                                <LuMessageCircleX className="icon" /> Huỷ yêu cầu
                            </button>
                        )}
                    </div>    

                    <div className="edit-delete-group">
                        {!isEditMode && (currentUser?.emp_id === Number(emp_id) || currentUser?.roles?.includes("Admin")) && (
                            <>
                            <button className="edit-btn" onClick={handleEdit}>
                                <FaEdit className="icon"/> Chỉnh sửa
                            </button>
                            <button className="delete-btn" onClick={handleDelete}>
                                <FaTrashAlt className="icon" /> Xóa CV
                            </button>
                            </>
                        )}
                        {isEditMode && (
                            <div className="edit-action-group">
                                <button className="save-btn" onClick={handleSave}>Lưu</button>
                                <button className="cancel-btn" onClick={() => setIsEditMode(false)}>Hủy</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showRequestModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Tạo yêu cầu cập nhật CV</h3>

                        <div>
                            <label>Nội dung yêu cầu:</label>
                            <textarea
                                value={requestMessage}
                                onChange={e => setRequestMessage(e.target.value)}
                                rows={4}
                                style={{ width: "100%" }}
                                placeholder="Nội dung cụ thể..."
                                disabled={isRequesting}
                            />
                        </div>
                        {requestError && <div style={{ color: "red", marginTop: 8 }}>{requestError}</div>}
                        {requestSuccess && <div style={{ color: "green", marginTop: 8 }}>{requestSuccess}</div>}
                        <div>
                            <button
                                onClick={handleCreateRequest}
                                disabled={isRequesting}
                            >
                                Gửi yêu cầu
                            </button>

                            <button onClick={() => setShowRequestModal(false)} disabled={isRequesting}>Hủy</button>
                        </div>
                    </div> 
                </div>
            )}

            <div className="cv-meta">
                <div>
                    <b>Trạng thái:</b> {cvExtras.status || <i>Chưa xác định</i>}
                </div>
                <div><b>Cập nhật bởi:</b> {editorDisplay}</div>
                <div>
                    <b>Lần cuối cập nhật:</b> 
                        {cvExtras.update_date ? new Date(cvExtras.update_date).toLocaleDateString('vi-VN') : <i>Chưa có</i>}
                </div>
            </div>

            <div className="cv-template">
                <div className="cv-header">
                    <div className="cv-avatar">
                        <div className="avatar-placeholder">Ảnh chân dung</div>
                    </div>
                    <div className="cv-title">
                        <h1 className="cv-name">
                            {fullName}
                        </h1>
                        <div className="cv-role">
                            [{title}]
                        </div>
                    </div>
                </div>

                <h2 className="cv-section-title">TÓM TẮT</h2>
                <div className="cv-summary">
                    {isEditMode ? (
                        <textarea
                            value={editData.summary}
                            onChange={handleSummaryChange}
                            rows={4}
                        />
                    ) : (
                        <p>{cvExtras.summary || <i className="info-none">Chưa cập nhật tóm tắt</i>}</p>
                    )}
                </div>

                <h2 className="cv-section-title">THÔNG TIN CHUNG</h2>
                <div className="cv-info-section">
                    <div className="cv-info-2col">
                        <div className="cv-info-personal">
                            <b>Thông tin cá nhân</b>
                            <ul className="cv-info-list">
                                <li><b>Họ tên:</b> {empInfo.last_name} {empInfo.first_name}</li>
                                <li><b>Mã nhân viên:</b> {empInfo.emp_id}</li>
                                <li><b>Giới tính:</b> {genderDisplay}</li>
                                <li><b>Ngày sinh:</b> {empInfo.dob ? new Date(empInfo.dob).toLocaleDateString('vi-VN') : ""}</li>
                                <li><b>Phòng ban:</b> {empInfo.department}</li>
                                <li>
                                    <b>Email:</b>{" "}
                                    {isEditMode ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={e => handleFieldChange("email", e.target.value)}
                                        />
                                    ) : (
                                        cvExtras.email || <i className="info-none">Chưa cập nhật</i>
                                    )}
                                </li>
                                <li>
                                    <b>Điện thoại:</b>{" "}
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            value={editData.phone}
                                            onChange={e => handleFieldChange("phone", e.target.value)}
                                        />
                                    ) : (
                                        cvExtras.phone || <i className="info-none">Chưa cập nhật</i>
                                    )}
                                </li>
                                <li>
                                    <b>Địa chỉ:</b>{" "}
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            value={editData.address}
                                            onChange={e => handleFieldChange("address", e.target.value)}
                                        />
                                    ) : (
                                        cvExtras.address || <i className="info-none">Chưa cập nhật</i>
                                    )}
                                </li>
                            </ul>
                        </div>

                        <div className="cv-training">
                            <b>Đào tạo</b>
                            <ul className="cv-info-list">
                                {isEditMode ? (
                                    <>
                                        {editData.trainings.map((t, i) => (
                                            <li key={t.training_id || i}>
                                                <input
                                                    type="text"
                                                    placeholder="Tên đào tạo"
                                                    value={t.training_name || ""}
                                                    onChange={e => handleTrainingFieldChange(i, "training_name", e.target.value)}
                                                    className="input-training-name"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Tổ chức"
                                                    value={t.institution || ""}
                                                    onChange={e => handleTrainingFieldChange(i, "institution", e.target.value)}
                                                    className="input-institution"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Bằng cấp"
                                                    value={t.degree || ""}
                                                    onChange={e => handleTrainingFieldChange(i, "degree", e.target.value)}
                                                    className="input-degree"
                                                />
                                                <input
                                                    type="date"
                                                    value={t.start_date ? t.start_date.slice(0,10) : ""}
                                                    onChange={e => handleTrainingFieldChange(i, "start_date", e.target.value)}
                                                    className="input-date"
                                                />
                                                <input
                                                    type="date"
                                                    value={t.end_date ? t.end_date.slice(0,10) : ""}
                                                    onChange={e => handleTrainingFieldChange(i, "end_date", e.target.value)}
                                                    className="input-date"
                                                />
                                                <select
                                                    value={t.status || ""}
                                                    onChange={e => handleTrainingFieldChange(i, "status", e.target.value)}
                                                    className="select-status"
                                                >
                                                    <option value="">Trạng thái</option>
                                                    <option value="Completed">Hoàn thành</option>
                                                    <option value="In Progress">Đang học</option>
                                                </select>
                                                <button className="bin" type="button" onClick={() => handleRemoveTraining(i)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button type="button" onClick={handleAddTraining}>+ Thêm dòng</button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        {cvExtras.trainings.length === 0 && <li><i className="info-none">Chưa cập nhật thông tin đào tạo</i></li>}
                                        {cvExtras.trainings.map((t, i) => (
                                            <li key={t.training_id || i}>
                                                {t.training_name} - {t.institution} <i>({t.status})</i>
                                                {(t.degree || t.start_date || t.end_date) && (
                                                    <div className="cv-training-details">
                                                        {t.degree && (
                                                            <div><b>Bằng cấp:</b> {t.degree}</div>
                                                        )}
                                                        {(t.start_date || t.end_date) && (
                                                            <div>
                                                                <b>Thời gian:</b>
                                                                {t.status?.toLowerCase() === "in progress"
                                                                    ? (
                                                                        t.start_date ? ` ${new Date(t.start_date).toLocaleDateString('vi-VN')}` : ''
                                                                    )
                                                                    : t.start_date && t.end_date
                                                                    ? ` ${new Date(t.start_date).toLocaleDateString('vi-VN')} - ${new Date(t.end_date).toLocaleDateString('vi-VN')}`
                                                                    : t.start_date
                                                                        ? ` ${new Date(t.start_date).toLocaleDateString('vi-VN')}`
                                                                        : t.end_date
                                                                        ? ` ${new Date(t.end_date).toLocaleDateString('vi-VN')}`
                                                                        : ''
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <b>Thông tin khóa học đã tham gia:</b>
                        <ul className="cv-course-list">
                            {isEditMode ? (
                                <>
                                    {editData.courses.map((c, i) => (
                                        <li key={c.enrollment_id || c.course_id || i}>
                                            <div className="cv-course-fields">
                                                <input
                                                    type="text"
                                                    placeholder="Tên khoá học"
                                                    value={c.course_name || ""}
                                                    onChange={e => handleEditCourseEnrollmentFieldChange(i, "course_name", e.target.value)}
                                                    className="input-course-name"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Mô tả"
                                                    value={c.description || ""}
                                                    onChange={e => handleEditCourseEnrollmentFieldChange(i, "description", e.target.value)}
                                                    className="input-description"
                                                />
                                                <select
                                                    value={c.status || "In Progress"}
                                                    onChange={e => handleEditCourseEnrollmentFieldChange(i, "status", e.target.value)}
                                                    className="select-status"
                                                >
                                                    <option value="In Progress">Chưa hoàn thành</option>
                                                    <option value="Completed">Đã hoàn thành</option>
                                                </select>
                                                <input
                                                    type="date"
                                                    value={c.complete_date ? c.complete_date.slice(0,10) : ""}
                                                    onChange={e => handleEditCourseEnrollmentFieldChange(i, "complete_date", e.target.value)}
                                                    disabled={c.status !== "Completed"}
                                                    className="input-complete-date"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Thời lượng"
                                                    value={c.duration || ""}
                                                    onChange={e => handleEditCourseEnrollmentFieldChange(i, "duration", e.target.value)}
                                                    className="input-duration"
                                                />
                                                <button className="bin" type="button" onClick={() => handleRemoveCourse(i)}>
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
                                        <button type="button" className="add-btn" onClick={handleAddCourseRow}>+ Thêm khoá học</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    {cvExtras.courses.length === 0 && <li><i className="info-none">Chưa cập nhật khóa học</i></li>}
                                    {cvExtras.courses.map((c, i) => (
                                        <li key={c.enrollment_id || c.course_id || i}>
                                            {c.course_name}
                                            {c.description ? <> - {c.description}</> : null}
                                            {c.status && c.status !== "Completed" && <> <i>({c.status})</i></>}
                                            {c.complete_date ? <> - Hoàn thành: {new Date(c.complete_date).toLocaleDateString('vi-VN')}</> : null}
                                            {c.duration ? <> - Thời lượng: {c.duration}</> : null}
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </div>
                </div>
                
                <div>
                    <b>KỸ NĂNG</b>
                    <ul className="cv-skill-list">
                        {isEditMode ? (
                            <>
                                {editData.skills.map((s, i) => (
                                    <li key={s.skill_id || i}>
                                        <div className="cv-course-fields">
                                            <input
                                                type="text"
                                                placeholder="Tên kỹ năng"
                                                value={s.skill_name || ""}
                                                onChange={e => handleSkillFieldChange(i, "skill_name", e.target.value)}
                                                className="input-skill-name"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Mô tả"
                                                value={s.description || ""}
                                                onChange={e => handleSkillFieldChange(i, "description", e.target.value)}
                                                className="input-description"
                                            />
                                            <button className="bin" type="button" onClick={() => handleRemoveSkill(i)}>
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                                <li>
                                    <button type="button" className="add-btn" onClick={handleAddSkillRow}>+ Thêm kỹ năng</button>
                                </li>
                            </>
                        ) : (
                            <>
                                {cvExtras.skills.length === 0 && <li><i className="info-none">Chưa cập nhật kỹ năng</i></li>}
                                {cvExtras.skills.map((s, i) => (
                                    <li key={s.skill_id || i}>{s.skill_name}{s.description ? `: ${s.description}` : ""}</li>
                                ))}
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* Add new course row dialog */}
            {showAddCourseRow && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Thêm khoá học mới</h3>

                        <div className="modal-form-row">
                            <label>
                                <input
                                    type="radio"
                                    checked={!newCourse.useNew}
                                    onChange={() => setNewCourse({ ...newCourse, useNew: false, course_id: "" })}
                                />
                                <span>Chọn từ danh sách</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={!!newCourse.useNew}
                                    onChange={() => setNewCourse({ ...newCourse, useNew: true, course_id: "" })}
                                />
                                <span>Tạo mới khoá học</span>
                            </label>
                        </div>

                        <div className="modal-form-row">
                            {!newCourse.useNew ? (
                                <select
                                    value={newCourse.course_id}
                                    onChange={e => setNewCourse({ ...newCourse, course_id: e.target.value })}
                                >
                                    <option value="">-- Chọn khoá học --</option>
                                    {courseOptions.map(opt => (
                                        <option value={opt.course_id} key={opt.course_id}>{opt.course_name}</option>
                                    ))}
                                </select>
                            ) : (
                                <>
                                    <input
                                        placeholder="Tên khoá học"
                                        value={newCourse.course_name}
                                        onChange={e => setNewCourse({ ...newCourse, course_name: e.target.value })}
                                    /><br />
                                    <input
                                        placeholder="Mô tả"
                                        value={newCourse.description}
                                        onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                    /><br />
                                </>
                            )}

                            <input
                                placeholder="Thời lượng"
                                value={newCourse.duration}
                                onChange={e => setNewCourse({ ...newCourse, duration: e.target.value })}
                                style={{maxWidth:"100px"}}
                            /><br />
                            <select
                                value={newCourse.status}
                                onChange={e => setNewCourse({ ...newCourse, status: e.target.value })}
                            >
                                <option value="In Progress">Chưa hoàn thành</option>
                                <option value="Completed">Đã hoàn thành</option>
                            </select>
                        </div>

                       
                        <span>Ngày hoàn thành:</span>
                        <input
                            type="date"
                            value={newCourse.complete_date}
                            onChange={e => setNewCourse({ ...newCourse, complete_date: e.target.value })}
                            disabled={newCourse.status !== "Completed"}
                        />
                        
                        
                        <div>
                            <button onClick={handleSaveNewCourseRow} disabled={
                                (!newCourse.useNew && !newCourse.course_id) ||
                                (newCourse.useNew && !newCourse.course_name)
                            }>Lưu</button>
                            <button onClick={() => setShowAddCourseRow(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Add new skill row dialog */}
            {showAddSkillRow && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Thêm kỹ năng mới</h3>
                        <div className="modal-form-row">
                            <label>
                                <input
                                    type="radio"
                                    checked={!newSkill.useNew}
                                    onChange={() => setNewSkill({ ...newSkill, useNew: false, skill_id: "" })}
                                />
                                <span>Chọn từ danh sách</span>
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    checked={!!newSkill.useNew}
                                    onChange={() => setNewSkill({ ...newSkill, useNew: true, skill_id: "" })}
                                />
                                <span>Tạo mới kỹ năng</span>
                            </label>
                        </div>
                        {!newSkill.useNew ? (
                            <select
                                value={newSkill.skill_id}
                                onChange={e => setNewSkill({ ...newSkill, skill_id: e.target.value })}
                            >
                                <option value="">-- Chọn kỹ năng --</option>
                                {skillOptions.map(opt => (
                                    <option value={opt.skill_id} key={opt.skill_id}>{opt.skill_name}</option>
                                ))}
                            </select>
                        ) : (
                            <>
                                <input
                                    placeholder="Tên kỹ năng"
                                    value={newSkill.skill_name}
                                    onChange={e => setNewSkill({ ...newSkill, skill_name: e.target.value })}
                                /><br />
                                <input
                                    placeholder="Mô tả"
                                    value={newSkill.description}
                                    onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
                                /><br />
                            </>
                        )}
                        <div>
                            <button onClick={handleSaveNewSkillRow} disabled={
                                (!newSkill.useNew && !newSkill.skill_id) ||
                                (newSkill.useNew && !newSkill.skill_name)
                            }>Lưu</button>
                            <button onClick={() => setShowAddSkillRow(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CvDetails;