import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { Trash2, DollarSign, CheckSquare, Plus, Users, UserCheck, TrendingUp, Edit, Save, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
    // --------------------------------------------------------
    // STATE MANAGEMENT
    // --------------------------------------------------------
    const [stats, setStats] = useState({});
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [plans, setPlans] = useState([]); 

    // Modals
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null); 
    const [planForm, setPlanForm] = useState({ planName: '', price: '', durationInDays: '' });

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
    const [showEditMemberModal, setShowEditMemberModal] = useState(false);
    
    // Add Member Modal State
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [newMember, setNewMember] = useState({
        name: '', email: '', password: '', phone: '', address: '', planId: '', trainerId: ''
    });

    // Trainer/Member Data State
    const [newTrainer, setNewTrainer] = useState({ trainerName: '', email: '', password: '', phone: '', specialization: '' });
    const [editingTrainer, setEditingTrainer] = useState(null);
    const [editingMember, setEditingMember] = useState(null);

    // --------------------------------------------------------
    // API FETCHING
    // --------------------------------------------------------
    const fetchAll = async () => {
        try {
            const statsRes = await api.get('/admin/stats');
            setStats(statsRes.data);

            const membersRes = await api.get('/admin/members');
            setMembers(membersRes.data);

            const trainersRes = await api.get('/admin/trainers');
            setTrainers(trainersRes.data);

            const plansRes = await api.get('/plans');
            setPlans(plansRes.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    // --------------------------------------------------------
    // 👇 BULLETPROOF PAYMENT HANDLER (Manual URL Params)
    // --------------------------------------------------------
    const handlePayment = async (memberId, amount) => {
        console.log("--- Payment Debug ---");
        console.log("Member ID:", memberId);
        console.log("Amount:", amount);

        // 1. Validate Amount
        if (!amount || amount <= 0) {
            alert("❌ Error: This member has no valid plan price associated with them.\nPlease check if the member is assigned to a plan.");
            return;
        }

        if(confirm(`Confirm CASH payment of ₹${amount}?`)) {
            try {
                // 2. FORCE URL PARAMETERS
                // This manually constructs the URL so it matches Spring Boot's @RequestParam exactly.
                // URL will look like: /api/payments?memberId=1&amount=5000&method=Cash
                const url = `/payments?memberId=${memberId}&amount=${amount}&method=Cash`;

                // We send an empty body ({}) because all data is in the URL
                await api.post(url, {});

                alert("✅ Payment Recorded Successfully!");
                
                // 3. Refresh Data to show new Revenue immediately
                await fetchAll(); 
            } catch (e) { 
                console.error("Payment Error:", e);
                const errorMsg = e.response?.data?.message || e.response?.data || e.message;
                alert("❌ Payment Failed: " + errorMsg); 
            }
        }
    };

    // --------------------------------------------------------
    // OTHER HANDLERS
    // --------------------------------------------------------
    const handleCheckIn = async (memberId) => {
        try {
            await api.post(`/attendance?memberId=${memberId}&status=Present`);
            alert("Member Checked In ✅");
        } catch (e) { alert("Error checking in"); }
    };

    const handleDeleteMember = async (id) => {
        if(confirm("Delete this member?")) {
            try {
                await api.delete(`/admin/members/${id}`);
                alert("Member Deleted");
                fetchAll();
            } catch (e) { alert("Delete failed"); }
        }
    };

    const handleDeleteTrainer = async (id) => {
        if(confirm("Are you sure you want to fire this trainer?")) {
            try {
                await api.delete(`/admin/trainers/${id}`);
                alert("Trainer Deleted");
                fetchAll();
            } catch (e) { alert("Delete failed"); }
        }
    };
    
    const handleAddTrainer = async () => {
         try {
            await api.post('/trainers', newTrainer);
            alert("Trainer Added Successfully!");
            setShowTrainerModal(false);
            setNewTrainer({ trainerName: '', email: '', password: '', phone: '', specialization: '' });
            fetchAll();
        } catch (e) { 
            alert("Error adding trainer: " + (e.response?.status === 403 ? "Access Denied" : e.message)); 
        }
    };

    const handleAddMember = async () => {
        if (!newMember.planId) {
            alert("Please select a Membership Plan");
            return;
        }
        try {
            await api.post('/members/register', newMember); 
            alert("Member Added Successfully!");
            setShowAddMemberModal(false);
            setNewMember({ name: '', email: '', password: '', phone: '', address: '', planId: '', trainerId: '' });
            fetchAll();
        } catch (e) {
            alert("Error adding member: " + (e.response?.data?.message || e.message));
        }
    };
    
    // --- EDIT HANDLERS ---
    const openEditTrainer = (trainer) => {
        setEditingTrainer({
            id: trainer.id,
            trainerName: trainer.trainerName,
            phone: trainer.phone,
            specialization: trainer.specialization,
            email: trainer.user?.email || ''
        });
        setShowEditTrainerModal(true);
    };

    const handleUpdateTrainer = async () => {
        try {
            const payload = {
                trainerName: editingTrainer.trainerName,
                phone: editingTrainer.phone,
                specialization: editingTrainer.specialization,
                user: { email: editingTrainer.email }
            };
            await api.put(`/admin/trainers/${editingTrainer.id}`, payload);
            alert("Trainer Updated!");
            setShowEditTrainerModal(false);
            fetchAll();
        } catch (e) { alert("Update failed"); }
    };

    const openEditMember = (member) => {
        setEditingMember({
            id: member.id,
            name: member.name,
            phone: member.phone,
            address: member.address,
            email: member.user?.email || ''
        });
        setShowEditMemberModal(true);
    };

    const handleUpdateMember = async () => {
        try {
            const payload = {
                name: editingMember.name,
                phone: editingMember.phone,
                address: editingMember.address,
                user: { email: editingMember.email }
            };
            await api.put(`/admin/members/${editingMember.id}`, payload);
            alert("Member Updated!");
            setShowEditMemberModal(false);
            fetchAll();
        } catch (e) { alert("Update failed"); }
    };

    // --- PLAN HANDLERS ---
    const handleSavePlan = async () => {
        try {
            if (editingPlan) {
                await api.put(`/plans/${editingPlan.id}`, planForm);
                alert("Plan Updated!");
            } else {
                await api.post('/plans', planForm);
                alert("Plan Created!");
            }
            setShowPlanModal(false);
            setEditingPlan(null);
            setPlanForm({ planName: '', price: '', durationInDays: '' });
            fetchAll();
        } catch (e) { alert("Operation failed"); }
    };

    const handleDeletePlan = async (id) => {
        if(confirm("Delete this plan?")) {
            try {
                await api.delete(`/plans/${id}`);
                alert("Plan Deleted");
                fetchAll();
            } catch (e) { alert("Delete failed"); }
        }
    };

    const openPlanModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setPlanForm({
                planName: plan.planName,
                price: plan.price,
                durationInDays: plan.durationInDays
            });
        } else {
            setEditingPlan(null);
            setPlanForm({ planName: '', price: '', durationInDays: '' });
        }
        setShowPlanModal(true);
    };

    // --------------------------------------------------------
    // UI RENDER
    // --------------------------------------------------------
    return (
        <div className="fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-warning fw-bold">Admin Dashboard</h1>
                <div className="d-flex gap-2">
                    <Button variant="outline-light" onClick={() => openPlanModal(null)}>
                        <CreditCard size={20} className="me-2" /> Manage Plans
                    </Button>
                    <Button variant="outline-warning" onClick={() => setShowAddMemberModal(true)}>
                        <Plus size={20} className="me-2" /> Add Member
                    </Button>
                    <Button variant="gold" onClick={() => setShowTrainerModal(true)}>
                        <Plus size={20} className="me-2" /> Add Trainer
                    </Button>
                </div>
            </div>

            {/* STATS SECTION */}
            <Row className="g-4 mb-5">
                <Col md={4}>
                    <Card className="p-3 border-primary h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-primary bg-opacity-25 p-3 rounded-circle text-primary"><Users size={32} /></div>
                            <div><p className="text-secondary mb-0">Total Members</p><h3 className="text-white fw-bold m-0">{members.length}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 border-warning h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning"><UserCheck size={32} /></div>
                            <div><p className="text-secondary mb-0">Active Trainers</p><h3 className="text-white fw-bold m-0">{trainers.length}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 border-success h-100">
                        <Card.Body className="d-flex align-items-center gap-3">
                            <div className="bg-success bg-opacity-25 p-3 rounded-circle text-success"><TrendingUp size={32} /></div>
                            {/* REVENUE DISPLAY */}
                            <div><p className="text-secondary mb-0">Total Revenue</p><h3 className="text-success fw-bold m-0">₹{stats.totalRevenue || 0}</h3></div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>


            {/* MEMBER TABLE */}
             <Card className="mb-5">
                <Card.Header className="bg-transparent text-white fw-bold py-3 border-secondary">Member Management</Card.Header>
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
                                <td>{m.membershipPlan?.planName || "No Plan"}</td>
                                <td><Badge bg={m.endDate ? "success" : "danger"} className="bg-opacity-25 text-white">{m.endDate ? 'Active' : 'Pending'}</Badge></td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button size="sm" variant="outline-info" onClick={() => openEditMember(m)}><Edit size={16} /></Button>
                                        
                                        {/* PAYMENT BUTTON - Passes Plan Price */}
                                        <Button 
                                            size="sm" 
                                            variant="outline-success" 
                                            onClick={() => handlePayment(m.id, m.membershipPlan?.price)}
                                            title="Record Cash Payment"
                                        >
                                            <DollarSign size={16} />
                                        </Button>
                                        
                                        <Button size="sm" variant="outline-primary" onClick={() => handleCheckIn(m.id)}><CheckSquare size={16} /></Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteMember(m.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* TRAINER TABLE */}
            <Card>
                <Card.Header className="bg-transparent text-white fw-bold py-3 border-secondary">Trainer Staff</Card.Header>
                <Table hover responsive className="mb-0 align-middle">
                    <thead>
                        <tr>
                            <th className="bg-transparent text-warning ps-4">Trainer Name</th>
                            <th className="bg-transparent text-warning">Specialization</th>
                            <th className="bg-transparent text-warning">Phone</th>
                            <th className="bg-transparent text-warning text-end pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainers.map(t => (
                            <tr key={t.id}>
                                <td className="ps-4 fw-bold">{t.trainerName}</td>
                                <td><Badge bg="info" className="bg-opacity-25 text-info">{t.specialization}</Badge></td>
                                <td className="text-secondary">{t.phone}</td>
                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button size="sm" variant="outline-info" onClick={() => openEditTrainer(t)}><Edit size={16} /></Button>
                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteTrainer(t.id)}><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {/* TRAINER ADD MODAL */}
            <Modal show={showTrainerModal} onHide={() => setShowTrainerModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Add New Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.trainerName} onChange={e => setNewTrainer({...newTrainer, trainerName: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.email} onChange={e => setNewTrainer({...newTrainer, email: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.password} onChange={e => setNewTrainer({...newTrainer, password: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.phone} onChange={e => setNewTrainer({...newTrainer, phone: e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Specialization</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newTrainer.specialization} onChange={e => setNewTrainer({...newTrainer, specialization: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowTrainerModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleAddTrainer}>Save Trainer</Button>
                </Modal.Footer>
            </Modal>

            {/* TRAINER EDIT MODAL */}
            <Modal show={showEditTrainerModal} onHide={() => setShowEditTrainerModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Edit Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {editingTrainer && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.trainerName} onChange={e => setEditingTrainer({...editingTrainer, trainerName: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.email} onChange={e => setEditingTrainer({...editingTrainer, email: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.phone} onChange={e => setEditingTrainer({...editingTrainer, phone: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Specialization</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingTrainer.specialization} onChange={e => setEditingTrainer({...editingTrainer, specialization: e.target.value})} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowEditTrainerModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleUpdateTrainer}><Save size={18} className="me-2"/> Update</Button>
                </Modal.Footer>
            </Modal>

            {/* MEMBER EDIT MODAL */}
            <Modal show={showEditMemberModal} onHide={() => setShowEditMemberModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Edit Member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {editingMember && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.email} onChange={e => setEditingMember({...editingMember, email: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.phone} onChange={e => setEditingMember({...editingMember, phone: e.target.value})} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Address</Form.Label>
                                <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                    value={editingMember.address} onChange={e => setEditingMember({...editingMember, address: e.target.value})} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowEditMemberModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleUpdateMember}><Save size={18} className="me-2"/> Update</Button>
                </Modal.Footer>
            </Modal>

            {/* PLAN MODAL */}
            <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">
                        {editingPlan ? "Edit Plan" : "Manage Membership Plans"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    {!editingPlan && (
                        <>
                            <div className="mb-4">
                                <h5 className="text-warning">Existing Plans</h5>
                                <Table hover variant="dark" responsive>
                                    <thead>
                                        <tr>
                                            <th>Plan Name</th>
                                            <th>Price (₹)</th>
                                            <th>Duration (Days)</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map(plan => (
                                            <tr key={plan.id}>
                                                <td>{plan.planName}</td>
                                                <td>{plan.price}</td>
                                                <td>{plan.durationInDays}</td>
                                                <td className="text-end">
                                                    <Button size="sm" variant="outline-info" className="me-2" onClick={() => openPlanModal(plan)}>
                                                        <Edit size={14}/>
                                                    </Button>
                                                    <Button size="sm" variant="outline-danger" onClick={() => handleDeletePlan(plan.id)}>
                                                        <Trash2 size={14}/>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <hr className="border-secondary"/>
                            <h5 className="text-success mt-3">Create New Plan</h5>
                        </>
                    )}

                    <Form className="mt-3">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Plan Name</Form.Label>
                                    <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        placeholder="e.g. Diamond Plan"
                                        value={planForm.planName} onChange={e => setPlanForm({...planForm, planName: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control type="number" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        placeholder="e.g. 5000"
                                        value={planForm.price} onChange={e => setPlanForm({...planForm, price: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration (Days)</Form.Label>
                                    <Form.Control type="number" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        placeholder="e.g. 365"
                                        value={planForm.durationInDays} 
                                        onChange={e => setPlanForm({...planForm, durationInDays: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                     {editingPlan && <Button variant="secondary" onClick={() => openPlanModal(null)}>Back to List</Button>}
                    <Button variant="secondary" onClick={() => setShowPlanModal(false)}>Close</Button>
                    <Button variant="gold" onClick={handleSavePlan}>
                        {editingPlan ? "Update Plan" : "Create Plan"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* MEMBER ADD MODAL */}
            <Modal show={showAddMemberModal} onHide={() => setShowAddMemberModal(false)} centered>
                <Modal.Header closeButton className="bg-dark border-secondary">
                    <Modal.Title className="text-white">Add New Member</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone</Form.Label>
                                    <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newMember.password} onChange={e => setNewMember({...newMember, password: e.target.value})} />
                        </Form.Group>

                        <Row>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Plan</Form.Label>
                                    <Form.Select className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        value={newMember.planId} onChange={e => setNewMember({...newMember, planId: e.target.value})}>
                                        <option value="">-- Choose Plan --</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>{p.planName} (₹{p.price})</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                             </Col>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assign Trainer (Optional)</Form.Label>
                                    <Form.Select className="bg-secondary bg-opacity-10 border-secondary text-white"
                                        value={newMember.trainerId} onChange={e => setNewMember({...newMember, trainerId: e.target.value})}>
                                        <option value="">-- No Trainer --</option>
                                        {trainers.map(t => (
                                            <option key={t.id} value={t.id}>{t.trainerName}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                             </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control className="bg-secondary bg-opacity-10 border-secondary text-white"
                                value={newMember.address} onChange={e => setNewMember({...newMember, address: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowAddMemberModal(false)}>Cancel</Button>
                    <Button variant="gold" onClick={handleAddMember}>Save Member</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AdminDashboard;