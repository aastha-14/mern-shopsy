import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';

import { listProducts } from '../actions/productActions';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { products, loading, error } = productList;
    useEffect(() => {
        dispatch(listProducts());
    }, [dispatch]);
    return (
        <>
            <h1>Latest Products</h1>
            {loading
                ? <Loader />
                : error
                    ? <Message variant='danger' childern={error} />
                    : <Row>
                        {products.map(product => {
                            return <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                <Product product={product} />
                            </Col>;
                        })}
                    </Row>
            }
        </>
    );
};

export default HomeScreen;