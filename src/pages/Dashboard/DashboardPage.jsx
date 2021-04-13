import { isEmpty, values, flatMap } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner, ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReturnCategory from '../../components/ReturnCategory';
import RightCard from './components/RightCard';
import { getUserId, getUser } from '../../utils/auth';
import { getAccounts } from '../../utils/accountsApi';
import { clearSearchQuery } from '../../actions/runtime.action';
import { setCartItems } from '../../actions/cart.action';
import { LAST_CALL, RETURNABLE, DONATE } from '../../constants/actions/runtime';
import AddEmailModal from '../../modals/AddEmailModal';
import AddProductModal from '../../modals/AddProductModal';
import ScheduledCard from './components/ScheduledCard';

const inDevMode = ['local', 'development'].includes(process.env.NODE_ENV);

function DashboardPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [modalEmailShow, setModalEmailShow] = useState(false);
  const [modalProductShow, setModalProductShow] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({
    [LAST_CALL]: [],
    [RETURNABLE]: [],
    [DONATE]: [],
  });

  async function loadScans() {
    dispatch(clearSearchQuery());
    try {
      setLoading(true);
      const userId = await getUserId();
      const accounts = await getAccounts(userId);

      setUserId(userId);

      // Redirect to request-permission if user has no accounts
      if (accounts.length === 0) {
        history.push('/request-permission');
        return;
      }

      // const validAccounts = accounts.filter((acc) => acc.valid === 1);

      // Redirect to account settings if user has no active gmail account
      // if (validAccounts.length === 0) {
      //   // setLaunchScan(true);
      //   setLoading(false);
      //   history.push('/settings');
      //   return;
      // }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      // TODO: show error here
    }
  }

  const updateSelectedItems = (data) => {
    const updatedSelectedProducts = selectedProducts;

    updatedSelectedProducts[data.key] = data.items;

    setSelectedProducts(updatedSelectedProducts);

    const cartItems = flatMap(values(updatedSelectedProducts));
    dispatch(setCartItems(cartItems));
  };

  useEffect(() => {
    loadScans();
  }, []);

  // useEffect(() => {;
  //   (async () => {
  //     const user = await getUser();
  //     setUser(user);
  //   })();
  // }, []);

  return (
    <div>
      <div className='container mt-6 main-mobile-dashboard'>
        {/* <ScheduledCard /> */}
        <div className='row'>
          <div className='col-sm-9 mt-4 w-840 bottom'>
            {/* {loading && (
              <>
                <div id='loader-con'>
                  <h3 className='sofia-pro text-16'>
                    Your online purchases - Last 90 Days
                  </h3>
                  <div className='card shadow-sm scanned-item-card mb-2 p-5 spinner-container'>
                    <Spinner className='dashboard-spinner' animation='border' />
                  </div>
                </div>
              </>
            )} */}

            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}

            {!loading && (
              <>
                {isEmpty(search) && (
                  <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                    Your online purchases - Last 90 Days
                  </h3>
                )}
                {!isEmpty(search) && (
                  <h3 className='sofia-pro mt-0 ml-3 text-18 text-list'>
                    Search Results
                  </h3>
                )}
                {isEmpty(search) && (
                  <>
                    <div>
                      <ReturnCategory
                        typeTitle='Last Call!'
                        userId={userId}
                        size={4}
                        category={LAST_CALL}
                        updateSelectedItems={updateSelectedItems}
                      />
                    </div>
                    <div className='mt-4 returnable-items'>
                      <ReturnCategory
                        typeTitle='Returnable Items'
                        userId={userId}
                        size={4}
                        category={RETURNABLE}
                        updateSelectedItems={updateSelectedItems}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                    <div className='mt-4' unselectable='one'>
                      <ReturnCategory
                        typeTitle='Donate'
                        userId={userId}
                        size={4}
                        category={DONATE}
                        updateSelectedItems={updateSelectedItems}
                      />
                    </div>
                    <div>
                      <p className='line-break'>
                        <span></span>
                      </p>
                    </div>
                  </>
                )}

                {!isEmpty(search) && (
                  <div>
                    <ReturnCategory
                      typeTitle='Select all'
                      userId={userId}
                      size={4}
                      search={search}
                      updateSelectedItems={updateSelectedItems}
                    />
                  </div>
                )}

                {isEmpty(search) && (
                  <div>
                    <div className='row justify-center mobile-footer-row'>
                      <div className='col-sm-7 text-center'>
                        <div className='text-muted text-center sofia-pro line-height-16 text-bottom-title'>
                          These are all the purchases we found in the past 90
                          days from your address {user && user.email}
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-3 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <div className='text-muted text-center text-cant-find sofia-pro'>
                          Can’t find one?
                          <button
                            className='btn btn-add-product'
                            onClick={() => setModalProductShow(true)}
                            style={{ padding: '0px' }}
                          >
                            <div className='noted-purple sofia-pro line-height-16 text-add'>
                              &nbsp; Add it manually
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='row justify-center mt-2 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <button
                          className='btn btn-footer'
                          onClick={() => setModalEmailShow(true)}
                        >
                          <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                            Add new email address
                          </div>
                        </button>
                      </div>
                    </div>
                    {/* MODALS */}
                    <AddProductModal
                      show={modalProductShow}
                      onHide={() => setModalProductShow(false)}
                    />
                    <AddEmailModal
                      show={modalEmailShow}
                      onHide={() => setModalEmailShow(false)}
                    />
                    <div className='row justify-center mt-2 mobile-footer-row'>
                      <div className='col-sm-6 text-center'>
                        <button className='btn btn-footer'>
                          <div className='text-center noted-purple sofia-pro line-height-16 text-new-email'>
                            Scan for older items
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className='col-sm-3 checkout-card'>
            <RightCard userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
