import React, { useState } from "react";
// import Helmet from "react-helmet";
import DayPicker, { DateUtils } from "react-day-picker";
import "./Calendar.css";
import Button, { CircleButton } from "./Button";

const numberOfMonths = 1;

const initialState = {
  from: undefined,
  to: undefined
}

export const Calendar = ({setCalendar, initDates}) => {
    const [dates, setDates] = useState(initDates || {initialState})
    const { from, to } = dates;
    const modifiers = { start: from, end: to };
    const modifiersStyles={
      start: {
        borderRadius: '5px 0 0 5px',
        backgroundColor: '#07378f',
        color: '#c5d3ff',

      },
      end: {
        borderRadius: '0 5px 5px  0',
        backgroundColor: '#07378f',
        color: '#c5d3ff',
      } ,
    };

    const reset = () => {
      setDates(initialState)
    }

    const dayClick = (day) => {
      const state = dates.from && dates.to ? initialState : dates;
      const range = DateUtils.addDayToRange(day, state);
      setDates(range)
    }


    return (
      <div className="flex flex-col items-center">

        <p className="text-xl font-bold">
          {!from && !to && 'Please select the start date.'}
          {from && !to && 'Please select the end date.'}
          {from && to && `${from.toLocaleDateString()} to ${to.toLocaleDateString()}`}
        </p>

        <DayPicker
          className="Selectable"
          selectedDays={[from, { from, to }]}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          onDayClick={dayClick}
        />
        {from && to && (

          <Button classList='bg-secondary link p-1 rounded mb-4' padding={true} onClick={() => reset()}>
            Reset
          </Button>
        )}
        <div className="fixed bottom-4 right-4">
            <CircleButton onClick={() => {if (dates.from && dates.to) {setCalendar(dates)}}} classList="bg-success">
                <svg className="rotate-180" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><line x1="4.58" y1="12.5" x2="22.5" y2="12.5" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="7.7" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/><line x1="2.5" y1="12.5" x2="8.74" y2="17.3" fill="none" stroke="#fff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="4"/></svg>
            </CircleButton>
        </div>
        {/* <Helmet>
          <style>{`
  .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
    background-color: #f0f8ff !important;
    color: #4a90e2;
  }
  .Selectable .DayPicker-Day {
    border-radius: 0 !important;
  }
  .Selectable .DayPicker-Day--start {
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
  }
  .Selectable .DayPicker-Day--end {
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
  }
`}</style>
        </Helmet> */}
      </div>
    );
  }
