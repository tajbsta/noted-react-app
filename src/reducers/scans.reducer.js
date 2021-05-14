import {
  STORE_SCAN,
  UNSET_SCAN,
  UPDATE_SCANS,
} from '../constants/actions/scans';

function scans(state = [], { type, scannedItems: scans }) {
  switch (type) {
    case STORE_SCAN:
      return scans;
    case UNSET_SCAN:
      return [];
    case UPDATE_SCANS:
      return scans;
    default:
      return state;
  }
}

export default scans;
