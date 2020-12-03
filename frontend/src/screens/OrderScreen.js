import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';

function OrderScreen({ match }) {
    const orderId = match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, error, loading } = orderDetails;

    const orderPay = useSelector(state => state.orderPay);
    const { success: successPay, loading: loadingPay } = orderPay;

    useEffect(() => {
        // adding PayPal script dynamically
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=INR`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            script.onerror = () => { console.log('error'); };
            document.body.appendChild(script);
        };
        if (!order || successPay || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [dispatch, orderId, successPay, order]);

    if (!loading && order) {
        // calculate price
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };
        order.itemsPrice = addDecimals(order.orderItems.reduce(
            (total, item) => total + item.price * item.qty
            , 0));
    }
    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
    };
    return loading
        ? <Loader />
        : order
            ? error
                ? (<Message variant='danger' children={error} />
                ) : (
                    <>
                        <h1>Order {order._id}</h1>
                        <Row>
                            <Col md={8}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h2>Shipping</h2>
                                        <p>
                                            <strong>Name: {order.user.name}</strong>
                                        </p>
                                        <p>
                                            <a href={`mailto: ${order.user.email}`}>Email: {order.user.email}</a>
                                        </p>
                                        <p>
                                            <strong>Address: </strong>
                                            {order.shippingAddress.address},
                                            {order.shippingAddress.city},
                                            {order.shippingAddress.postalCode},
                                            {order.shippingAddress.country}
                                        </p>
                                        {order.isPaid
                                            ? order.isDelivered
                                                ? <Message variant='success' children={`Paid on ${order.deliveredAt}`} />
                                                : <Message variant='danger' children='Not Delivered' />
                                            : <Message variant='danger' children='Complete the payment for delivery' />}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <h2>Payment Method</h2>
                                        <p>
                                            <strong>Method: </strong>
                                            {order.paymentMethod}
                                        </p>
                                        {order.isPaid
                                            ? <Message variant='success' children={`Paid on ${order.paidAt}`} />
                                            : <Message variant='danger' children='Not Paid' />}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <h2>Order Items</h2>
                                        {order.orderItems.length === 0
                                            ? <Message children='Order is empty' />
                                            : (
                                                <ListGroup.Item variant='flush'>
                                                    {order.orderItems.map((item, index) =>
                                                        <ListGroup.Item key={index}>
                                                            <Row>
                                                                <Col md={1}>
                                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                                </Col>
                                                                <Col>
                                                                    <Link to={`/product/${item.product}`}>
                                                                        {item.name}
                                                                    </Link>
                                                                </Col>
                                                                <Col md={4}>
                                                                    {item.qty} x {item.price} =₹{item.qty * item.price}
                                                                </Col>
                                                            </Row>
                                                        </ListGroup.Item>
                                                    )}
                                                </ListGroup.Item>
                                            )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={4}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <h2>Order Summary</h2>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Items</Col>
                                                <Col>₹{order.itemsPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping</Col>
                                                <Col>₹{order.shippingPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax</Col>
                                                <Col>₹{order.taxPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Total</Col>
                                                <Col>₹{order.totalPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {!order.isPaid && (
                                            <ListGroup.Item>
                                                {loadingPay && <Loader />}
                                                {!sdkReady ? (
                                                    <Loader />
                                                ) : (
                                                        <PayPalButton
                                                            currency='INR'
                                                            amount={order.totalPrice}
                                                            onSuccess={successPaymentHandler}
                                                        />
                                                    )}
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : <>{console.log('No order')}</>;
}

export default OrderScreen;
