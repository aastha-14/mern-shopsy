import Axios from 'axios';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_DETAILS_RESET,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await Axios.post(
            '/api/users/login',
            { email, password },
            config);
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        dispatch({
            type: USER_LOGIN_FAIL,
            payload: message

        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.clear();
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: ORDER_LIST_MY_RESET });

    document.location.href = '/login';
};

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await Axios.post(
            '/api/users',
            { name, email, password },
            config);
        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
                error.response.data.errors
                    ? error.response.data.errors.email
                        || error.response.data.errors.name
                        || error.response.data.errors.password
                        ? `${error.response.data.errors.email.message}  ${error.response.data.errors.name.message} ${error.response.data.errors.password.message}`
                        : error.response.data.errors
                    : null
        });
    }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await Axios.get(`/api/users/${id}`, config);
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        if (message === 'No authorization, token failed'
            || 'No authorization, no token') {
            dispatch(logout());
        }
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: message
        });
    }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_REQUEST });
        const { userLogin: { userInfo } } = getState();
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        const { data } = await Axios.put('/api/users/profile', user, config);
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message = error.response && error.response.data.message
            ? error.response.data.message
            : error.message;

        if (message === 'No authorization, token failed'
            || 'No authorization, no token') {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: message
        });

    }
};