import React, { useState, useRef } from 'react';
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as Icon from 'react-feather';

const ReturnValueInfoIcon = (props) => {
  const pos = props.isMobile || window.innerWidth <= 1023 ? 'top' : 'bottom';
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const content = props.content
    ? props.content
    : ` noted determines potential return value by the original purchase
  price.The actual returns will be based on the product's return
  condition and return policies.`;
  const iconClassname = props.iconClassname ? props.iconClassname : 'info-icon';

  const renderTooltip = (props) => (
    <Tooltip id='button-tooltip' className='tooltip-inner' {...props}>
      <span style={{ fontFamily: 'Sofia Pro !important' }}>{content}</span>
    </Tooltip>
  );
  return (
    <div id='ReturnValueInfoIcon'>
      {props.isMobile ? (
        <>
          <div
            className={iconClassname}
            ref={target}
            onClick={() => setShow(!show)}
          >
            <Icon.Info />
          </div>
          <Overlay
            className='info-icon'
            target={target.current}
            show={show}
            placement={pos}
            transition={false}
          >
            {renderTooltip}
          </Overlay>
        </>
      ) : (
        <div className={iconClassname}>
          <OverlayTrigger
            trigger={['hover', 'hover']}
            className='info-icon'
            placement={pos}
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
            transition={false}
          >
            <Icon.Info />
          </OverlayTrigger>
        </div>
      )}
    </div>
  );
};

export default ReturnValueInfoIcon;
