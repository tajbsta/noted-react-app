export const STANDARD = 'STANDARD';
export const DONATION = 'DONATION';
export const MISCELLANEOUS = 'MISCELLANEOUS';

export const ADD_PRODUCT_OPTIONS = [
    {
        value: STANDARD,
        label: STANDARD,
    },
    {
        value: DONATION,
        label: DONATION,
    },
    {
        value: MISCELLANEOUS,
        label: MISCELLANEOUS,
    },
];

export const TAX_FORMS = {
    M2M: `${process.env.REACT_APP_ASSETS_URL}/forms/M2M_Tax_Form.pdf`,
    OASIS: `${process.env.REACT_APP_ASSETS_URL}/forms/Oasis_Donation_Form.pdf`,
    TND: `${process.env.REACT_APP_ASSETS_URL}/forms/TND_Tax_Form.pdf`,
};
