import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { Trash2, DollarSign, CheckSquare } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);

    const fetchAll = () => {
        api.get('/admin/stats').then(res => setStats(res.data));
        api.get('/admin/members').then(res => setMembers(res.data));
        api.get('/admin/trainers').then(res => setTrainers(res.data));
    };

    useEffect(() => fetchAll(), []);

    const handlePayment = async (memberId, amount) => {
        if(confirm(`Record payment of ₹${amount}?`)) {
            await api.post(`/payments?memberId=${memberId}&amount=${amount}&method=Cash`);
            fetchAll();
            alert("Payment Recorded");
        }
    };

    const handleCheckIn = async (memberId) => {
        try {
            await api.post(`/attendance?memberId=${memberId}&status=Present`);
            alert("Member Checked In");
        } catch (e) { alert("Error checking in"); }
    };

    return (
        <div className="d-flex flex-column gap-5">
            <h1 className="text-warning fw-bold">Admin Dashboard</h1>

            {/* Stats */}
            <Row className="g-4">
                <Col md={4}>
                    <Card className="p-3">
                        <Card.Body>
                            <p className="text-secondary mb-1">Total Members</p>
                            <h2 className="text-white display-5 fw-bold">{stats.totalMembers || 0}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3">
                        <Card.Body>
                            <p className="text-secondary mb-1">Total Trainers</p>
                            <h2 className="text-white display-5 fw-bold">{stats.trainersCount || trainers.length}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3">
                        <Card.Body>
                            <p className="text-secondary mb-1">Total Revenue</p>
                            <h2 className="text-success display-5 fw-bold">₹{stats.totalRevenue || 0}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Member Management */}
            <Card>
                <Card.Header className="bg-transparent text-white fw-bold py-3">Member Management</Card.Header>
                <Table hover responsive className="mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-warning ps-4">Name</th>
                            <th className="bg-transparent text-warning">Plan</th>
                            <th className="bg-transparent text-warning">Status</th>
                            <th className="bg-transparent text-warning">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m => (
                            <tr key={m.id}>
                                <td className="ps-4">
                                    <div className="fw-bold">{m.name}</div>
                                    <small className="text-secondary">{m.user?.email}</small>
                                </td>
                                <td>{m.membershipPlan?.planName}</td>
                                <td>
                                    <Badge bg={m.endDate ? "success" : "danger"} className="bg-opacity-25 text-white">
                                        {m.endDate ? 'Active' : 'Pending Payment'}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="outline-success" onClick={() => handlePayment(m.id, m.membershipPlan?.price)}>
                                            <DollarSign size={16} />
                                        </Button>
                                        <Button size="sm" variant="outline-primary" onClick={() => handleCheckIn(m.id)}>
                                            <CheckSquare size={16} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </div>
    );
};

export default AdminDashboard;