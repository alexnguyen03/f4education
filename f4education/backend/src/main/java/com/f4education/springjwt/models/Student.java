package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

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

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	List<Bill> bills;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	List<Evaluate> evaluates;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	List<Point> points;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	List<RegisterCourse> registerCourses;

	@JsonIgnore
	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	List<QuizResult> quizResults;

	@OneToMany(mappedBy = "student")
	@Access(AccessType.PROPERTY)
	private List<Attendance> attendances;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "account_id")
	User user;

	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", fullname=" + fullname + ", gender=" + gender + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}

	public List<Bill> getBills() {
		return new ArrayList<>(bills);
	}

	public void setBills(List<Bill> bills) {
		this.bills = bills;
	}

	public List<Evaluate> getEvaluates() {
		return new ArrayList<>(evaluates);
	}

	public void setEvaluates(List<Evaluate> evaluates) {
		this.evaluates = evaluates;
	}

	public List<Point> getPoints() {
		return new ArrayList<>(points);
	}

	public void setPoints(List<Point> points) {
		this.points = points;
	}

	public List<RegisterCourse> getRegisterCourses() {
		return new ArrayList<>(registerCourses);
	}

	public void setRegisterCourses(List<RegisterCourse> registerCourses) {
		this.registerCourses = registerCourses;
	}

	public List<QuizResult> getQuizResults() {
		return new ArrayList<>(quizResults);
	}

	public void setQuizResults(List<QuizResult> quizResults) {
		this.quizResults = quizResults;
	}

	public List<Attendance> getAttendances() {
		return new ArrayList<>(attendances);
	}

	public void setAttendances(List<Attendance> attendances) {
		this.attendances = attendances;
	}
//	public void setAttendances(List<Attendance> attendances) {
//		this.attendances = new ArrayList<>(attendances);
//	}
//
//	public void setEvaluates(List<Evaluate> evaluates) {
//		this.evaluates = new ArrayList<>(evaluates);
//	}
//
//	public void setPoint(List<Point> points) {
//		this.points = new ArrayList<>(points);
//	}
//
//	public void setRegisterCourses(List<RegisterCourse> registerCourses) {
//		this.registerCourses = new ArrayList<>(registerCourses);
//	}
//
//	public void setQuizResults(List<QuizResult> quizResults) {
//		this.quizResults = new ArrayList<>(quizResults);
//	}
//
//	public void setBills(List<Bill> bills) {
//		this.bills = new ArrayList<>(bills);
//	}

}
