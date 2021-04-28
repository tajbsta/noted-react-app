import React, { useEffect, useState } from 'react';
import Row from './Row';
import ProductCard from './ProductCard';
import { ProgressBar } from 'react-bootstrap';
import QuestionMarkSvg from '../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { getProducts } from '../utils/productsApi';
import NotedCheckbox from './NotedCheckbox';
import { useSelector } from 'react-redux';
import { DONATE } from '../constants/actions/runtime';
import { get } from 'lodash-es';

function ReturnCategory({
  userId,
  typeTitle,
  size,
  category,
  search,
  updateSelectedItems = () => {},
  width,
  percent,
}) {
  const { cartItems } = useSelector(({ cart: { items: cartItems } }) => ({
    cartItems,
  }));
  const { push } = useHistory();
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showNextPageButton, setShowNextPageButton] = useState(true);
  const sortBy =
    category === DONATE ? 'updated_at' : 'return_not_eligible_date,_id';
  const sort = category === DONATE ? 'desc' : 'asc,asc';
  const [loadProgress, setLoadProgress] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

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
      // await timeout(100);
      setLoadProgress(95);
      // await timeout(100);

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

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

  const toggleSelected = (item) => {
    const list = [...selectedItems];

    const index = list.findIndex((x) => x._id === item._id);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(item);
    }

    setSelectedItems(list);

    if (item.transferred) {
      fetchItems();
    }
  };

  const handleSelectAll = () => {
    const list = [...items];
    setSelectedItems(list);
    if (items.length > 0 && selectedItems.length === items.length) {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    updateSelectedItems({
      key: category,
      items: selectedItems,
    });
  }, [selectedItems]);

  useEffect(() => {
    return () => {
      if (get(cartItems.pop(), 'transferred', false) === true) {
        fetchItems();
      }
    };
  }, [cartItems]);

  return (
    <div id='ReturnCategory'>
      <Row>
        <div className='category-title'>
          <div className='ml-3 p-0 purchase-type-checkbox-container'>
            <NotedCheckbox
              onChangeState={handleSelectAll}
              checked={
                items.length > 0 && selectedItems.length === items.length
              }
              disabled={items.length === 0}
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
            title='Tooltip message here :)'
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
            onClick={() => {
              push(`/view-scan?scanId=${item._id}`);
            }}
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

export default ReturnCategory;
