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
      <td>{course.startDate ? new Date(course.startDate).toLocaleDateString('de-CH') : '-'}</td>
      <td>{course.endDate ? new Date(course.endDate).toLocaleDateString('de-CH') : '-'}</td>
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