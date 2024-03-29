import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { createOrder } from '../actions/orderActions';

function PlaceOrderScreen({ history }) {
    const cart = useSelector(state => state.cart);
    const dispatch = useDispatch();
    // to add 2 decimal places
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    // Calculate Prices
    cart.itemsPrice = addDecimals(cart.cartItems.reduce(
        (total, item) => total + item.price * item.qty
        , 0));
    cart.shippingPrice = addDecimals(cart.itemsPrice > 500 ? 0 : 30);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = addDecimals(Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice));

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;
    useEffect(() => {
        if (success) {
            history.push(`/order/${order._id}`);
        }
        // eslint-disable-next-line
    }, [history, success]);
    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice
        }));
    };

    return (
        <>
            <Meta title='Shopsy | Place Order' />
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {cart.shippingAddress.address},
                                 {cart.shippingAddress.city},
                                 {cart.shippingAddress.postalCode},
                                  {cart.shippingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {cart.paymentMethod}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {cart.cartItems.length === 0
                                ? <Message children='Your cart is empty' />
                                : (
                                    <ListGroup.Item variant='flush'>
                                        {cart.cartItems.map((item, index) =>
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
                                    <Col>${cart.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${cart.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${cart.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${cart.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger' children={error} />}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block'
                                    disabled={cart.cartItems === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default PlaceOrderScreen;
