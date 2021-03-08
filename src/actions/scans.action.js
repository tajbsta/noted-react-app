import { STORE_SCAN } from "../constants/actions/scans";

export const storeScan = ({ scannedItems }) => ({
  type: STORE_SCAN,
  scannedItems,
});
