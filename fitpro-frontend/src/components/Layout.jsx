import Navbar from './Navbar';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <Container className="py-5 flex-grow-1">
                {children}
            </Container>
        </div>
    );
};

export default Layout;