import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Row, Col, Button, Badge, Spinner, Modal } from 'react-bootstrap';
import { CreditCard, User, Calendar, CheckCircle } from 'lucide-react';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState([]);

    // Payment State
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    const fetchMemberData = async () => {
        try {
            const res = await api.get('/members');
            const myProfile = res.data.find(m => m.user?.email === user.email);
            setMember(myProfile);

            if (myProfile) {
                const attRes = await api.get(`/attendance/member/${myProfile.id}`);
                setAttendance(attRes.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (user) fetchMemberData(); }, [user]);

    // 👇 HELPER: Load Razorpay SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // 👇 REAL RAZORPAY PAYMENT HANDLER
    const handlePayment = async () => {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        setProcessing(true);

        try {
            // 1. Create Order on Backend
            const amount = member.membershipPlan?.price || 1000;
            const orderRes = await api.post('/payments/create-order', { amount: amount });
            
            // ✅ FIX: Removed JSON.parse(). Use the data directly.
            const orderData = orderRes.data;

            // 2. Open Razorpay Window
            const options = {
                key: "rzp_test_BLuYvjyR58WQhz", // ⚠️ MAKE SURE THIS IS CORRECT
                amount: orderData.amount,
                currency: orderData.currency,
                name: "FitPro Gym",
                description: "Membership Renewal",
                order_id: orderData.id, 
                handler: async function (response) {
                    // 3. Verify Payment on Success
                    try {
                        await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            memberId: member.id,
                            amount: amount
                        });
                        
                        setProcessing(false);
                        setShowSuccessModal(true); 
                        
                        setTimeout(() => {
                            setShowSuccessModal(false);
                            fetchMemberData(); 
                        }, 2500);

                    } catch (err) {
                        alert("Payment Verification Failed. Contact Admin.");
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: member.name,
                    email: member.user?.email,
                    contact: member.phone
                },
                theme: { color: "#FFC107" },
                modal: {
                    ondismiss: function() {
                        setProcessing(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error("Payment Error:", err);
            alert("Could not initiate payment. Server error?");
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-center mt-5 text-white"><Spinner animation="border" variant="warning"/></div>;
    if (!member) return <Container className="text-center mt-5 text-white"><h3>Profile Not Found</h3></Container>;

    const todayStr = new Date().toISOString().split('T')[0];
    const isCheckedInToday = attendance.some(a => a.date === todayStr);

    const uniqueAttendance = [...new Map(attendance.map(item => [item.date, item])).values()]
                             .sort((a, b) => new Date(b.date) - new Date(a.date)) 
                             .slice(0, 5); 

    return (
        <div className="fade-in">
            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
                .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
            `}</style>

            <Container className="py-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="fw-bold text-white">Hello, <span className="text-warning">{member.name}</span></h1>
                        <p className="text-secondary">Welcome back to the grind.</p>
                    </div>
                    <Badge bg={member.endDate ? "success" : "danger"} className="px-3 py-2 fs-6">
                        {member.endDate ? "Active Member" : "Membership Expired"}
                    </Badge>
                </div>

                <Row className="g-4">
                    <Col md={4}>
                        <Card className="bg-dark border-secondary text-white h-100 shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3">
                                <h5 className="m-0 d-flex align-items-center gap-2"><CreditCard size={20} className="text-warning"/> Membership</h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <small className="text-secondary text-uppercase fw-bold">Plan</small>
                                    <h3 className="fw-bold text-white">{member.membershipPlan?.planName || "No Plan"}</h3>
                                </div>
                                <div className="d-flex justify-content-between align-items-end">
                                    <div>
                                        <small className="text-secondary fw-bold">Expires</small>
                                        <p className={member.endDate ? "text-white m-0" : "text-danger m-0"}>{member.endDate || "Expired"}</p>
                                    </div>
                                    {!member.endDate && (
                                        <Button size="sm" variant="gold" onClick={handlePayment} disabled={processing}>
                                            {processing ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Renew Now"}
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="bg-dark border-secondary text-white h-100 shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3">
                                <h5 className="m-0 d-flex align-items-center gap-2"><User size={20} className="text-warning"/> Trainer</h5>
                            </Card.Header>
                            <Card.Body className="text-center">
                                {member.trainer ? (
                                    <>
                                        <h4>{member.trainer.trainerName}</h4>
                                        <Badge bg="info" className="bg-opacity-25 text-info">{member.trainer.specialization}</Badge>
                                        <p className="text-secondary mt-2 small">{member.trainer.phone}</p>
                                    </>
                                ) : <p className="text-secondary py-3">No trainer assigned.</p>}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="bg-dark border-secondary text-white h-100 shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3 d-flex justify-content-between">
                                <h5 className="m-0 d-flex align-items-center gap-2"><Calendar size={20} className="text-warning"/> Attendance</h5>
                                {isCheckedInToday && <Badge bg="success">Checked In ✅</Badge>}
                            </Card.Header>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="text-secondary">Total Days Present</span>
                                    <h2 className="fw-bold text-success m-0">{attendance.length}</h2>
                                </div>
                                <hr className="border-secondary opacity-25"/>
                                <h6 className="text-secondary small fw-bold mb-3">RECENT CHECK-INS</h6>
                                
                                {uniqueAttendance.length > 0 ? (
                                    <div className="custom-scroll" style={{maxHeight: '120px', overflowY: 'auto', paddingRight: '5px'}}>
                                        {uniqueAttendance.map((att, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-10">
                                                <span className="text-light">{att.date}</span>
                                                <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25">Present</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-secondary small text-center py-3">No attendance records yet.</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Body className="bg-light p-5 text-center rounded">
                        <CheckCircle size={80} className="text-success mb-3" />
                        <h2 className="fw-bold text-success">Payment Successful!</h2>
                        <p className="text-secondary">Your membership has been renewed.</p>
                        <p className="small text-muted">Refreshing dashboard...</p>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default MemberDashboard;