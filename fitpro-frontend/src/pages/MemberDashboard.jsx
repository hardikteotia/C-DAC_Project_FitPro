import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Calendar, CreditCard, User, Activity } from 'lucide-react';

const MemberDashboard = () => {
    const { user } = useAuth();
    const [member, setMember] = useState(null);
    const [payments, setPayments] = useState([]);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        if (user?.id) {
            api.get(`/members/${user.id}`).then(res => setMember(res.data));
            api.get(`/payments/${user.id}`).then(res => setPayments(res.data));
            api.get(`/attendance/member/${user.id}`).then(res => setAttendance(res.data));
        }
    }, [user]);

    if (!member) return <div className="text-white text-center mt-5">Loading Profile...</div>;

    const isActive = new Date(member.endDate) > new Date();

    return (
        <Row className="g-4">
            {/* Left Column: Profile */}
            <Col lg={4}>
                <Card className="text-center p-3 h-100">
                    <Card.Body>
                        <div className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-center mx-auto mb-3" 
                             style={{width: '100px', height: '100px'}}>
                            <User size={48} className="text-warning" />
                        </div>
                        <h3 className="text-white fw-bold">{member.name}</h3>
                        <p className="text-secondary">{member.user?.email}</p>
                        
                        <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-25 py-2 mt-3">
                            <span className="text-secondary">Plan</span>
                            <span className="text-warning fw-bold">{member.membershipPlan?.planName}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom border-secondary border-opacity-25 py-2">
                            <span className="text-secondary">Trainer</span>
                            <span className="text-white">{member.trainer ? member.trainer.trainerName : 'None'}</span>
                        </div>
                        <div className="d-flex justify-content-between py-2">
                            <span className="text-secondary">Status</span>
                            <Badge bg={isActive ? "success" : "danger"}>{isActive ? 'Active' : 'Expired'}</Badge>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* Right Column: Stats & History */}
            <Col lg={8}>
                <div className="d-flex flex-column gap-4">
                    {/* Validity Card */}
                    <Card>
                        <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                            <Calendar className="text-warning" size={20} /> Subscription Validity
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={6} className="text-center border-end border-secondary border-opacity-25">
                                    <small className="text-secondary text-uppercase">Start Date</small>
                                    <h5 className="text-white font-monospace mt-1">{member.startDate || 'N/A'}</h5>
                                </Col>
                                <Col xs={6} className="text-center">
                                    <small className="text-secondary text-uppercase">End Date</small>
                                    <h5 className="text-warning font-monospace mt-1">{member.endDate || 'N/A'}</h5>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Attendance Log */}
                    <Card>
                        <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                            <Activity className="text-warning" size={20} /> Attendance Log
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex flex-wrap gap-2">
                                {attendance.map(record => (
                                    <Badge key={record.id} bg="success" className="bg-opacity-25 text-success border border-success px-3 py-2 font-monospace">
                                        {record.date}
                                    </Badge>
                                ))}
                                {attendance.length === 0 && <span className="text-secondary">No attendance recorded.</span>}
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Payment History */}
                    <Card>
                        <Card.Header className="bg-transparent border-0 text-white fw-bold d-flex align-items-center gap-2">
                            <CreditCard className="text-warning" size={20} /> Payment History
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0">
                                <thead>
                                    <tr>
                                        <th className="bg-transparent text-secondary ps-4">Date</th>
                                        <th className="bg-transparent text-secondary">Amount</th>
                                        <th className="bg-transparent text-secondary">Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map(pay => (
                                        <tr key={pay.id}>
                                            <td className="ps-4 font-monospace">{pay.paymentDate}</td>
                                            <td className="text-success fw-bold">₹{pay.amount}</td>
                                            <td className="text-secondary">{pay.paymentMethod}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </Col>
        </Row>
    );
};

export default MemberDashboard;