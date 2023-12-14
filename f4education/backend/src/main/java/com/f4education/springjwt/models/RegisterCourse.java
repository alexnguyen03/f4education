package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.internal.util.stereotypes.Lazy;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Registercourse")
public class RegisterCourse implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Lazy
	@Column(name = "register_course_id")
	private Integer registerCourseId;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "course_price")
	private Float coursePrice;

	@Column(name = "course_duration")
	private Integer courseDuration;

	@Column(name = "course_description")
	private String courseDescription;

	@Column(name = "registration_date")
	private Date registrationDate;

	private String status;

	private String image;

	@JsonIgnore
	@Access(AccessType.PROPERTY)
	@OneToMany(mappedBy = "registerCourse")
	List<Certificate> certificates;

	@OneToMany(mappedBy = "registerCourse")
	@JsonIgnore
	@Access(AccessType.PROPERTY)
	List<Evaluate> evaluates;

	@ManyToOne
	@JoinColumn(name = "student_id")
	@JsonIgnore
	Student student;

	@ManyToOne
	@JoinColumn(name = "course_id")
	@JsonIgnore
	Course course;

	@ManyToOne
	@JoinColumn(name = "class_id")
	@JsonIgnore
	Classes classes;

	public List<Certificate> getCertificates() {
		return certificates;
	}

	public void setCertificate(List<Certificate> certificates) {
		this.certificates = certificates;
	}

	public List<Evaluate> getEvaluates() {
		return evaluates;
	}

	public void setEvaluates(List<Evaluate> evaluates) {
		this.evaluates = evaluates;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		RegisterCourse that = (RegisterCourse) o;
		return Objects.equals(registerCourseId, that.registerCourseId) && Objects.equals(startDate, that.startDate)
				&& Objects.equals(endDate, that.endDate) && Objects.equals(coursePrice, that.coursePrice)
				&& Objects.equals(courseDuration, that.courseDuration)
				&& Objects.equals(courseDescription, that.courseDescription)
				&& Objects.equals(registrationDate, that.registrationDate) && Objects.equals(status, that.status)
				&& Objects.equals(image, that.image) && Objects.equals(certificates, that.certificates)
				&& Objects.equals(evaluates, that.evaluates) && Objects.equals(student, that.student)
				&& Objects.equals(course, that.course) && Objects.equals(classes, that.classes);
	}

	@Override
	public int hashCode() {
		return Objects.hash(registerCourseId, startDate, endDate, coursePrice, courseDuration, courseDescription,
				registrationDate, status, image, certificates, evaluates, student, course, classes);
	}

	@Override
	public String toString() {
		return "RegisterCourse{" +
				"registerCourseId=" + registerCourseId +
				", coursePrice=" + coursePrice +
				", courseDuration='" + courseDuration + '\'' +
				", registrationDate=" + registrationDate +
				", status='" + status + '\'' +
				", image='" + image + '\'' +
				'}';
	}
}
