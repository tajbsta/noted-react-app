import {
  STORE_SCAN,
  UNSET_SCAN,
  UPDATE_SCANS,
} from '../constants/actions/scans';

export const storeScan = ({ scannedItems }) => ({
  type: STORE_SCAN,
  scannedItems,
});

export function unsetScan() {
  return {
    type: UNSET_SCAN,
    scannedItems: [],
  };
}

export const updateScans = ({ scannedItems }) => ({
  type: UPDATE_SCANS,
  scannedItems,
});
