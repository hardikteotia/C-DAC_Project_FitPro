import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <BsNavbar expand="lg" className="border-bottom border-secondary bg-opacity-10" style={{backgroundColor: '#1e293b'}}>
            <Container>
                <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 text-warning fw-bold fs-4">
                    <Dumbbell size={32} /> FITPRO
                </BsNavbar.Brand>
                
                <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="bg-secondary" />
                
                <BsNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center gap-3">
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                                <Button as={Link} to="/register" variant="gold">Join Now</Button>
                            </>
                        ) : (
                            <>
                                <span className="text-secondary small d-none d-lg-block">Hello, {user.email}</span>
                                <Nav.Link as={Link} to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-light d-flex align-items-center gap-1">
                                    <User size={18} /> Dashboard
                                </Nav.Link>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-1">
                                    <LogOut size={16} /> Logout
                                </Button>
                            </>
                        )}
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    );
};

export default Navbar;