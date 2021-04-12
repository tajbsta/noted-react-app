import React, { useEffect, useState } from 'react';
import Row from './Row';
import ProductCard from './ProductCard';
import { Spinner, ProgressBar } from 'react-bootstrap';
import QuestionMarkSvg from '../assets/icons/QuestionMark.svg';
import { useHistory } from 'react-router-dom';
import { getProducts } from '../utils/productsApi';
import NotedCheckbox from './NotedCheckbox';

function ReturnCategory({
  userId,
  typeTitle,
  size,
  category,
  search,
  updateSelectedItems,
  width,
  percent,
}) {
  const { push } = useHistory();
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNextPageButton, setShowNextPageButton] = useState(true);
  const sortBy = 'order_date,name,_id';
  const sort = 'desc,asc';

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

      if (search) {
        params.search = encodeURIComponent(search);
      }

      if (nextPageToken) {
        params.nextPageToken = nextPageToken;
      }

      const products = await getProducts(params);

      const newItems = items.concat(products);

      setShowNextPageButton(products.length > 0 && products.length === size);
      setItems(newItems);
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

  const toggleSelected = (id) => {
    const list = [...selectedIds];

    const index = list.findIndex((x) => x === id);
    if (index !== -1) {
      list.splice(index, 1);
    } else {
      list.push(id);
    }

    setSelectedIds(list);
  };

  const handleSelectAll = () => {
    const list = [...items];
    setSelectedIds(list.map((x) => x._id));
    if (items.length > 0 && selectedIds.length === items.length) {
      setSelectedIds([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    updateSelectedItems({
      key: category,
      ids: selectedIds,
    });
  }, [selectedIds]);

  return (
    <div id='ReturnCategory'>
      <Row>
        <div className='category-title'>
          <div className='ml-3 p-0 purchase-type-checkbox-container'>
            <NotedCheckbox
              onChangeState={handleSelectAll}
              checked={items.length > 0 && selectedIds.length === items.length}
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
            selected={selectedIds.includes(item._id)}
            toggleSelected={toggleSelected}
            onClick={() => {
              push(`/view-scan?scanId=${item._id}`);
            }}
          />
        );
      })}

      {!loading && items.length === 0 && (
        <div className='row justify-center'>
          <div className='col-sm-7 text-center'>
            <div className='text-center sofia-pro empty-category'>
              No products found.
            </div>
          </div>
        </div>
      )}

      {loading && <ProgressBar animated now={55} />}
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
