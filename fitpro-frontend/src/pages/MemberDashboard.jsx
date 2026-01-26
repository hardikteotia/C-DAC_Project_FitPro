import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Row, Col, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import { CreditCard, User, Calendar, CheckCircle, Lock } from 'lucide-react';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState([]);

    // Payment State
    const [showPayModal, setShowPayModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

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

    // ... Payment Handlers (Keep same as before) ...
    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(async () => {
            try {
                const amount = member.membershipPlan?.price || 1000;
                await api.post(`/payments?memberId=${member.id}&amount=${amount}&method=Credit Card`);
                setPaymentSuccess(true);
                setProcessing(false);
                setTimeout(() => {
                    setShowPayModal(false);
                    setPaymentSuccess(false);
                    setCardData({ number: '', expiry: '', cvv: '', name: '' });
                    fetchMemberData(); 
                }, 2000);
            } catch (err) {
                alert("Payment Failed: " + err.message);
                setProcessing(false);
            }
        }, 2000); 
    };

    const handleCardNumber = (e) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardData({ ...cardData, number: formatted });
    };

    if (loading) return <div className="text-center mt-5 text-white"><Spinner animation="border" variant="warning"/></div>;
    if (!member) return <Container className="text-center mt-5 text-white"><h3>Profile Not Found</h3></Container>;

    const todayStr = new Date().toISOString().split('T')[0];
    const isCheckedInToday = attendance.some(a => a.date === todayStr);

    // 👇 FILTER DUPLICATES & SORT (Shows unique dates only)
    const uniqueAttendance = [...new Map(attendance.map(item => [item.date, item])).values()]
                             .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort Newest First
                             .slice(0, 5); // Take top 5

    return (
        <div className="fade-in">
            {/* 👇 CUSTOM SCROLLBAR STYLE */}
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
                    {/* Membership Card */}
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
                                <div className="d-flex justify-content-between">
                                    <div><small className="text-secondary fw-bold">Expires</small><p className={member.endDate ? "text-white" : "text-danger"}>{member.endDate || "Expired"}</p></div>
                                    {!member.endDate && <Button size="sm" variant="gold" onClick={() => setShowPayModal(true)}>Renew</Button>}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Trainer Card */}
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

                    {/* 👇 ATTENDANCE CARD (UPDATED) */}
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

                {/* Mock Payment Modal */}
                <Modal show={showPayModal} onHide={() => !processing && setShowPayModal(false)} centered backdrop="static">
                    <Modal.Header closeButton={!processing} className="bg-light border-0">
                        <Modal.Title className="fw-bold d-flex align-items-center gap-2"><Lock size={20} className="text-success"/> Secure Payment</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light p-4">
                        {paymentSuccess ? (
                            <div className="text-center py-4"><CheckCircle size={60} className="text-success mb-3"/><h4 className="fw-bold text-success">Payment Successful!</h4></div>
                        ) : processing ? (
                            <div className="text-center py-5"><Spinner animation="border" variant="primary"/><h5 className="mt-3">Processing...</h5></div>
                        ) : (
                            <Form onSubmit={handlePayment}>
                                <div className="d-flex justify-content-between mb-4"><h5 className="fw-bold">Total</h5><h4 className="fw-bold">₹{member.membershipPlan?.price || 1000}</h4></div>
                                <Form.Group className="mb-3"><Form.Label className="small fw-bold text-secondary">CARD NUMBER</Form.Label><Form.Control value={cardData.number} onChange={handleCardNumber} maxLength="19" required/></Form.Group>
                                <Row><Col><Form.Control placeholder="MM/YY" required/></Col><Col><Form.Control placeholder="CVV" required/></Col></Row>
                                <Button variant="dark" type="submit" className="w-100 mt-4 fw-bold">Pay Now</Button>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    );
};

export default MemberDashboard;