package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Subject")
public class Subject implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "subject_id")
	private Integer subjectId;

	@Column(name = "subject_name")
	private String subjectName;

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;
	
	@Column(name="create_date")
	private Date createDate;

	@JsonIgnore
	@OneToMany(mappedBy = "subject")
	List<SubjectHistory> subjectHistories;

	@OneToMany(mappedBy = "subject")
	@JsonIgnore
	List<Course> courses;

	@Override
	public String toString() {
		return "Subject [subjectId=" + subjectId + ", subjectName=" + subjectName + "]";
	}
}
