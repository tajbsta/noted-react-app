import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import { get } from 'lodash-es';
import moment from 'moment';

const CustomInput = ({ value, defaultValue, inputRef, name, ...props }) => {
  return (
    <input
      {...props}
      name={name}
      defaultValue={defaultValue}
      ref={inputRef}
      onLoad={() => inputRef.current.focus()}
      style={{
        display: 'none',
      }}
    />
  );
};

export default function DatePicker({ date, setFieldValue }) {
  return (
    <div id='DatePicker'>
      <Flatpickr
        render={({ defaultValue, value, ...props }, ref) => {
          return (
            <CustomInput
              defaultValue={defaultValue}
              inputRef={ref}
              name='date'
            />
          );
        }}
        onChange={(date) => {
          setFieldValue('date', get(date, '0'));
        }}
        options={{
          minDate: new Date().setDate(new Date().getDate() + 1),
          maxDate: new Date().setDate(new Date().getDate() + 5),
          inline: true,
          animate: true,
          dateFormat: 'Y-m-d',
          monthSelectorType: 'static',
          showMonths: 1,
        }}
        value={date}
      />
    </div>
  );
}
