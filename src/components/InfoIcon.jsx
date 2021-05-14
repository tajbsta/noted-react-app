import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import * as Icon from 'react-feather'

const InfoIcon = (props) => {
  const pos = props.isMobile ? 'top' : 'bottom'
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" className="tooltip-inner" {...props}>
      <span>
        Noted determines potential return value by the original purchase
        price.The actual returns will be based on the product&apos;s return
        condition and return policies.
      </span>
    </Tooltip>
  )
  return (
    <div className="info-icon">
      <OverlayTrigger
        trigger="hover"
        className="info-icon"
        placement={pos}
        delay={{ show: 250, hide: 400 }}
        // overlay={
        //   <div style={{ background: 'red !important' }}>renderTooltip</div>
        // }
        overlay={renderTooltip}
      >
        <Icon.Info />
      </OverlayTrigger>
    </div>
  )
}

export default InfoIcon
