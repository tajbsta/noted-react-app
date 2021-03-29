import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import ReturnCategory from '../components/ReturnCategory';
import Scanning from '../components/Dashboard/Scanning';
import { FOR_RETURN, LAST_CALL } from '../constants/actions/runtime';
import InReturnBox from '../components/EditOrder/InReturnBox';
import { updateCurrentOrder } from '../actions/runtime.action';

function EditOrder({
  location: {
    state: { scheduledReturnId },
  },
}) {
  const history = useHistory();

  const dispatch = useDispatch();
  const { search } = useSelector(({ runtime: { search } }) => ({ search }));

  const [loading, setLoading] = useState(true);
  const [setModalShow] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);

  const [lastCallSelected, setLastCallSelected] = useState([]);
  const [returnableSelected, setReturnableSelected] = useState([]);

  const { scheduledReturns, scans, localDonationsCount } = useSelector(
    ({
      runtime: { forReturn, lastCall, forDonation },
      auth: { scheduledReturns },
      scans,
    }) => ({
      localDonationsCount: forDonation.length,
      forReturn,
      lastCall,
      scheduledReturns,
      inReturn: [...forReturn, ...lastCall],
      inDonation: [...forDonation],
      scans,
    })
  );
  const scheduledReturn = scheduledReturns.find(
    ({ id }) => id === scheduledReturnId
  );

  const items = get(scheduledReturn, 'items', []);

  const unSelectedReturns = scans.filter(
    ({ id }) => ![...items.map(({ id }) => id)].includes(id)
  );
  /**
   * NEEDS ITEMS ABOVE TO START
   */
  const [inBoxSelected, setInBoxSelected] = useState([...items]);
  const potentialReturnValue = [
    ...inBoxSelected,
    ...lastCallSelected,
    ...returnableSelected,
  ]
    .map(({ amount }) => parseFloat(amount))
    .reduce((acc, curr) => (acc += curr), 0);
  const extraCost =
    [...inBoxSelected, ...lastCallSelected, ...returnableSelected].length * 2;
  const hasChanges =
    [...get(scheduledReturn, 'items', [])].length !==
    [...inBoxSelected, ...returnableSelected, ...lastCallSelected].length;

  console.log(get(scheduledReturn, 'items', []));
  console.log(lastCallSelected);
  useEffect(() => {
    const platform = window.navigator.platform;
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

    if (windowsPlatforms.indexOf(platform) !== -1) {
      // Windows 10 Chrome
      $('.btn-confirm').css('padding-top', '10px');
    }
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      const filtered = items.filter((scan) => {
        const pattern = new RegExp(search, 'i');
        return (
          get(scan, 'vendorTag', '').match(pattern) ||
          get(scan, 'itemName', '').match(pattern)
        );
      });
      setFilteredItems([...filtered]);
    } else {
      setFilteredItems([]);
    }
    setLoading(false);
  }, [search]);

  const onConfirm = () => {
    /**
     * @FUNCTION Confirm change here
     */

    const newOrder = {
      ...scheduledReturn,
      items: [...inBoxSelected, ...returnableSelected, ...lastCallSelected],
    };
    dispatch(updateCurrentOrder(newOrder));
    history.push('/view-return', { scheduledReturnId, hasModifications: true });
  };

  return (
    <div id="EditOrderPage">
      <div className="container mt-6">
        <div className="row">
          <div className="col-sm-9 mt-4 w-840 bottom">
            {loading && (
              <>
                <h3 className="sofia-pro text-16">
                  Your online purchases - Last 90 Days
                </h3>
                <div className="card shadow-sm scanned-item-card mb-2 p-5 spinner-container">
                  <Spinner className="dashboard-spinner" animation="border" />
                </div>
              </>
            )}

            {!loading && items.length === 0 && (
              <>
                <h3 className="sofia-pro text-16">
                  Add products to your return
                </h3>
                <div className="card shadow-sm scanned-item-card mb-2 p-5">
                  <Scanning />
                </div>
              </>
            )}

            {/*CONTAINS ALL SCANS LEFT CARD OF DASHBOARD PAGE*/}
            {!loading && items.length > 0 && (
              <>
                <h3 className="sofia-pro mt-0 ml-3 text-18 text-list">
                  {isEmpty(search)
                    ? 'Add products to your return'
                    : 'Search Results'}
                </h3>
                {isEmpty(search) && (
                  <>
                    <div>
                      <InReturnBox
                        scannedItems={items}
                        typeTitle="In your box"
                        compensationType={LAST_CALL}
                        disabled={localDonationsCount > 0}
                        scheduledReturnId={scheduledReturnId}
                        selected={inBoxSelected}
                        setSelected={setInBoxSelected}
                      />
                    </div>
                    <hr className="edit-line-break"></hr>
                    <div>
                      <ReturnCategory
                        scannedItems={unSelectedReturns.slice(0, 4)}
                        typeTitle="Last Call!"
                        compensationType={LAST_CALL}
                        disabled={localDonationsCount > 0}
                        selected={lastCallSelected}
                        setSelected={setLastCallSelected}
                      />
                    </div>
                    <div className="mt-4 returnable-items">
                      <ReturnCategory
                        scannedItems={unSelectedReturns.slice(5, 9)}
                        typeTitle="Returnable Items"
                        compensationType={FOR_RETURN}
                        disabled={localDonationsCount > 0}
                        selected={returnableSelected}
                        setSelected={setReturnableSelected}
                      />
                    </div>
                  </>
                )}

                {!isEmpty(search) && !isEmpty(filteredItems) && (
                  <div>
                    <ReturnCategory
                      scannedItems={filteredItems}
                      typeTitle="Select all"
                    />
                  </div>
                )}
                {!isEmpty(search) && isEmpty(filteredItems) && (
                  <div className="row justify-center">
                    <div className="col-sm-7 text-center">
                      <div className="text-center sofia-pro empty-search">
                        No results found.
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          {/**
           * @START OF RIGHT CARD
           */}
          <div className="col-sm-3">
            <div
              className="col right-card"
              style={{
                maxWidth: '248px',
              }}
            >
              <div className={`card shadow-sm p-3 pick-up-card h-400`}>
                <h3 className="sofia-pro products-to-return mb-1">
                  {items.length} product to return
                </h3>
                <h3 className="box-size-description">
                  All products need to fit in a 12”W x 12”H x 20”L box
                </h3>
                <button
                  className="btn btn-more-info"
                  onClick={() => setModalShow(true)}
                >
                  <h3 className="noted-purple sofia-pro more-pick-up-info mb-0">
                    More info
                  </h3>
                </button>

                <hr className="line-break-1" />

                <>
                  {/* <h2 className='sofia-pro mb-0 donate-quantity'>1</h2>
                    <h5 className='sofia-pro text-muted value-label'>
                      Donation
                    </h5> */}

                  {items.length > 0 && (
                    <>
                      <h3 className="sofia-pro pick-up-price mb-0">
                        ${potentialReturnValue.toFixed(2) || 0.0}
                      </h3>
                      <h3 className="return-type sofia-pro value-label">
                        Potential Return Value
                      </h3>
                    </>
                  )}

                  <hr className="line-break-2" />
                  <div className="row">
                    <div className="col">
                      <h5 className="sofia-pro text-muted value-label">
                        Extra cost
                      </h5>
                    </div>
                    <div className="col">
                      <h5 className="sofia-pro text-right">${extraCost}</h5>
                    </div>
                  </div>
                  <hr className="line-break-3" />
                  <div
                    className="btn  noted-purple"
                    style={{
                      background: '#EEE4F6',
                      border: 'none',
                      color: '#57009',
                      display: 'flex',
                      alignContent: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => history.push('/dashboard')}
                  >
                    Cancel
                  </div>

                  {hasChanges && (
                    <div
                      className="btn mt-2"
                      style={{
                        background: '#570097',
                        border: 'none',
                        color: '#FFFFFF',
                      }}
                      onClick={onConfirm}
                    >
                      Confirm
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>
          {/**
           * @END RIGHT CARD
           */}
        </div>
      </div>
    </div>
  );
}

export default EditOrder;
