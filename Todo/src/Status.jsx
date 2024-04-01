import React, { useState, useEffect } from 'react';

export default function Status() {
 const [activities, setActivities] = useState([]);
 const [badge, setBadge] = useState('none');

 useEffect(() => {
  // Fetch activities and sort them by deadline
  fetch('http://localhost:8000/api/v1/getActivities')
     .then(response => response.json())
     .then(data => {
       const sortedActivities = data.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
       setActivities(sortedActivities);
       // Fetch performance data
       fetch('http://localhost:8000/api/v1/performance')
         .then(response => response.json())
         .then(data => {
           console.log(data);
           setBadge(data.badge);
         }) // Corrected placement of closing bracket
         .catch(error => console.error('Error fetching performance data: ', error)); // Corrected placement of closing bracket
     })
     .catch(error => console.error('Error fetching activities: ', error));
 }, []); // Empty dependency array means this effect runs once on mount
 
 
 const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    return `${month}/${day}/${year}`;
 };

 const getStatus = (activity) => {
    const currentDate = new Date();
    const deadlineDate = new Date(activity.deadline);

    if (activity.status === 'Completed') {
      return 'Completed';
    } else if (activity.status === 'Cancelled') {
      return 'Cancelled';
    } else if (currentDate > deadlineDate) {
      return 'Pending';
    } else {
      return 'In progress';
    }
 };

 const updateActivityStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/updateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) {
        throw new Error('Failed to update activity status');
      }
      const updatedActivity = await response.json();
      // Update the local state to reflect the change
      setActivities(prevActivities =>
        prevActivities.map(activity =>
          activity._id === id ? { ...activity, status: updatedActivity.status } : activity
        )
      );
    } catch (error) {
      console.error('Error updating activity status:', error);
    }
 };

 const handleActionChange = (id, status) => {
    // Assuming 'status' is the new status value
    updateActivityStatus(id, status);
 };

 return (
  <div className="">
       <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Serial No</th>
            <th>Activity</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => {
            const status = getStatus(activity);
            let badgeColor;
            switch (status) {
              case 'Completed':
                badgeColor = 'badge-success';
                break;
              case 'Cancelled':
                badgeColor = 'badge-danger';
                break;
              case 'Pending':
                badgeColor = 'badge-warning';
                break;
              case 'In progress':
                badgeColor = 'badge-primary';
                break;
              default:
                badgeColor = 'badge-secondary';
            }
            return (
              <tr key={activity._id}>
                <td className="align-middle">{index + 1}</td>
                <td className="align-middle">{activity.task}</td>
                <td className="align-middle">{formatDate(activity.deadline)}</td>
                <td className="align-middle">
                 <span className={`badge ${badgeColor}`}>{status}</span>
                </td>
                <td className="align-middle">
                 {(status === 'In progress' || status === 'Pending') && (
                    <select
                      value={activity.status}
                      onChange={(e) => handleActionChange(activity._id, e.target.value)}
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                 )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
 
 );
}
