import React, { useState } from 'react';

export default function Activity() {
  const [activity, setActivity] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/addActivity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: activity,
          deadline,
          status: 'In Progress', // Assuming status is always 'In Progress' for new activities
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Reset form fields after successful submission
      setActivity('');
      setDeadline('');
      console.log('Activity added successfully');
      alert("Activity added successfully")
    } catch (error) {
      console.error('Error adding activity:', error.message);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Add Activity</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="activityInput" className="form-label">Activity:</label>
          <input
            type="text"
            className="form-control"
            id="activityInput"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="deadlineInput" className="form-label">Deadline:</label>
          <input
            type="date"
            className="form-control"
            id="deadlineInput"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
