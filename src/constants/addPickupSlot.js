const PICKUP_SLOT_LABELS = {
    AM: {
        A: '9am - 10am',
        B: '10am - 11am',
        C: '11am - 12pm'
    },
    PM: {
        A: '12pm - 1pm',
        B: '1pm - 2pm',
        C: '2pm - 3pm'
    }
};

export const ADD_PICKUP_SLOT_OPTIONS_AM = [
    {
        value: PICKUP_SLOT_LABELS.AM.A,
        label: PICKUP_SLOT_LABELS.AM.A,
    },
    {
        value: PICKUP_SLOT_LABELS.AM.B,
        label: PICKUP_SLOT_LABELS.AM.B,
    },
    {
        value: PICKUP_SLOT_LABELS.AM.C,
        label: PICKUP_SLOT_LABELS.AM.C,
    },
];

export const ADD_PICKUP_SLOT_OPTIONS_PM = [
    {
        value: PICKUP_SLOT_LABELS.PM.A,
        label: PICKUP_SLOT_LABELS.PM.A,
    },
    {
        value: PICKUP_SLOT_LABELS.PM.B,
        label: PICKUP_SLOT_LABELS.PM.B,
    },
    {
        value: PICKUP_SLOT_LABELS.PM.C,
        label: PICKUP_SLOT_LABELS.PM.C,
    },
];