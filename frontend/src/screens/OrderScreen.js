import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrderDetails } from '../actions/orderActions';

function OrderScreen({ match }) {
    const orderId = match.params.id;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!order || order.id !== orderId) {
            dispatch(getOrderDetails(orderId));
        }
    }, [dispatch, orderId]);

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, error, loading } = orderDetails;



    if (!loading && order) {
        // calculate price
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2);
        };
        order.itemsPrice = addDecimals(order.orderItems.reduce(
            (total, item) => total + item.price * item.qty
            , 0));
    }


    return loading
        ? <Loader />
        : order
            ? error
                ? <Message variant='danger' children={error} />
                : (
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
                                                                    {item.qty} x {item.price} =${item.qty * item.price}
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
                                                <Col>${order.itemsPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Shipping</Col>
                                                <Col>${order.shippingPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Tax</Col>
                                                <Col>${order.taxPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Total</Col>
                                                <Col>${order.totalPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                    </>
                ) : <>{console.log('No order')}</>;
}

export default OrderScreen;
