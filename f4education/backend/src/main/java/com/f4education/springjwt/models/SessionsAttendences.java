package com.f4education.springjwt.models;

import jakarta.persistence.*;

@Entity
@Table(name = "sessions_attendence")
public class SessionsAttendences {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "session_attendance_id")
	private Integer sessionAttendanceId;
	@ManyToOne
	@JoinColumn(name = "session_id")
	private Sessions sessions;
	@ManyToOne
	@JoinColumn(name = "attendence_id")
	private Attendance attendence;
}
