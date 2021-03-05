import { STORE_SCAN } from "../constants/actions/scans";

function scans(state = [], { type, scannedItems: scans }) {
  switch (type) {
    case STORE_SCAN:
      return scans;
    default:
      return state;
  }
}

export default scans;
