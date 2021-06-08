import React, { useEffect, useState } from 'react';
import Row from '../Row';
import ProductCard from './ProductCard';
import { ProgressBar } from 'react-bootstrap';
import QuestionMarkSvg from '../../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { getProducts } from '../../api/productsApi';
import NotedCheckbox from './NotedCheckbox';
import { useSelector, useDispatch } from 'react-redux';
import { DONATE, NOT_ELIGIBLE } from '../../constants/actions/runtime';
import { timeout } from '../../utils/time';
import { setCartItems } from '../../actions/cart.action';

export default function ReturnCategory({
  userId,
  typeTitle,
  size,
  category,
  search,
  // updateSelectedItems = () => {},
  // selectedProducts = [],
  width,
  percent,
  refreshCategory = {},
  handleRefreshCategory = () => {},
}) {
  const { cartItems } = useSelector(({ cart: { items: cartItems } }) => ({
    cartItems,
  }));

  const dispatch = useDispatch();
  const { push } = useHistory();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNextPageButton, setShowNextPageButton] = useState(true);
  const sortBy =
    category === DONATE ? 'updated_at,_id' : 'return_not_eligible_date,_id';
  const sort = category === DONATE ? 'desc' : 'asc,asc';
  const [loadProgress, setLoadProgress] = useState(0);

  const fetchItems = async (nextPageToken) => {
    try {
      setLoading(true);

      const params = {
        userId,
        size,
        category,
        sortBy,
        sort,
      };
      /**
       * SET TO YOUR LIKING
       */
      setLoadProgress(25);
      await timeout(200);
      setLoadProgress(50);
      setLoadProgress(95);

      if (search) {
        params.search = encodeURIComponent(search);
      }

      if (nextPageToken) {
        params.nextPageToken = nextPageToken;
      }
      const products = await getProducts(params);
      let newItems = [...products];
      if (nextPageToken) {
        newItems = items.concat(products);
      }

      setShowNextPageButton(products.length > 0 && products.length === size);

      setItems(newItems);

      setLoadProgress(100);
      await timeout(500);
      /**
       * Give animation some time
       */
      setTimeout(() => {
        setLoading(false);
      }, 600);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    handleRefreshCategory(fetchItems, category);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [search]);

  const getNextPageToken = () => {
    const copyItems = [...items];
    const lastItem = copyItems.pop();

    return sortBy
      .split(',')
      .map((key) => encodeURIComponent(lastItem[key]))
      .join(',');
  };

  const showMore = () => {
    const nextPageToken = getNextPageToken();
    fetchItems(nextPageToken);
  };

  const toggleSelected = async (item) => {
    const list = [...cartItems];

    const index = list.findIndex((x) => x._id === item._id);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }

    dispatch(setCartItems(list));
  };

  const handleSelectAll = (checked) => {
    const list = [...cartItems];

    items.forEach((item) => {
      const itemIndex = list.findIndex((x) => x._id === item._id);

      // Add to cart
      if (checked && itemIndex === -1 && item.category !== NOT_ELIGIBLE) {
        list.push(item);
      }

      // Remove in cart
      if (!checked && itemIndex !== -1) {
        list.splice(itemIndex, 1);
      }
    });

    dispatch(setCartItems(list));
  };

  return (
    <div id='ReturnCategory'>
      <Row>
        <div className='category-title'>
          <div className='ml-3 p-0 purchase-type-checkbox-container'>
            <NotedCheckbox
              onChangeState={handleSelectAll}
              checked={
                cartItems.length > 0 &&
                items.filter((x) => x.category !== NOT_ELIGIBLE).length > 0 &&
                items
                  .filter((x) => x.category !== NOT_ELIGIBLE)
                  .every((item) =>
                    cartItems.map((x) => x._id).includes(item._id)
                  )
              }
              disabled={items.length < 1}
            />
          </div>
          <h4 className='sofia-pro purchase-types purchase-type-title'>
            {typeTitle}
          </h4>
          <img
            className='question-mark'
            src={QuestionMarkSvg}
            alt=''
            style={{
              opacity: 0.6,
            }}
            data-toggle='tooltip'
            data-placement='top'
          />
        </div>
      </Row>
      {items.map((item) => {
        return (
          <ProductCard
            key={item._id}
            disabled={false}
            item={item}
            selected={!!cartItems.find((x) => x._id === item._id)}
            toggleSelected={toggleSelected}
            refreshCategory={refreshCategory}
          />
        );
      })}

      {!loading && items.length === 0 && (
        <div className='row justify-center m-row'>
          <div className='col-sm-7 text-center'>
            <div className='text-center sofia-pro empty-category'>
              No products found.
            </div>
          </div>
        </div>
      )}

      {loading && <ProgressBar animated now={loadProgress} />}
      {showNextPageButton && !loading && (
        <div className='d-flex justify-content-center'>
          <button
            className='sofia-pro btn btn-show-more noted-purple'
            onClick={showMore}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
