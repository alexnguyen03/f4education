package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Schedule")
public class Schedule implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schedule_id")
	private Integer scheduleId;

	@Column(name = "study_date")
	private Date studyDate;

	private String contents;
	@Column(name = "is_practice")

	private Boolean isPractice;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "classroom_id")
	ClassRoom classRoom;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "session_id")
	private Sessions sessions;

	@Override
	public String toString() {
		return "Schedule [scheduleId=" + scheduleId + ", studyDate=" + studyDate + ", contents=" + contents
				+ ", isPractice=" + isPractice + ", admin=" + admin + ", classes=" + classes + ", classRoom="
				+ classRoom + ", sessions=" + sessions + "]";
	}
}
