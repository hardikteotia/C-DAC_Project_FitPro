import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap'; 
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [trainers, setTrainers] = useState([]);
    
    // 1. New State for Validation Errors
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '', planId: '', trainerId: ''
    });

    useEffect(() => {
        // Fetch plans and trainers
        api.get('/public/plans').then(res => setPlans(res.data)).catch(err => console.log(err));
        api.get('/public/trainers').then(res => setTrainers(res.data)).catch(err => console.log(err));
    }, []);

    // 2. Validation Logic
    const validate = () => {
        let newErrors = {};

        // Email Validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!formData.email.includes('@')) {
            newErrors.email = "Invalid email: Must contain '@'";
        }

        // Phone Validation (Check if exactly 10 digits)
        if (!formData.phone) {
            newErrors.phone = "Phone is required";
        } else if (formData.phone.length !== 10) {
            newErrors.phone = "Phone number must be exactly 10 digits";
        }

        // Required Fields
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.password) newErrors.password = "Password is required";
        if (!formData.planId) newErrors.planId = "Please select a plan";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 3. Handle Input Changes (with Restrictions)
    const handleChange = (e) => {
        const { name, value } = e.target;

        // SPECIAL LOGIC FOR PHONE
        if (name === 'phone') {
            // Only allow numbers
            const numericValue = value.replace(/\D/g, ''); 
            
            // Stop typing if length > 10
            if (numericValue.length > 10) return; 

            setFormData({ ...formData, phone: numericValue });
        } 
        else {
            // Standard update for other fields
            setFormData({ ...formData, [name]: value });
        }

        // Clear error for this field if user is typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Run Validation
        if (!validate()) return;

        // 👇 Combine +91 with the phone number before sending
        const submissionData = {
            ...formData,
            phone: "+91" + formData.phone 
        };

        try {
            await api.post('/members/register', submissionData);
            alert('Registration Successful! Please Login.');
            navigate('/login');
        } catch (error) {
            alert('Registration Failed: ' + (error.response?.data?.message || 'Server Error'));
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{minHeight: '80vh'}}>
            <Card className="p-4 w-100" style={{maxWidth: '700px'}}>
                <Card.Body>
                    <h2 className="text-center text-warning fw-bold mb-4">Join FitPro</h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-3">
                            {/* Name Field */}
                            <Col md={6}>
                                <Form.Control 
                                    name="name" 
                                    placeholder="Full Name" 
                                    className={errors.name ? 'is-invalid' : ''}
                                    onChange={handleChange} 
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Col>

                            {/* Email Field */}
                            <Col md={6}>
                                <Form.Control 
                                    name="email" 
                                    type="email" 
                                    placeholder="Email" 
                                    className={errors.email ? 'is-invalid' : ''}
                                    onChange={handleChange} 
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Col>

                            {/* Password Field */}
                            <Col md={6}>
                                <Form.Control 
                                    name="password" 
                                    type="password" 
                                    placeholder="Password" 
                                    className={errors.password ? 'is-invalid' : ''}
                                    onChange={handleChange} 
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Col>

                            {/* Phone Field with +91 Prefix */}
                            <Col md={6}>
                                <div className="input-group has-validation">
                                    <span className="input-group-text bg-secondary text-white border-secondary">+91</span>
                                    <Form.Control 
                                        name="phone" 
                                        type="text"
                                        placeholder="9876543210" 
                                        maxLength="10" // Browser Stop Logic
                                        className={errors.phone ? 'is-invalid' : ''}
                                        value={formData.phone}
                                        onChange={handleChange} 
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
                                </div>
                            </Col>

                            {/* Address Field */}
                            <Col md={12}>
                                <Form.Control 
                                    name="address" 
                                    as="textarea" 
                                    rows={2} 
                                    placeholder="Address" 
                                    required 
                                    onChange={handleChange} 
                                />
                            </Col>

                            {/* Plan Selection */}
                            <Col md={6}>
                                <Form.Select 
                                    name="planId" 
                                    className={errors.planId ? 'is-invalid' : ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(p => <option key={p.id} value={p.id}>{p.planName} - ₹{p.price}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.planId}</Form.Control.Feedback>
                            </Col>

                            {/* Trainer Selection */}
                            <Col md={6}>
                                <Form.Select name="trainerId" onChange={handleChange}>
                                    <option value="">Select Trainer (Optional)</option>
                                    {trainers.map(t => <option key={t.id} value={t.id}>{t.trainerName} ({t.specialization})</option>)}
                                </Form.Select>
                            </Col>

                            {/* Submit Button */}
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