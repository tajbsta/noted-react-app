import React, { useState, useRef } from 'react'
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap'
import * as Icon from 'react-feather'

const InfoIcon = (props) => {
  const pos = props.isMobile || window.innerWidth <= 1023 ? 'top' : 'bottom'
  const [show, setShow] = useState(false)
  const target = useRef(null)

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" className="tooltip-inner" {...props}>
      <span>
        noted determines potential return value by the original purchase
        price.The actual returns will be based on the product&apos;s return
        condition and return policies.
      </span>
    </Tooltip>
  )
  return (
    <div id="InfoIcon">
      {props.isMobile ? (
        <>
          <div
            className="info-icon"
            ref={target}
            onClick={() => setShow(!show)}
          >
            <Icon.Info />
          </div>
          <Overlay
            className="info-icon"
            target={target.current}
            show={show}
            placement={pos}
          >
            {renderTooltip}
          </Overlay>
        </>
      ) : (
        <div className="info-icon">
          <OverlayTrigger
            trigger="hover"
            className="info-icon"
            placement={pos}
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <Icon.Info />
          </OverlayTrigger>
        </div>
      )}
    </div>
  )
}

export default InfoIcon
