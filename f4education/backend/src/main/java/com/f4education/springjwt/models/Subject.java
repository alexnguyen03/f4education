package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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

	@Column(name = "create_date")
	private Date createDate;

	@JsonIgnore
	@OneToMany(mappedBy = "subject")
	List<SubjectHistory> subjectHistories;

	@OneToMany(mappedBy = "subject")
	@JsonIgnore
	List<Course> courses;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Subject subject = (Subject) o;
		return Objects.equals(subjectId, subject.subjectId) && Objects.equals(subjectName, subject.subjectName) && Objects.equals(admin, subject.admin) && Objects.equals(createDate, subject.createDate) && Objects.equals(subjectHistories, subject.subjectHistories) && Objects.equals(courses, subject.courses);
	}

	@Override
	public int hashCode() {
		return Objects.hash(subjectId, subjectName, admin, createDate, subjectHistories, courses);
	}

	@Override
	public String toString() {
		return "Subject [subjectId=" + subjectId + ", subjectName=" + subjectName + "]";
	}
}
