import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Spinner } from 'react-bootstrap';
import NotedCheckbox from '../components/Product/NotedCheckbox';
import { get } from 'lodash';
import ProductPlaceholder from '../assets/img/ProductPlaceholder.svg';
import { formatCurrency } from '../library/number';
import { DuplicateReducer } from '../utils/duplicateReducer';

const ProductOptionEntry = ({ data, onSelect }) => {
  const nameRegex = /[!@$%^&*+={}<>?]+/;
  const orderRef = get(data, 'orderRef', '');
  const thumbnail = get(data, 'thumbnail', ProductPlaceholder);
  const vendor = get(data, 'vendor', '');
  const name = nameRegex.test(data.name)
    ? 'Name not found'
    : get(data, 'name', '');
  const price =
    data.price === 0
      ? 'Price Unavailable'
      : `${formatCurrency(get(data, 'price', 0))}`;
  const isSelected = get(data, 'isSelected', false);
  return (
    <Row id='ProductOption'>
      <div className='img-container'>
        <img className='product-img' src={thumbnail}></img>
      </div>
      <div className='text-container'>
        <h4 className='vendor sofia-pro'>{vendor}</h4>
        <h4 className='sofia-pro'>{name}</h4>
        <h4 className='price sofia-pro'>{price}</h4>
      </div>
      <div className='checkbox'>
        <NotedCheckbox
          checked={isSelected}
          onChangeState={() => onSelect(orderRef, name)}
          disabled={false}
        />
      </div>
    </Row>
  );
};

export default function ProductOptionsModal(props) {
  const { show, data, sendToBE, isSavingProducts, handleCancel } = props;

  const [allProducts, setAllProducts] = useState([]);
  const [selectText, setSelectText] = useState('Deselect all');
  const [hasSelected, setHasSelected] = useState(false);

  const handleSaveProducts = async () => {
    const initialProducts = allProducts.filter((item) => item.isSelected);
    const dataToSend = [];
    const val = initialProducts.reduce((prev, curr) => {
      if (prev[curr.orderRef]) {
        prev[curr.orderRef] = [...prev[curr.orderRef], curr];
      } else {
        prev[curr.orderRef] = [curr];
      }
      return prev;
    }, {});

    for (const [key, value] of Object.entries(val)) {
      const fullData = {
        vendor: value[0].vendor,
        emailId: value[0].emailId,
        orderRef: key,
        orderDate: value[0].orderDate,
        products: value.map((item) => ({
          name: item.name,
          price: item.price,
          thumbnail: item.thumbnail,
        })),
      };
      dataToSend.push(fullData);
    }

    await sendToBE(dataToSend);
  };

  const handleOnSelect = (orderRef, name) => {
    const newAllProducts = allProducts.map((item) => {
      if (item.orderRef === orderRef && item.name === name) {
        return {
          ...item,
          isSelected: !item.isSelected,
        };
      }
      return item;
    });
    setAllProducts(newAllProducts);
  };

  const handleSelectAll = () => {
    if (selectText === 'Select All Products') {
      const newAllProducts = allProducts.map((item) => ({
        ...item,
        isSelected: true,
      }));
      setAllProducts(newAllProducts);
      setSelectText('Deselect all');
    } else {
      const newAllProducts = allProducts.map((item) => ({
        ...item,
        isSelected: false,
      }));
      setAllProducts(newAllProducts);
      setSelectText('Select All Products');
    }
  };

  const processData = (data) => {
    const products = [];
    data.forEach((item) => {
      item.products.forEach((singleProduct) => {
        const productEntry = {
          vendor: item.vendor,
          emailId: item.emailId,
          orderRef: item.orderRef,
          orderDate: item.orderDate,
          ...singleProduct,
        };
        products.push(productEntry);
      });
    });

    const reducedProducts = DuplicateReducer(products);

    return reducedProducts;
  };

  useEffect(() => {
    if (show) {
      const response = processData(data);
      if (response.length > 0) {
        const newData = response.map((item) => ({
          ...item,
          isSelected: true,
        }));
        setAllProducts(newData);
      }
    }
  }, [show]);

  useEffect(() => {
    const exists = allProducts.findIndex((item) => item.isSelected);
    if (exists !== -1) {
      setHasSelected(true);
    } else {
      setHasSelected(false);
    }
  }, [allProducts]);

  return (
    <div>
      <Modal
        show={show}
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
        keyboard={false}
        animation={false}
        id='ProductOptionsModal'
      >
        <Modal.Body className='sofia-pro modal-content'>
          <Row className='row-one'>
            <p className='sofia-pro header-text-bold'>Hey there</p>
            <p className='sofia-pro header-text-normal'>
              Here are the items we got from scanning your email. Please select
              the items you would like us to add to your dashboard.
            </p>
            <Button
              className='btn-cancel'
              disabled={isSavingProducts}
              onClick={handleSelectAll}
            >
              {selectText}
            </Button>
          </Row>
          <Row className='row-two'>
            {allProducts.map((product) => (
              <ProductOptionEntry
                key={product.name}
                data={product}
                onSelect={handleOnSelect}
              />
            ))}
          </Row>
          <Row className='row-three'>
            <Button className='btn-cancel' onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className='btn-save'
              type='button'
              disabled={isSavingProducts || !hasSelected}
              onClick={handleSaveProducts}
            >
              {isSavingProducts ? 'Saving' : 'Save Products'}
              {isSavingProducts && (
                <Spinner
                  animation='border'
                  size='sm'
                  style={{
                    color: '#fff',
                    opacity: '1',
                    marginLeft: '8px',
                  }}
                  className='spinner'
                />
              )}
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
