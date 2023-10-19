package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Schedule")
public class Schedule {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schedule_id") 
	private Integer scheduleId;
	@Column(name = "study_date")
	private Date studyDate;
	private String contents;
	private String note;
	@OneToMany(mappedBy = "schedule")
	List<Attendance> attendances;
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;
	@ManyToOne
	@JoinColumn(name = "classroom_id")
	ClassRoom classRoom;
	@ManyToOne
	@JoinColumn(name = "session_id")
	private Sessions sessions;

	@Override
	public String toString() {
		return "Schedule [scheduleId=" + scheduleId + ", studyDate=" + studyDate + ", contents=" + contents + ", note="
				+ note + "]";
	}
}
