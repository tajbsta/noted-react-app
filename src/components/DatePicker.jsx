import React from 'react';
import moment from 'moment';

const CustomInput = ({ inputRef, name, ...props }) => {
  return (
    <input
      {...props}
      name={name}
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
      {/* <Flatpickr
        render={({ defaultValue, value, ...props }, ref) => {
          return (
            <CustomInput
              {...props}
              defaultValue={defaultValue}
              inputRef={ref}
              name='date'
              value={value}
            />
          );
        }}
        options={{
          onChange([date]) {
            try {
              const dateStr = `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()} 00:00 UTC`;
              const dateString = new Date(dateStr);
              setFieldValue('date', dateString);
            } catch (err) {
              console.log(err);
            }
          },
          minDate: new Date().setDate(new Date().getDate() + 1),
          maxDate: new Date().setDate(new Date().getDate() + 5),
          inline: true,
          defaultDate: moment(date).toISOString(),
          animate: true,
          dateFormat: 'Y-m-d',
          monthSelectorType: 'static',
          showMonths: 1,
        }}
      /> */}
      <div>Date</div>
    </div>
  );
}
