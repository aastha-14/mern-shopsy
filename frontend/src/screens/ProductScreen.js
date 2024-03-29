import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Message from '../components/Message';
import { listProductDetails, createProductReview } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

const ProductScreen = ({ match, history }) => {
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, product, error } = productDetails;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { success: successProductReview, error: errorProductReview } = productReviewCreate;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;
    useEffect(() => {
        if (successProductReview) {
            alert('Review Submitted!');
            setRating(0);
            setComment('');
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }
        dispatch(listProductDetails(match.params.id));
        window.scrollTo(0, 0);
    }, [match, dispatch, successProductReview]);
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`);
    };
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(match.params.id, { rating, comment }));
    };
    return (
        <>
            <Link className='btn btn-dark my-3' to='/'>
                Go Back
            </Link>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger' children={error} />
                    : <>
                        <Meta title={product.name} />
                        <Row>
                            <Col md={6}>
                                {console.log(product.image)}
                                <Image src={product.image} alt={product.name} fluid />
                            </Col>
                            <Col md={3}>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <h3>{product.name}</h3>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Rating
                                            value={product.rating}
                                            text={`${product.numReviews} reviews`}
                                        />
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Price: ₹{product.price}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Description: {product.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>
                                                    <strong>₹{product.price}</strong>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>
                                                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {product.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Qty</Col>
                                                    <Col>
                                                        <Form.Control
                                                            as='select'
                                                            value={qty}
                                                            onChange={(e) => setQty(e.target.value)}
                                                        >
                                                            {[...Array(product.countInStock).keys()].map(x =>
                                                                <option key={x + 1} value={x + 1}>
                                                                    {x + 1}
                                                                </option>)}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                        <ListGroup.Item>
                                            <Button
                                                className='btn-block'
                                                type='button'
                                                disabled={product.countInStock === 0}
                                                onClick={addToCartHandler}
                                            >
                                                Add To Cart
                                        </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h2>Reviews</h2>
                                {product.reviews.length === 0 && <Message children='No Reviews' />}
                                <ListGroup variant='flush'>
                                    {product.reviews.map(review => (
                                        <ListGroup.Item key={review._id}>
                                            <strong>{review.name}</strong>
                                            <Rating value={review.rating} />
                                            <p>{review.createdAt.substring(0, 10)}</p>
                                            <p>{review.comment}</p>
                                        </ListGroup.Item>
                                    ))}
                                    <ListGroup.Item>
                                        <h2>Write a review</h2>
                                        {errorProductReview && <Message variant='danger' children={errorProductReview} />}
                                        {userInfo
                                            ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating'>
                                                        <Form.Label>Rating</Form.Label>
                                                        <Form.Control
                                                            as='select'
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1- Poor</option>
                                                            <option value='2'>2- Fair</option>
                                                            <option value='3'>3- Good</option>
                                                            <option value='4'>4- Very Good</option>
                                                            <option value='5'>5- Excellent</option>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId='comment'>
                                                        <Form.Label>Comment</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            row='3'
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}>
                                                        </Form.Control>
                                                    </Form.Group>
                                                    <Button type='submit' variant='primary'>Submit</Button>
                                                </Form>
                                            ) : (
                                                <Message children='Please login to write a review.' />
                                            )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </>
            }
        </>
    );
};

export default ProductScreen;


