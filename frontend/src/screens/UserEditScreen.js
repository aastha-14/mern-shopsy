import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import Meta from '../components/Meta';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails);
    const { loading, user, error } = userDetails;
    const userUpdate = useSelector(state => state.updateUser);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate } = userUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            history.push('/admin/userlist');
        } else {
            if (!user || !user.name || user._id !== userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
            }
        }
    }, [user, history, dispatch, userId, successUpdate]);
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: user._id, name, email, isAdmin }));
    };
    return (
        <>
        <Meta title='Shopsy | Edit User' />
            <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger' children={errorUpdate} />}
                {loading
                    ? <Loader />
                    : error
                        ? <Message variant='danger' children={error} />
                        : (
                            <Form onSubmit={submitHandler}>
                                <Form.Group controlId='name'>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type='text'
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
                                <Form.Group controlId='isadmin'>
                                    <Form.Check
                                        type='checkbox'
                                        label='Is Admin'
                                        checked={isAdmin}
                                        onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                                </Form.Group>
                                <Button type='submit' variant='primary'>Update</Button>
                            </Form>
                        )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
