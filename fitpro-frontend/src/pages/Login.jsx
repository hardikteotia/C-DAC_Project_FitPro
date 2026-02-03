import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap'; // 👈 Added Alert
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [creds, setCreds] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    
    // 👇 NEW: State to store validation errors
    const [errors, setErrors] = useState({});

    // 👇 NEW: Validation Logic
    const validate = () => {
        let newErrors = {};
        
        // 1. Email Validation (Must contain '@')
        if (!creds.email) {
            newErrors.email = "Email is required";
        } else if (!creds.email.includes('@')) {
            newErrors.email = "Invalid email: Must contain '@'";
        }

        // 2. Password Validation (Optional: Check length)
        if (!creds.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        // Return TRUE if no errors
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 👇 Run validation before submitting
        if (!validate()) return; 

        const result = await login(creds.email, creds.password);
        
        if (result.success) {
            const storedUser = JSON.parse(localStorage.getItem('fitpro_user'));
            if (storedUser.role === 'ADMIN') navigate('/admin');
            else if (storedUser.role === 'TRAINER') navigate('/trainer');
            else navigate('/dashboard');
        } else {
            alert(result.message);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}>
            <Card className="bg-dark border-secondary p-4 w-100 shadow-lg" style={{maxWidth: '400px'}}>
                <Card.Body>
                    <h2 className="text-center text-white fw-bold mb-2">Welcome Back</h2>
                    <p className="text-center text-secondary mb-4">Access your dashboard</p>
                    
                    <Form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="email" 
                                placeholder="Email" 
                                className={`bg-dark text-white border-secondary ${errors.email ? 'is-invalid' : ''}`} // 👈 Highlight red on error
                                value={creds.email}
                                onChange={e => {
                                    setCreds({...creds, email: e.target.value});
                                    if(errors.email) setErrors({...errors, email: null}); // Clear error when typing
                                }} 
                            />
                            {/* 👇 Show Error Message */}
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* Password Input */}
                        <Form.Group className="mb-2 position-relative">
                            <Form.Control 
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" 
                                className={`bg-dark text-white border-secondary ${errors.password ? 'is-invalid' : ''}`}
                                style={{ paddingRight: '45px' }}
                                value={creds.password}
                                onChange={e => setCreds({...creds, password: e.target.value})} 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn position-absolute top-50 end-0 translate-middle-y text-secondary border-0"
                                style={{ zIndex: 5, paddingRight: '12px' }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-flex justify-content-end mb-4">
                            <Link to="/forgot-password" style={{ color: '#ffc107', textDecoration: 'none', fontSize: '0.9rem' }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <Button variant="gold" type="submit" className="w-100 py-2 fw-bold">Login</Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;