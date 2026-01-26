import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Row, Col, Button, Badge, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { CreditCard, User, Calendar, Activity, CheckCircle, Lock } from 'lucide-react';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Payment Modal State
    const [showPayModal, setShowPayModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    
    // Fake Card Data
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });

    const fetchMemberData = async () => {
        try {
            // Fetch all members and find ME (Member ID linking logic)
            const res = await api.get('/members'); // Or a specific /members/me endpoint if you have it
            const myProfile = res.data.find(m => m.user?.email === user.email);
            setMember(myProfile);
        } catch (err) {
            console.error("Error loading profile", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchMemberData();
    }, [user]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // 1. SIMULATE NETWORK DELAY (The "Fake" Gateway)
        setTimeout(async () => {
            try {
                // 2. Call Backend to Record Payment
                // We assume the plan price is the amount
                const amount = member.membershipPlan?.price || 1000;
                
                await api.post(`/payments?memberId=${member.id}&amount=${amount}&method=Credit Card`);
                
                setPaymentSuccess(true);
                setProcessing(false);
                
                // Close modal after showing success
                setTimeout(() => {
                    setShowPayModal(false);
                    setPaymentSuccess(false);
                    setCardData({ number: '', expiry: '', cvv: '', name: '' });
                    fetchMemberData(); // Refresh to show "Active"
                }, 2000);

            } catch (err) {
                alert("Payment Failed: " + err.message);
                setProcessing(false);
            }
        }, 2000); // 2 second delay
    };

    // Format Card Number with spaces
    const handleCardNumber = (e) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardData({ ...cardData, number: formatted });
    };

    if (loading) return <div className="text-center mt-5 text-white"><Spinner animation="border" variant="warning"/></div>;
    
    if (!member) return (
        <Container className="text-center mt-5 text-white">
            <h3>Profile Not Found</h3>
            <p>Please contact admin to link your account.</p>
        </Container>
    );

    return (
        <div className="fade-in">
            <Container className="py-5">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="fw-bold text-white">Hello, <span className="text-warning">{member.name}</span></h1>
                        <p className="text-secondary">Welcome to your fitness dashboard.</p>
                    </div>
                    <Badge bg={member.endDate ? "success" : "danger"} className="px-3 py-2 fs-6">
                        {member.endDate ? "Active Member" : "Membership Expired"}
                    </Badge>
                </div>

                <Row className="g-4">
                    {/* Membership Card */}
                    <Col md={6}>
                        <Card className="bg-dark border-secondary text-white h-100 shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3">
                                <h5 className="m-0 d-flex align-items-center gap-2">
                                    <CreditCard size={20} className="text-warning"/> Membership Details
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-4">
                                    <small className="text-secondary text-uppercase fw-bold">Current Plan</small>
                                    <h3 className="fw-bold text-white">{member.membershipPlan?.planName || "No Plan"}</h3>
                                    <h5 className="text-success">₹{member.membershipPlan?.price || 0} / month</h5>
                                </div>
                                
                                <Row>
                                    <Col xs={6}>
                                        <small className="text-secondary text-uppercase fw-bold">Joined Date</small>
                                        <p className="fw-bold">{member.startDate || "N/A"}</p>
                                    </Col>
                                    <Col xs={6}>
                                        <small className="text-secondary text-uppercase fw-bold">Expires On</small>
                                        <p className={member.endDate ? "fw-bold text-white" : "fw-bold text-danger"}>
                                            {member.endDate || "Expired"}
                                        </p>
                                    </Col>
                                </Row>

                                {!member.endDate && (
                                    <Button variant="gold" className="w-100 mt-3 fw-bold" onClick={() => setShowPayModal(true)}>
                                        Pay Now & Renew
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Trainer Card */}
                    <Col md={6}>
                        <Card className="bg-dark border-secondary text-white h-100 shadow-lg">
                            <Card.Header className="bg-transparent border-secondary py-3">
                                <h5 className="m-0 d-flex align-items-center gap-2">
                                    <User size={20} className="text-warning"/> Your Trainer
                                </h5>
                            </Card.Header>
                            <Card.Body className="d-flex flex-column justify-content-center">
                                {member.trainer ? (
                                    <div className="text-center">
                                        <div className="bg-secondary bg-opacity-25 p-4 rounded-circle d-inline-block mb-3">
                                            <Activity size={40} className="text-info"/>
                                        </div>
                                        <h4>{member.trainer.trainerName}</h4>
                                        <Badge bg="info" className="bg-opacity-25 text-info mb-3">{member.trainer.specialization}</Badge>
                                        <p className="text-secondary m-0">{member.trainer.phone}</p>
                                    </div>
                                ) : (
                                    <div className="text-center text-secondary py-5">
                                        <p>No trainer assigned yet.</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* 👇 MOCK PAYMENT GATEWAY MODAL */}
                <Modal show={showPayModal} onHide={() => !processing && setShowPayModal(false)} centered backdrop="static">
                    <Modal.Header closeButton={!processing} className="bg-light border-0">
                        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                            <Lock size={20} className="text-success"/> Secure Payment
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-light p-4">
                        {paymentSuccess ? (
                            <div className="text-center py-4">
                                <CheckCircle size={60} className="text-success mb-3 fade-in"/>
                                <h4 className="fw-bold text-success">Payment Successful!</h4>
                                <p className="text-secondary">Redirecting back to dashboard...</p>
                            </div>
                        ) : processing ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" className="mb-3"/>
                                <h5>Processing Payment...</h5>
                                <p className="text-secondary small">Please do not close this window.</p>
                            </div>
                        ) : (
                            <Form onSubmit={handlePayment}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="m-0 fw-bold">Total Due</h5>
                                    <h4 className="m-0 fw-bold">₹{member.membershipPlan?.price || 1000}</h4>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-secondary">CARD NUMBER</Form.Label>
                                    <Form.Control type="text" placeholder="0000 0000 0000 0000" 
                                        className="py-2 letter-spacing-2"
                                        maxLength="19"
                                        value={cardData.number} onChange={handleCardNumber} required />
                                </Form.Group>

                                <Row>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">EXPIRY</Form.Label>
                                            <Form.Control type="text" placeholder="MM/YY" maxLength="5" required 
                                                value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small fw-bold text-secondary">CVV</Form.Label>
                                            <Form.Control type="password" placeholder="123" maxLength="3" required 
                                                value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-bold text-secondary">CARD HOLDER NAME</Form.Label>
                                    <Form.Control type="text" placeholder="JOHN DOE" required 
                                        value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})}/>
                                </Form.Group>

                                <Button variant="dark" type="submit" className="w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2">
                                    Pay ₹{member.membershipPlan?.price || 1000} Securely
                                </Button>
                                
                                <div className="text-center mt-3">
                                    <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                                        <Lock size={12}/> Encrypted with 256-bit SSL
                                    </small>
                                </div>
                            </Form>
                        )}
                    </Modal.Body>
                </Modal>

            </Container>
        </div>
    );
};

export default MemberDashboard;