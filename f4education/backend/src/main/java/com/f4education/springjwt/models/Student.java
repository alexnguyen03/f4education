package com.f4education.springjwt.models;

import java.io.Serializable;
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
@Table(name = "Student")
public class Student implements Serializable {

	@Id
	@Column(name = "student_id")
	private String studentId;

	@Column(name = "fullname")
	private String fullname;

	@Column(name = "gender")
	private Boolean gender;

	@Column(name = "address")
	private String address;

	@Column(name = "phone")
	private String phone;

	@Column(name = "image")
	private String image;

	// @JsonIgnore
	// @OneToMany(mappedBy = "student")
	// List<Attendance> attendances;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<Bill> bills;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<Evaluate> evaluates;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<Point> points;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<RegisterCourse> registerCourses;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<Cart> carts;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<QuizResult> quizResults;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	List<Attendance> attendances;

	// @JsonIgnore
	// @OneToMany(mappedBy = "student")
	// List<Schedule> schedules;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "account_id")
	User user;

	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", fullname=" + fullname + ", gender=" + gender + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}

	public Student(String studentId, String fullname, Boolean gender, String address, String phone, String image) {
		super();
		this.studentId = studentId;
		this.fullname = fullname;
		this.gender = gender;
		this.address = address;
		this.phone = phone;
		this.image = image;
	}
}
