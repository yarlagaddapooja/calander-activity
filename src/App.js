import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, DatePicker, Input, Button } from 'antd';
import moment from 'moment';
import './App.css';

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [startDatePicker, setStartDatePicker] = useState(null);
  const [endDatePicker, setEndDatePicker] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [events, setEvents] = useState([
    { title: 'Event 1', date: '2024-04-16' },
    { title: 'Event 2', date: '2024-04-17' }
  ]);
  //const [showAlert, setShowAlert] = useState(false);
  const [showTimeSlotAlert, setShowTimeSlotAlert] = useState(false);
  const [minTimeSlotAlert, setMinTimeSlotAlert] = useState(false); // State variable for displaying the minimum time slot alert
  const [showOverlapAlert, setShowOverlapAlert] = useState(false); // State variable for displaying the overlap warning message

  const handleDateClick = (arg) => {
    // Set the clicked date and time to the current date and time
    const clickedDateTime = moment(arg.date).set({
      hour: moment().hour(),
      minute: moment().minute(),
      second: moment().second()
    });

    const currentDate = moment();

    // Calculate the end time of the selected slot
    const endDateTime = moment(clickedDateTime).add(1, 'hour');
    console.log('endDateTime', endDateTime)

    // Check if the duration is less than one hour
    if (endDateTime.isBefore(moment(arg.date))) {
      setMinTimeSlotAlert(true);
      return;
    }

    console.log('Clicked Date Time:', clickedDateTime.format());
    console.log('Current Date Time:', currentDate.format());

    // Check if the clicked date is before the current date
    if (clickedDateTime.isBefore(currentDate, 'day')) {
      //setShowAlert(true);
      console.log('Show Alert:', true);
    } else {
      // Check if the clicked time is between 9 AM and 6 PM on the clicked date
      const nineAM = clickedDateTime.clone().set({ hour: 9, minute: 0, second: 0 });
      const sixPM = clickedDateTime.clone().set({ hour: 18, minute: 0, second: 0 });

      console.log('9 AM:', nineAM.format());
      console.log('6 PM:', sixPM.format());

      if (
        clickedDateTime.isBefore(nineAM) ||
        clickedDateTime.isAfter(sixPM)
      ) {
        setShowTimeSlotAlert(true);
        console.log('Show Time Slot Alert:', true);
      } else {
        // Proceed with creating the event
        //setStartDatePicker(clickedDateTime);
        //setEndDatePicker(clickedDateTime);
        setEventTitle('');
        setModalOpen(true);
        console.log('Modal Open:', true);
      }
    }
  };

  const closeModal = () => {
    setStartDatePicker(null);
    setEndDatePicker(null);
    setEventTitle('');
    setModalOpen(false);
    //setShowAlert(false);
    setShowTimeSlotAlert(false);
    setMinTimeSlotAlert(false);
  };

  // const handleSaveEvent = () => {
  //   const currentDate = moment();

  //   if (!startDatePicker || !endDatePicker) {
  //     setShowAlert(true);
  //     return;
  //   }

  //   if (startDatePicker && startDatePicker.isBefore(currentDate, 'day')) {
  //     setShowAlert(true);
  //     return;
  //   }

  //   // Check if the duration is less than one hour
  //   const duration = moment.duration(endDatePicker.diff(startDatePicker)).as('hours');
  //   if (duration < 1) {
  //     setMinTimeSlotAlert(true);
  //     return;
  //   }

  //   // Check if the start date is before 9 AM or the end date is after 6 PM
  //   const nineAM = moment(startDatePicker).set({ hour: 9, minute: 0, second: 0 });
  //   const sixPM = moment(endDatePicker).set({ hour: 18, minute: 0, second: 0 });

  //   if (startDatePicker.isBefore(nineAM) || endDatePicker.isAfter(sixPM)) {
  //     setShowTimeSlotAlert(true);
  //     return;
  //   }

  //   const overlap = events.some(event => {
  //     const eventStart = moment(event.start);
  //     const eventEnd = moment(event.end);

  //     // Check if the new event overlaps with existing events
  //     return (
  //       moment(startDatePicker).isBetween(eventStart, eventEnd, null, '[]', 'minute') ||
  //       moment(endDatePicker).isBetween(eventStart, eventEnd, null, '[]', 'minute') ||
  //       (eventStart.isBefore(startDatePicker) && eventEnd.isAfter(endDatePicker)) ||
  //       (eventStart.isSameOrBefore(startDatePicker, 'minute') && eventEnd.isSameOrAfter(endDatePicker, 'minute'))
  //     );
  //   });

  //   if (overlap) {
  //     setShowOverlapAlert(true); // Show overlap alert
  //     return;
  //   }

  //   // Format the start and end times
  //   const startTime = startDatePicker.format('hh:mm A');
  //   const endTime = endDatePicker.format('hh:mm A');

  //   // Construct the event title with time
  //   const eventTitleWithTime = `${eventTitle} ${startTime} - ${endTime}`;

  //   const newEvent = {
  //     title: eventTitleWithTime,
  //     //title: eventTitle,
  //     start: startDatePicker.toISOString(),
  //     end: endDatePicker.toISOString()
  //   };

  //   setEvents([...events, newEvent]);
  //   closeModal();
  // };

  // const handleSaveEvent = () => {
  //   const currentDate = moment();

  //   if (!startDatePicker || !endDatePicker) {
  //     setShowAlert(true);
  //     return;
  //   }

  //   if (startDatePicker.isBefore(currentDate, 'day')) {
  //     setShowAlert(true);
  //     return;
  //   }
  //   console.log("startDatePicker type:", typeof startDatePicker);
  //   console.log("endDatePicker type:", typeof endDatePicker);

  //   // Check if the duration is less than one hour
  //   const duration = moment.duration(endDatePicker.diff(startDatePicker)).as('hours');
  //   if (duration < 1) {
  //     setMinTimeSlotAlert(true);
  //     return;
  //   }

  //   // Check if the start date is before 9 AM or the end date is after 6 PM
  //   const nineAM = moment(startDatePicker).set({ hour: 9, minute: 0, second: 0 });
  //   const sixPM = moment(endDatePicker).set({ hour: 18, minute: 0, second: 0 });

  //   if (startDatePicker.isBefore(nineAM) || endDatePicker.isAfter(sixPM)) {
  //     setShowTimeSlotAlert(true);
  //     return;
  //   }

  //   // Check if startDatePicker is a Moment object
  //   if (!moment.isMoment(startDatePicker) || !moment.isMoment(endDatePicker)) {
  //     console.error("startDatePicker or endDatePicker is not a Moment object.");
  //     return;
  //   }

  //   // Check for overlap with existing events
  //   const overlap = events.some(event => {
  //     const eventStart = moment(event.start);
  //     const eventEnd = moment(event.end);

  //     // Check if the new event overlaps with existing events
  //     return (
  //       startDatePicker.isBetween(eventStart, eventEnd, null, '[)') ||
  //       endDatePicker.isBetween(eventStart, eventEnd, null, '(]') ||
  //       (startDatePicker.isSameOrBefore(eventStart) && endDatePicker.isSameOrAfter(eventEnd)) ||
  //       (startDatePicker.isSameOrAfter(eventStart) && endDatePicker.isSameOrBefore(eventEnd))
  //     );
  //   });

  //   if (overlap) {
  //     setShowOverlapAlert(true); // Show overlap alert
  //     return;
  //   }

  //   // Format the start and end times
  //   const startTime = startDatePicker.format('hh:mm A');
  //   const endTime = endDatePicker.format('hh:mm A');

  //   // Construct the event title with time
  //   const eventTitleWithTime = `${eventTitle} ${startTime} - ${endTime}`;

  //   const newEvent = {
  //     title: eventTitleWithTime,
  //     start: startDatePicker.toISOString(),
  //     end: endDatePicker.toISOString()
  //   };

  //   setEvents([...events, newEvent]);
  //   closeModal();
  // };

  const handleSaveEvent = () => {
   // const currentDate = moment();

  
    // Check if the duration is less than one hour
    const duration = moment.duration(endDatePicker.diff(startDatePicker)).as('hours');
    if (duration < 1) {
      setMinTimeSlotAlert(true);
      return;
    }
  
    // Check if the start date is before 9 AM or the end date is after 6 PM
    const nineAM = moment(startDatePicker).set({ hour: 9, minute: 0, second: 0 });
    const sixPM = moment(endDatePicker).set({ hour: 18, minute: 0, second: 0 });
  
    if (startDatePicker.isBefore(nineAM) || endDatePicker.isAfter(sixPM)) {
      setShowTimeSlotAlert(true);
      return;
    }
     // Check for overlap with existing events based on time only
     const overlap = events.some(event => {
      const eventStartTime = moment(event.start).format('HH:mm'); // Extract start time
      const eventEndTime = moment(event.end).format('HH:mm'); // Extract end time
      const newEventStartTime = startDatePicker.format('HH:mm'); // Extract start time of new event
      const newEventEndTime = endDatePicker.format('HH:mm'); // Extract end time of new event
  
      // Check if the start or end time of the new event falls within the range of an existing event
      return (
        (newEventStartTime >= eventStartTime && newEventStartTime < eventEndTime) || // Check start time overlap
        (newEventEndTime > eventStartTime && newEventEndTime <= eventEndTime) // Check end time overlap
      );
    });
  
    if (overlap) {
      setShowOverlapAlert(true); // Show overlap alert
      return;
    }
  
    // Format the start and end times
    const startTime = startDatePicker.format('hh:mm A');
    const endTime = endDatePicker.format('hh:mm A');
  
    // Construct the event title with time
    const eventTitleWithTime = `${eventTitle} ${startTime} - ${endTime}`;
  
    // Check if the new event already exists in the events array
    const eventExists = events.some(event => event.title === eventTitleWithTime);
  
    if (!eventExists) {
      const newEvent = {
        title: eventTitleWithTime,
        start: startDatePicker.toISOString(),
        end: endDatePicker.toISOString()
      };
  
      setEvents([...events, newEvent]);
    }
  
    closeModal();
  };
  

  const handleTitleChange = (e) => {
    setEventTitle(e.target.value);
  };

  const onChangeStartDate = (date, dateString) => {
    console.log("Selected Start Date:", date); // Check the selected date value
    console.log("Formatted Start Date String:", dateString); // Check the formatted date string
    setStartDatePicker(date);
  };

  const onChangeEndDate = (date, dateString) => {
    console.log("Selected Start Date:", date); // Check the selected date value
    console.log("Formatted Start Date String:", dateString); // Check the formatted date string
    setEndDatePicker(date);
  };

  const dayCellContent = (arg) => {
    const today = moment().startOf('day');
    const cellDate = moment(arg.date).startOf('day');
    if (cellDate.isBefore(today)) {
      return {
        html: '<div class="fc-day fc-day-past">' + arg.dayNumberText + '</div>',
      };
    } else {
      return arg.dayNumberText;
    }
  };

  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
        }}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        dateClick={handleDateClick}
        dayMaxEvents={true}
        dayCellContent={dayCellContent} // custom rendering for day cell content
        eventDisplay="block"
      />
      <Modal
        title="Add Event"
        open={modalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>Cancel</Button>,
          <Button key="save" type="primary" onClick={handleSaveEvent}>Save</Button>
        ]}
      >
        <label className="modal-label" htmlFor="title">Title:</label>
        <Input
          className="modal-input"
          placeholder="Title"
          value={eventTitle}
          onChange={handleTitleChange}
        />
        <label className="modal-label" htmlFor="startDate">Start Date:</label>
        <DatePicker
          className="modal-input"
          value={startDatePicker}
          onChange={onChangeStartDate}
          showTime={{ format: 'hh:mm A' }}
          format="YYYY-MM-DD hh:mm A"
          showNow={false}
          disabledDate={(current) => current && current < moment().startOf('day')}
        />
        <label className="modal-label" htmlFor="endDate">End Date:</label>
        <DatePicker
          className="modal-input"
          value={endDatePicker}
          onChange={onChangeEndDate}
          showTime={{ format: 'hh:mm A' }}
          format="YYYY-MM-DD hh:mm A"
          showNow={false}
          disabledDate={(current) => current && current < moment().startOf('day')}
        />
      </Modal>
      {/* {showAlert && (
        <Modal
          title="Warning"
          open={showAlert}
          onCancel={() => setShowAlert(false)}
          footer={[
            <Button key="close" onClick={() => setShowAlert(false)}>Close</Button>
          ]}
        >
          <p>Previous dates cannot be created or updated.</p>
        </Modal>
      )} */}
      {showTimeSlotAlert && (
        <Modal
          title="Warning"
          open={showTimeSlotAlert}
          onCancel={() => setShowTimeSlotAlert(false)}
          footer={[
            <Button key="close" onClick={() => setShowTimeSlotAlert(false)}>Close</Button>
          ]}
        >
          <p>Slot booking is only available between 9 AM to 6 PM.</p>
        </Modal>
      )}
      {minTimeSlotAlert && (
        <Modal
          title="Warning"
          open={minTimeSlotAlert}
          onCancel={() => setMinTimeSlotAlert(false)}
          footer={[
            <Button key="close" onClick={() => setMinTimeSlotAlert(false)}>Close</Button>
          ]}
        >
          <p>Minimum duration for a slot is one hour.</p>
        </Modal>
      )}
      {showOverlapAlert && (
        <Modal
          title="Warning"
          open={showOverlapAlert}
          onCancel={() => setShowOverlapAlert(false)}
          footer={[
            <Button key="close" onClick={() => setShowOverlapAlert(false)}>Close</Button>
          ]}
        >
          <p>Slot booking overlaps with existing bookings.</p>
        </Modal>
      )}
    </div>
  );
}

export default App;
