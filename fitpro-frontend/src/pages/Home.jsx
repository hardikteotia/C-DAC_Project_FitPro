import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Home = () => {
    const [plans, setPlans] = useState([]);
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        api.get('/public/plans').then(res => setPlans(res.data));
        api.get('/public/trainers').then(res => setTrainers(res.data));
    }, []);

    return (
        <div className="d-flex flex-column gap-5">
            {/* Hero Section */}
            <section className="text-center py-5">
                <h1 className="display-3 fw-bold text-warning mb-3">TRANSFORM YOUR BODY</h1>
                <p className="lead text-secondary mx-auto" style={{maxWidth: '600px'}}>
                    Join FitPro today. Professional trainers, flexible plans, and real results.
                </p>
            </section>

            {/* Plans Section */}
            <section>
                <h2 className="text-white fw-bold mb-4 border-start border-4 border-warning ps-3">Membership Plans</h2>
                <Row className="g-4">
                    {plans.map(plan => (
                        <Col key={plan.id} md={4}>
                            <Card className="h-100 text-center p-3 border-0 shadow">
                                <Card.Body>
                                    <h3 className="text-warning fw-bold">{plan.planName}</h3>
                                    <h2 className="text-white display-4 fw-bold my-3">₹{plan.price}</h2>
                                    <p className="text-secondary mb-4">Duration: {plan.durationInDays} Days</p>
                                    <Button variant="outline-gold" className="w-100 py-2">Choose Plan</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {/* Trainers Section */}
            <section>
                <h2 className="text-white fw-bold mb-4 border-start border-4 border-warning ps-3">Expert Trainers</h2>
                <Row className="g-4">
                    {trainers.map(trainer => (
                        <Col key={trainer.id} sm={6} lg={3}>
                            <Card className="h-100 text-center p-2">
                                <Card.Body>
                                    <div className="rounded-circle bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-center mx-auto mb-3 fw-bold fs-3" 
                                         style={{width: '80px', height: '80px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        {trainer.trainerName.charAt(0)}
                                    </div>
                                    <Card.Title className="text-white fw-bold">{trainer.trainerName}</Card.Title>
                                    <Card.Subtitle className="text-warning small text-uppercase">{trainer.specialization}</Card.Subtitle>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default Home;