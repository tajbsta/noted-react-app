import React from 'react';

export default function Row({
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  className = '',
  children = <></>,
}) {
  const classList = `row ${className} mt-${marginTop} mb-${marginBottom} ml-${marginLeft} mr-${marginRight}`;
  return <div className={classList}>{children}</div>;
}
