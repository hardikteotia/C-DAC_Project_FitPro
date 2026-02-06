import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Container, Card, Table, Badge } from 'react-bootstrap';
import { Users, Activity, Mail } from 'lucide-react'; 

const TrainerDashboard = () => {
    const { user } = useAuth();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper: Calculate BMI and Status (Simulation for Demo)
    const getClientMetrics = (client) => {
        // Use real data if available, otherwise mock it for the presentation
        const weight = client.weight || Math.floor(Math.random() * (90 - 50) + 50); // Random 50-90kg
        const height = client.height || (Math.random() * (1.9 - 1.6) + 1.6).toFixed(2); // Random 1.6-1.9m
        
        const bmi = (weight / (height * height)).toFixed(1);
        
        let status = 'Normal';
        let color = 'success';
        
        if (bmi < 18.5) { status = 'Underweight'; color = 'info'; }
        else if (bmi >= 25 && bmi < 29.9) { status = 'Overweight'; color = 'warning'; }
        else if (bmi >= 30) { status = 'Obese'; color = 'danger'; }

        return { bmi, status, color };
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get Trainer Profile
                const resTrainers = await api.get('/trainers');
                const myProfile = resTrainers.data.find(t => 
                    (t.user && t.user.id == user.id) || 
                    (t.user && t.user.email === user.email)
                );
                
                if (myProfile) {
                    // Get Clients
                    try {
                        const resClients = await api.get('/trainers/dashboard/clients');
                        setTrainer({ ...myProfile, members: resClients.data });
                    } catch (clientErr) {
                        setTrainer({ ...myProfile, members: [] });
                    }
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    if (loading) return <div className="text-center mt-5 text-white">Loading...</div>;
    if (!trainer) return <div className="text-center mt-5 text-white">Trainer Profile Not Found</div>;

    return (
        <div className="fade-in">
            <Container className="py-5">
                {/* Header */}
                <div className="mb-4 text-white">
                    <h1 className="fw-bold">Coach <span className="text-warning">{trainer.trainerName}</span></h1>
                    <p className="text-secondary">Track your client's progress and membership status.</p>
                </div>

                {/* Client Roster Card */}
                <Card className="bg-dark border-secondary shadow-lg">
                    <Card.Header className="bg-transparent border-secondary py-3">
                        <h5 className="text-white m-0 d-flex align-items-center">
                            <Users size={20} className="text-warning me-2"/> My Active Clients
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <Table hover variant="dark" responsive className="mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th className="ps-4">Client Name</th>
                                    <th>BMI Health Check</th>
                                    <th>Membership Status</th>
                                    {/* 👇 Replaced Actions with Email Header */}
                                    <th className="text-end pe-4">Contact Email</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {trainer.members?.map(client => {
                                    const metrics = getClientMetrics(client);
                                    
                                    return (
                                        <tr key={client.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-white" style={{fontSize: '1.1rem'}}>
                                                    {client.name}
                                                </div>
                                            </td>
                                            
                                            {/* BMI Column */}
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <Activity size={18} className={`text-${metrics.color} me-2`}/>
                                                    <div>
                                                        <div className="fw-bold">{metrics.bmi}</div>
                                                        <Badge bg={metrics.color} style={{fontSize: '0.65rem'}}>
                                                            {metrics.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td>
                                                <Badge bg={client.endDate ? "success" : "danger"} className="px-2 py-1">
                                                    {client.endDate ? 'Active Member' : 'Plan Expired'}
                                                </Badge>
                                            </td>

                                            {/* 👇 New Email Column (Replaces Button) */}
                                            <td className="text-end pe-4">
                                                <span className="text-secondary d-flex justify-content-end align-items-center">
                                                    <Mail size={16} className="me-2"/>
                                                    {client.user?.email || "No Email"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {trainer.members?.length === 0 && (
                                    <tr><td colSpan="4" className="text-center py-4 text-secondary">No clients assigned yet.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default TrainerDashboard;