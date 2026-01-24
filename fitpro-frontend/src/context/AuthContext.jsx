import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Restore session from local storage
        const storedUser = localStorage.getItem('fitpro_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // 1. Call Login Endpoint
            const response = await api.post('/auth/login', { email, password });
            const responseString = response.data; // "LOGIN SUCCESS! Role: ADMIN"

            if (responseString.includes('LOGIN SUCCESS')) {
                // Parse Role
                const role = responseString.split('Role: ')[1];
                
                const userData = { email, role, id: null };

                // 2. Fetch User ID based on Role (Workaround for backend structure)
                if (role === 'MEMBER') {
                    const membersRes = await api.get('/members');
                    const myProfile = membersRes.data.find(m => m.user?.email === email);
                    if (myProfile) userData.id = myProfile.id;
                } 
                // Note: Admin doesn't need an ID for most operations
                
                setUser(userData);
                localStorage.setItem('fitpro_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: 'Invalid Credentials' };
            }
        } catch (error) {
            return { success: false, message: 'Login failed. Check server.' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('fitpro_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);