import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Row, Col, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { Users, Phone, Mail, Award, Dumbbell } from 'lucide-react';

const TrainerDashboard = () => {
    const { user } = useAuth();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [debugMsg, setDebugMsg] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Basic Profile Info (Name, Phone, etc.)
                const resTrainers = await api.get('/trainers');
                const allTrainers = resTrainers.data;

                // Find "Me" in the list
                const myProfile = allTrainers.find(t => 
                    (t.user && t.user.id == user.id) || 
                    (t.user && t.user.email === user.email)
                );
                
                if (myProfile) {
                    // 2. 👇 FETCH CLIENTS (This calls the new endpoint!)
                    try {
                        const resClients = await api.get('/trainers/dashboard/clients');
                        
                        // Merge the Profile info + The Client List
                        setTrainer({
                            ...myProfile,
                            members: resClients.data 
                        });
                    } catch (clientErr) {
                        console.error("Could not fetch clients:", clientErr);
                        // Fallback: Show profile but empty client list
                        setTrainer({ ...myProfile, members: [] });
                    }
                } else {
                    setDebugMsg("Could not link your Login ID to a Trainer Profile.");
                }

            } catch (err) {
                console.error("Error fetching trainer data:", err);
                setDebugMsg("Server Error: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboardData();
    }, [user]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="warning" />
            <span className="ms-3 text-white">Loading Dashboard...</span>
        </div>
    );

    if (!trainer) return (
        <Container className="text-center mt-5 text-white">
            <h3 className="text-danger fw-bold">Trainer Profile Not Found</h3>
            <p className="text-secondary">We could not find a Trainer profile linked to your account.</p>
            {debugMsg && <Alert variant="dark" className="mt-3 text-warning">{debugMsg}</Alert>}
        </Container>
    );

    return (
        <div className="fade-in">
            <Container className="py-4">
                {/* Welcome Section */}
                <div className="mb-4 text-white">
                    <h1 className="fw-bold"><span className="text-warning">Coach</span> {trainer.trainerName}</h1>
                    <p className="text-secondary">Track your clients' progress and schedule.</p>
                </div>

                <Row className="g-4 mb-4">
                    {/* Stats Card */}
                    <Col md={4}>
                        <Card className="bg-dark border-secondary text-white h-100">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="p-3 rounded-circle bg-warning bg-opacity-10">
                                    <Users size={32} className="text-warning" />
                                </div>
                                <div>
                                    <h2 className="mb-0 fw-bold">{trainer.members ? trainer.members.length : 0}</h2>
                                    <span className="text-secondary">Active Clients</span>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {/* Info Card */}
                    <Col md={8}>
                        <Card className="bg-dark border-secondary text-white h-100">
                            <Card.Body>
                                <h5 className="card-title text-warning mb-3">Professional Details</h5>
                                <div className="d-flex gap-4 flex-wrap">
                                    <div className="d-flex align-items-center gap-2">
                                        <Mail size={18} className="text-secondary" /> {trainer.user?.email || user.email}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Phone size={18} className="text-secondary" /> {trainer.phone}
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Award size={18} className="text-secondary" /> {trainer.specialization}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Clients List */}
                <Card className="bg-dark border-secondary">
                    <Card.Header className="bg-transparent border-secondary text-white fw-bold py-3 d-flex align-items-center gap-2">
                        <Dumbbell size={20} className="text-warning"/> My Clients
                    </Card.Header>
                    <Table hover variant="dark" responsive className="mb-0">
                        <thead>
                            <tr>
                                <th className="text-secondary ps-4">Client Name</th>
                                <th className="text-secondary">Contact</th>
                                <th className="text-secondary">Current Plan</th>
                                <th className="text-secondary">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainer.members && trainer.members.length > 0 ? (
                                trainer.members.map(client => (
                                    <tr key={client.id}>
                                        <td className="ps-4 fw-bold text-white">
                                            {client.name}
                                        </td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <small className="text-light">{client.user?.email || 'N/A'}</small>
                                                <small className="text-secondary" style={{fontSize: '0.75rem'}}>{client.phone}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg="secondary" className="bg-opacity-25 text-warning border border-warning border-opacity-25">
                                                {client.membershipPlan?.planName || 'No Plan'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={client.endDate ? "success" : "danger"} className="bg-opacity-75">
                                                {client.endDate ? 'Active' : 'Expired'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-secondary">
                                        <div className="opacity-50 mb-2"><Users size={40} /></div>
                                        <p>No clients assigned yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card>
            </Container>
        </div>
    );
};

export default TrainerDashboard;