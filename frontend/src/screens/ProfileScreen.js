import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, Form, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
const ProfileScreen = ({ location, history }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [matchPassword, setMatchPassword] = useState('');
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    // User Details state
    const userDetails = useSelector(state => state.userDetails);
    const { loading, user, error } = userDetails;
    // User Login state
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    // update user profile state
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success } = userUpdateProfile;
    // my order list state
    const orderListMy = useSelector(state => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        } else {
            if (!user || !user.name || success) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET });
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, userInfo, user, success]);
    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== matchPassword) {
            setMessage('Passwords do not match');
        } else {
            dispatch(updateUserProfile({ id: user._id, name, email, password }));
        }
    };
    return (
        <>
            <Meta title='Shopsy | User Profile' />
            <Row>
                <Col md={3}>
                    <h2>User Profile</h2>
                    {error && <Message variant='danger' children={error} />}
                    {message && <Message variant='danger' children={message} />}
                    {success && <Message variant='success' children={'Profile Updated'} />}
                    {loading && <Loader />}
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='email'>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId='matchPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='Confirm password'
                                value={matchPassword}
                                onChange={(e) => setMatchPassword(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button type='submit' variant='primary'>Update</Button>
                    </Form>
                </Col>
                <Col md={9}>
                    <h2>My Orders</h2>
                    {loadingOrders ? (
                        <Loader />
                    ) : errorOrders ? (
                        <Message variant='danger' children={errorOrders} />
                    ) : (
                                <Table striped bordered hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>DATE</th>
                                            <th>TOTAL</th>
                                            <th>PAID</th>
                                            <th>DELIVERED</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders && orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>{order._id}</td>
                                                <td>{order.createdAt.substring(0, 10)}</td>
                                                <td>{order.totalPrice}</td>
                                                <td>
                                                    {order.isPaid ? (
                                                        order.paidAt && order.paidAt.substring(0, 10)
                                                    ) : (
                                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                        )}
                                                </td>
                                                <td>
                                                    {order.isDelivered ? (
                                                        order.deliveredAt && order.deliveredAt.substring(0, 10)
                                                    ) : (
                                                            <i className='fas fa-times' style={{ color: 'red' }}></i>
                                                        )}
                                                </td>
                                                <td>
                                                    <LinkContainer to={`/order/${order._id}`}>
                                                        <Button className='btn-sm' variant='light'>
                                                            Details
                                                </Button>
                                                    </LinkContainer>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                </Col>
            </Row>
        </>
    );
};

export default ProfileScreen;