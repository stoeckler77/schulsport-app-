<thead>
  <tr>
    <th>Titel</th>
    <th>Leitung</th>
    <th>Anfangsdatum</th>
    <th>Enddatum</th>
    <th>Wochentag</th>
    <th>Zeit</th>
    <th>Status</th>
    <th>Aktionen</th>
  </tr>
</thead>

<tbody>
  {courses.map(course => (
    <tr key={course._id}>
      <td>{course.title}</td>
      <td>{course.teacher}</td>
      <td>
        {course.startDate ? (
          <span className="badge bg-info text-dark">
            <i className="bi bi-calendar-event me-1"></i>
            {new Date(course.startDate).toLocaleDateString('de-CH')}
          </span>
        ) : '-'}
      </td>
      <td>
        {course.endDate ? (
          <span className="badge bg-secondary text-white">
            <i className="bi bi-calendar-check me-1"></i>
            {new Date(course.endDate).toLocaleDateString('de-CH')}
          </span>
        ) : '-'}
      </td>
      <td>{course.dayOfWeek}</td>
      <td>{course.timeStart} - {course.timeEnd}</td>
      <td>
        <span className={`badge ${course.status === 'Angebot findet statt' ? 'bg-success' : 
                                  course.status === 'Angebot findet nicht statt' ? 'bg-danger' : 
                                  'bg-warning'}`}>
          {course.status}
        </span>
      </td>
      <td>
        {/* Action buttons */}
      </td>
    </tr>
  ))}
</tbody> 