import { STORE_SCAN, UNSET_SCAN } from "../constants/actions/scans";

function scans(state = [], { type, scannedItems: scans }) {
  switch (type) {
    case STORE_SCAN:
      return scans;
    case UNSET_SCAN:
      return [];
    default:
      return state;
  }
}

export default scans;
