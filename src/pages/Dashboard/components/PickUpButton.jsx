/* eslint-disable react/prop-types */
import React from 'react';

function PickUpButton({
    disabled,
    backgroundColor: background,
    price,
    opacity,
    onClick,
}) {
    const btnTextStyle = {
        color: '#F8EFFF',
    };

    return (
        <div className="row">
            <button
                className="btn btn-md mb-2 col-sm-12 pick-up-btn d-flex"
                disabled={disabled}
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    letterSpacing: 1,
                    background,
                    opacity,
                }}
                onClick={onClick}
            >
                <span style={btnTextStyle} className="text-16 sofia-pro">
                    Schedule Pickup
                </span>
                <span style={btnTextStyle} className="text-16 sofia-pro">
                    ${price || ''}
                </span>
            </button>
        </div>
    );
}

export default PickUpButton;
