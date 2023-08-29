package com.f4education.springjwt.models;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "SubjectHistory")
public class SubjectHistory implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "subject_history_id")
	private Integer subjectHistoryId;

	@Column(name = "action")
	private String action;

	@Column(name = "modify_date")
	private LocalDateTime modifyDate;

	@Column(name = "subject_name")
	private String subjectName;

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@ManyToOne
	@JoinColumn(name = "subject_id")
	Subject subject;

	@Override
	public String toString() {
		return "SubjectHistory [subjectHistoryId=" + subjectHistoryId + ", action=" + action + ", modifyDate="
				+ modifyDate + ", subjectName=" + subjectName + "]";
	}

}
