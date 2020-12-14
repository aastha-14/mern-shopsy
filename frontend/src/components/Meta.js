import React from 'react';
import { Helmet } from 'react-helmet';
const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' content={description} />
            <meta name='keyword' content={keywords} />
        </Helmet>
    );
};

Meta.defaultProps = {
    title: 'Welcome to Shopsy',
    keywords: 'electronis, buy electornics',
    description: 'We sell the best products for cheap price'
};

export default Meta;
