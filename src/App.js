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
    const currentDate = moment();
    const clickedDateTime = moment(arg.date).set({
      hour: moment().hour(),
      minute: moment().minute(),
      second: moment().second()
    });
    // Calculate the end time of the selected slot
    const endDateTime = moment(clickedDateTime).add(1, 'hour');
    // Check if the duration is less than one hour
    if (endDateTime.isBefore(moment(arg.date))) {
      setMinTimeSlotAlert(true);
      return;
    }
    // Check if the clicked date is before the current date
    if (clickedDateTime.isBefore(currentDate, 'day')) {
      return false;
    }

    //setStartDatePicker(clickedDateTime);
    //setEndDatePicker(endDateTime);
    setEventTitle('');
    setModalOpen(true);
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

  const handleSaveEvent = () => {
    // Check if the duration is less than one hour
    const duration = moment.duration(endDatePicker.diff(startDatePicker)).as('hours');
    if (duration < 1) {
      setMinTimeSlotAlert(true);
      return;
    }

    const eventStartHour = startDatePicker.hour();

    if (eventStartHour < 9 || eventStartHour >= 18) {
      setShowTimeSlotAlert(true);
      return;
    }

    // Check for overlap with existing events on the same date based on time only
    const overlap = events.some(event => {
      const eventStartDate = moment(event.start).format('YYYY-MM-DD'); // Extract start date
      const newEventStartDate = startDatePicker.format('YYYY-MM-DD'); // Extract start date of new event

      // Check if the events occur on the same date
      if (eventStartDate !== newEventStartDate) {
        return false; // No overlap if events are on different dates
      }

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

    // Create the new event
    const newEvent = {
      title: eventTitleWithTime,
      start: startDatePicker.toISOString(),
      end: endDatePicker.toISOString()
    };

    // Add the new event to the events array
    setEvents([...events, newEvent]);

    // Close the modal
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
