import { isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import Collapsible from 'react-collapsible';
import { ProgressBar } from 'react-bootstrap';
import { getProducts } from '../../../api/productsApi';
import { timeout } from '../../../utils/time';
import ProductInReviewCard from './ProductInReviewCard';

export default function ProductsInReview() {
    const [products, setProducts] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);
    const [showNextPageButton, setShowNextPageButton] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);
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
        try {
            setIsFetchingProducts(true);

            setLoadProgress(20);
            await timeout(200);
            setLoadProgress(35);
            await timeout(200);
            setLoadProgress(65);

            const allProducts = await getProducts({
                size,
                sortBy,
                sort: 'desc',
                reviewStatus: 'pending,approved,rejected',
                nextPageToken,
            });

            setLoadProgress(80);
            await timeout(200);
            setLoadProgress(100);
            await timeout(1000);

            /**
             * Give animation some time
             */
            setTimeout(() => {
                setIsFetchingProducts(false);
            }, 600);

            const newProducts = [...products, ...allProducts];
            setProducts(newProducts);
            setShowNextPageButton(newProducts.length >= size);
        } catch (e) {
            console.log(e.response);
            setIsFetchingProducts(false);
        }
    };

    useEffect(() => {
        if (products.length === 0) {
            fetchProductsInReview('');
            setIsOpen(true);
        }
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
                {!isFetchingProducts && isEmpty(products) && renderEmptiness()}
                {!isEmpty(products) && renderItems()}
                {isFetchingProducts && (
                    <ProgressBar
                        animated
                        striped
                        now={loadProgress}
                        className='mt-4 m-3'
                    />
                )}
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
