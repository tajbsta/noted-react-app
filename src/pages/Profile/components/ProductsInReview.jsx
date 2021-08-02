import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import Collapsible from 'react-collapsible';
import { getProducts } from '../../../api/productsApi';
import ProductInReviewCard from './ProductInReviewCard';

export default function ProductsInReview() {
    const [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);
    const [showNextPageButton, setShowNextPageButton] = useState(false);
    const sortBy = 'created_at,_id';
    const size = 5;

    const renderEmptiness = () => {
        return (
            <>
                <h5 className='sofia pro empty-message mt-4'>
                    No products found.
                </h5>
            </>
        );
    };

    const getNextPageToken = () => {
        const lastItem = products[products.length - 1];
        return sortBy
            .split(',')
            .map((key) => encodeURIComponent(lastItem[key]))
            .join(',');
    };

    const showMore = async () => {
        const nextPageToken = getNextPageToken();
        await fetchProductsInReview(nextPageToken);
    };

    const renderItems = () => {
        return products.map((item) => (
            <ProductInReviewCard key={item._id} item={item} />
        ));
    };

    const fetchProductsInReview = async (nextPageToken) => {
        setIsFetchingProducts(true);
        const allProducts = await getProducts({
            size,
            sortBy: 'created_at,_id',
            sort: 'desc',
            inReview: true,
            nextPageToken: nextPageToken,
        });
        setIsFetchingProducts(false);
        const newProducts = [...products, ...allProducts];
        setProducts(newProducts);
        setShowNextPageButton(newProducts.length >= size);
    };

    useEffect(() => {
        fetchProductsInReview('');
    }, []);

    return (
        <div id='ProductsInReview'>
            <Collapsible
                open={isOpen}
                onTriggerOpening={() => setIsOpen(true)}
                onTriggerClosing={() => setIsOpen(false)}
                trigger={
                    <div className='triggerContainer'>
                        <h3 className='sofia-pro text-18 mb-3-profile mb-0 ml-3 triggerText'>
                            Products Under Review
                        </h3>
                        <span className='triggerArrow'>
                            {isOpen ? '▲' : '▼'}{' '}
                        </span>
                    </div>
                }
            >
                {isEmpty(products) ? renderEmptiness() : renderItems()}
                {showNextPageButton && !isFetchingProducts && (
                    <div className='d-flex justify-content-center'>
                        <button
                            className='sofia-pro btn btn-show-more noted-purple'
                            onClick={showMore}
                            disabled={isFetchingProducts}
                        >
                            Show more
                        </button>
                    </div>
                )}
            </Collapsible>
        </div>
    );
}
