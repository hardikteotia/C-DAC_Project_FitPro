import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap'; 
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', planId: '', trainerId: ''
    });

    useEffect(() => {
        // Fetch plans and trainers
        api.get('/public/plans').then(res => setPlans(res.data)).catch(err => console.log(err));
        api.get('/public/trainers').then(res => setTrainers(res.data)).catch(err => console.log(err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/members/register', formData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (error) {
            alert('Registration Failed: ' + (error.response?.data?.message || 'Server Error'));
        }
    };

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    // SAFE MODE: Using standard <div> instead of <Container> to prevent crashes
    return (
        <div className="container d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <Card className="p-4 w-100" style={{maxWidth: '700px'}}>
                <Card.Body>
                    <h2 className="text-center text-warning fw-bold mb-4">Join FitPro</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Control name="name" placeholder="Full Name" required onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="email" type="email" placeholder="Email" required onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="password" type="password" placeholder="Password" required onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Control name="phone" placeholder="Phone" required onChange={handleChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Control name="address" as="textarea" rows={2} placeholder="Address" required onChange={handleChange} />
                            </Col>
                            <Col md={6}>
                                <Form.Select name="planId" required onChange={handleChange}>
                                    <option value="">Select Plan</option>
                                    {plans.map(p => <option key={p.id} value={p.id}>{p.planName} - ₹{p.price}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={6}>
                                <Form.Select name="trainerId" onChange={handleChange}>
                                    <option value="">Select Trainer (Optional)</option>
                                    {trainers.map(t => <option key={t.id} value={t.id}>{t.trainerName} ({t.specialization})</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={12}>
                                <Button variant="gold" type="submit" className="w-100 py-2 mt-2">Register Now</Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;