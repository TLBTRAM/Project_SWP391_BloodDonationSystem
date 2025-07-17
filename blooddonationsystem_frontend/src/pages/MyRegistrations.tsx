import React, { useEffect, useState } from "react";
import Header from "../layouts/header-footer/Header";
import Footer from "../layouts/header-footer/Footer";
import "./components/MyRegistrations.css";
import { useNavigate } from "react-router-dom";
interface Registration {
    id: number;
    registerDate: string;
    status: string;
    note: string;
    slot: {
        id: number;
        label: string;
        startTime: string;
        endTime: string;
        delete: boolean;
    };
    userId: number;
    fullName: string;
    passed: boolean | null;
}

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [tabIndex, setTabIndex] = useState<0 | 1 | 2>(0); // 0: PENDING, 1: APPROVED, 2: CANCELLED
    const [pagePending, setPagePending] = useState(1);
    const [pageApproved, setPageApproved] = useState(1);
    const [pageCancelled, setPageCancelled] = useState(1);
    const PAGE_SIZE = 5;
    const navigate = useNavigate();
    // State for cancel modal
    const [cancelId, setCancelId] = useState<number | null>(null);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelLoading, setCancelLoading] = useState(false);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    // Reset trang về 1 khi chuyển tab
    useEffect(() => {
        if (tabIndex === 0) setPagePending(1);
        else if (tabIndex === 1) setPageApproved(1);
        else setPageCancelled(1);
    }, [tabIndex]);

    const fetchRegistrations = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/registers/my", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });
            const text = await res.text();
            try {
                const data = JSON.parse(text);
                setRegistrations(data);
            } catch (e) {
                console.error("JSON parse error:", e, text);
            }
        } catch (err) {
            console.error("API fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Lọc đơn theo trạng thái
    const pendingRegs = registrations.filter(r => r.status === "PENDING");
    const approvedRegs = registrations.filter(r => r.status === "APPROVED");
    const cancelledRegs = registrations.filter(r => r.status === "CANCELED");

    // Lấy dữ liệu phân trang
    const pagedPending = pendingRegs.slice((pagePending-1)*PAGE_SIZE, pagePending*PAGE_SIZE);
    const pagedApproved = approvedRegs.slice((pageApproved-1)*PAGE_SIZE, pageApproved*PAGE_SIZE);
    const pagedCancelled = cancelledRegs.slice((pageCancelled-1)*PAGE_SIZE, pageCancelled*PAGE_SIZE);

    // Cancel registration handler
    const handleCancel = async () => {
        if (!cancelId) return;
        setCancelLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/registers/${cancelId}/cancel`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ reason: cancelReason }),
            });
            if (res.ok) {
                setRegistrations((prev) => prev.filter((r) => r.id !== cancelId));
                setCancelId(null);
                setCancelReason("");
            } else {
                alert("Hủy đơn thất bại!");
            }
        } catch (err) {
            alert("Lỗi khi hủy đơn!");
        } finally {
            setCancelLoading(false);
        }
    };

    // Component hiển thị bảng đơn đăng ký (moved inside to access setCancelId/setCancelReason)
    const TableRegistrations: React.FC<{ regs: Registration[]; emptyMsg: string }> = ({ regs, emptyMsg }) => (
        regs.length === 0 ? (
            <p>{emptyMsg}</p>
        ) : (
            <table className="registration-table">
                <thead>
                    <tr>
                        <th>Ngày đăng ký</th>
                        <th>Khung giờ</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {regs.map((item) => (
                        <tr key={item.id}>
                            <td>{item.registerDate}</td>
                            <td>{item.slot.label}</td>
                            <td>
                              {item.status === 'PENDING' ? (
                                <span className="status-pending">ĐANG CHỜ</span>
                              ) : item.status === 'APPROVED' ? (
                                <span className="status-approved">ĐÃ LÊN LỊCH</span>
                              ) : item.status === 'CANCELED' ? (
                                <span style={{color:'#b22b2b', fontWeight:'bold'}}>ĐÃ HỦY</span>
                              ) : (
                                item.status
                              )}
                            </td>
                            <td>
                              {item.status === 'PENDING' && (
                                <button className="cancel-button" onClick={() => { setCancelId(item.id); setCancelReason(""); }}>Hủy đơn</button>
                              )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    );

    // Component phân trang
    const Pagination: React.FC<{ current: number; total: number; pageSize: number; onChange: (p: number) => void }> = ({ current, total, pageSize, onChange }) => {
        const totalPages = Math.ceil(total / pageSize);
        if (totalPages <= 1) return null;
        return (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
                <button
                    onClick={() => onChange(current - 1)}
                    disabled={current === 1}
                    style={{
                        marginRight: 8,
                        fontSize: 20,
                        borderRadius: 6,
                        width: 36,
                        height: 36,
                        border: '1px solid #b22b2b',
                        background: current === 1 ? '#eee' : '#fff',
                        color: '#b22b2b',
                        cursor: current === 1 ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        boxShadow: current === 1 ? 'none' : '0 1px 4px #eee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseOver={e => { if(current !== 1) e.currentTarget.style.background = '#ffeaea'; }}
                    onMouseOut={e => { if(current !== 1) e.currentTarget.style.background = '#fff'; }}
                >
                    {'\u25C0'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        onClick={() => onChange(page)}
                        className={page === current ? 'tab-btn active' : 'tab-btn'}
                        style={{
                            margin: '0 2px',
                            width: 36,
                            height: 36,
                            borderRadius: 6,
                            background: page === current ? '#b22b2b' : '#fff',
                            color: page === current ? '#fff' : '#b22b2b',
                            border: '1px solid #b22b2b',
                            fontWeight: 500,
                            cursor: 'pointer',
                            fontSize: 16,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                        onMouseOver={e => { if(page !== current) e.currentTarget.style.background = '#ffeaea'; }}
                        onMouseOut={e => { if(page !== current) e.currentTarget.style.background = '#fff'; }}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onChange(current + 1)}
                    disabled={current === totalPages}
                    style={{
                        marginLeft: 8,
                        fontSize: 20,
                        borderRadius: 6,
                        width: 36,
                        height: 36,
                        border: '1px solid #b22b2b',
                        background: current === totalPages ? '#eee' : '#fff',
                        color: '#b22b2b',
                        cursor: current === totalPages ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s',
                        boxShadow: current === totalPages ? 'none' : '0 1px 4px #eee',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseOver={e => { if(current !== totalPages) e.currentTarget.style.background = '#ffeaea'; }}
                    onMouseOut={e => { if(current !== totalPages) e.currentTarget.style.background = '#fff'; }}
                >
                    {'\u25B6'}
                </button>
            </div>
        );
    };

    return (
        <div>
            <Header />
            <div className="registration-wrapper">
                <button className="back-button" onClick={() => navigate("/user")}>← Quay lại</button>
                <h2>Danh sách đơn đã đăng ký</h2>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                    <button
                        className={tabIndex === 0 ? "tab-btn active" : "tab-btn"}
                        onClick={() => setTabIndex(0)}
                    >
                        Đơn chờ duyệt
                    </button>
                    <button
                        className={tabIndex === 1 ? "tab-btn active" : "tab-btn"}
                        onClick={() => setTabIndex(1)}
                        style={{ marginLeft: 12 }}
                    >
                        Đơn đã duyệt
                    </button>
                    <button
                        className={tabIndex === 2 ? "tab-btn active" : "tab-btn"}
                        onClick={() => setTabIndex(2)}
                        style={{ marginLeft: 12 }}
                    >
                        Đơn đã hủy
                    </button>
                </div>
                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <>
                        {tabIndex === 0 ? (
                            <>
                                <TableRegistrations regs={pagedPending} emptyMsg="Không có đơn chờ duyệt." />
                                <Pagination
                                    current={pagePending}
                                    total={pendingRegs.length}
                                    pageSize={PAGE_SIZE}
                                    onChange={setPagePending}
                                />
                            </>
                        ) : tabIndex === 1 ? (
                            <>
                                <TableRegistrations regs={pagedApproved} emptyMsg="Không có đơn đã duyệt." />
                                <Pagination
                                    current={pageApproved}
                                    total={approvedRegs.length}
                                    pageSize={PAGE_SIZE}
                                    onChange={setPageApproved}
                                />
                            </>
                        ) : (
                            <>
                                <TableRegistrations regs={pagedCancelled} emptyMsg="Không có đơn đã hủy." />
                                <Pagination
                                    current={pageCancelled}
                                    total={cancelledRegs.length}
                                    pageSize={PAGE_SIZE}
                                    onChange={setPageCancelled}
                                />
                            </>
                        )}
                    </>
                )}
            </div>
            <Footer />
            {cancelId && (
              <div className="popup-overlay">
                <div className="popup-content">
                  <h3>Xác nhận hủy đơn đăng ký</h3>
                  <p>Bạn có chắc chắn muốn <span style={{color:'#FF204E', fontWeight:'bold'}}>hủy</span> đơn này không?</p>
                  <textarea
                    placeholder="Lý do hủy (không bắt buộc)"
                    value={cancelReason}
                    onChange={e => setCancelReason(e.target.value)}
                    style={{width:'100%', minHeight:60, marginBottom:12, borderRadius:6, border:'1px solid #ccc', padding:8}}
                  />
                  <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                    <button className="cancel-button" onClick={handleCancel} disabled={cancelLoading}>{cancelLoading ? 'Đang hủy...' : 'Xác nhận hủy'}</button>
                    <button onClick={()=>{setCancelId(null); setCancelReason("");}} style={{padding:'6px 12px', borderRadius:4, border:'none', background:'#eee', color:'#333', cursor:'pointer'}}>Hủy bỏ</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

// Component phân trang
const Pagination: React.FC<{ current: number; total: number; pageSize: number; onChange: (p: number) => void }> = ({ current, total, pageSize, onChange }) => {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '18px 0' }}>
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                style={{
                    marginRight: 8,
                    fontSize: 20,
                    borderRadius: 6,
                    width: 36,
                    height: 36,
                    border: '1px solid #b22b2b',
                    background: current === 1 ? '#eee' : '#fff',
                    color: '#b22b2b',
                    cursor: current === 1 ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    boxShadow: current === 1 ? 'none' : '0 1px 4px #eee',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseOver={e => { if(current !== 1) e.currentTarget.style.background = '#ffeaea'; }}
                onMouseOut={e => { if(current !== 1) e.currentTarget.style.background = '#fff'; }}
            >
                {'\u25C0'}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    onClick={() => onChange(page)}
                    className={page === current ? 'tab-btn active' : 'tab-btn'}
                    style={{
                        margin: '0 2px',
                        width: 36,
                        height: 36,
                        borderRadius: 6,
                        background: page === current ? '#b22b2b' : '#fff',
                        color: page === current ? '#fff' : '#b22b2b',
                        border: '1px solid #b22b2b',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontSize: 16,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={e => { if(page !== current) e.currentTarget.style.background = '#ffeaea'; }}
                    onMouseOut={e => { if(page !== current) e.currentTarget.style.background = '#fff'; }}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onChange(current + 1)}
                disabled={current === totalPages}
                style={{
                    marginLeft: 8,
                    fontSize: 20,
                    borderRadius: 6,
                    width: 36,
                    height: 36,
                    border: '1px solid #b22b2b',
                    background: current === totalPages ? '#eee' : '#fff',
                    color: '#b22b2b',
                    cursor: current === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    boxShadow: current === totalPages ? 'none' : '0 1px 4px #eee',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseOver={e => { if(current !== totalPages) e.currentTarget.style.background = '#ffeaea'; }}
                onMouseOut={e => { if(current !== totalPages) e.currentTarget.style.background = '#fff'; }}
            >
                {'\u25B6'}
            </button>
        </div>
    );
};

export default MyRegistrations;
