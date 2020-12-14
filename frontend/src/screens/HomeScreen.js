import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
    const keyword = match.params.keyword;
    const pageNumber = match.params.pageNumber || 1;

    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { products, loading, error, pages, page } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber]);
    return (
        <>
            <h1>Latest Products</h1>
            {loading
                ? <Loader />
                : error
                    ? (<Message variant='danger' children={error} />
                    ) : (
                        <>
                            <Row>
                                {products.map(product => {
                                    return <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
                                        <Product product={product} />
                                    </Col>;
                                })}
                            </Row>
                            <Paginate
                                page={page}
                                pages={pages}
                                keyword={keyword ? keyword : ''}
                                />
                        </>)
            }
        </>
    );
};

export default HomeScreen;
