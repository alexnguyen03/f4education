package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
	@JsonIgnore
	@Access(AccessType.PROPERTY)
	@OneToMany(mappedBy = "student")
	private List<EvaluationTeacher> evaluationTeachers;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "account_id")
	User user;

	public List<Attendance> getAttendances() {
		return new ArrayList<>(attendances);
	}

	public List<Bill> getBills() {
		return new ArrayList<>(bills);
	}

	public void setBills(List<Bill> bills) {
		this.bills = bills;
	}

	public List<EvaluationTeacher> getEvaluationTeachers() {
		return new ArrayList<>(evaluationTeachers);
	}

	public void setEvaluationTeachers(List<EvaluationTeacher> evaluationTeachers) {
		this.evaluationTeachers = evaluationTeachers;
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

	public void setAttendances(List<Attendance> attendances) {
		this.attendances = attendances;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Student student = (Student) o;
		return Objects.equals(studentId, student.studentId) && Objects.equals(fullname, student.fullname)
				&& Objects.equals(gender, student.gender) && Objects.equals(address, student.address)
				&& Objects.equals(phone, student.phone) && Objects.equals(image, student.image)
				&& Objects.equals(bills, student.bills) && Objects.equals(evaluates, student.evaluates)
				&& Objects.equals(points, student.points) && Objects.equals(registerCourses, student.registerCourses)
				&& Objects.equals(quizResults, student.quizResults) && Objects.equals(attendances, student.attendances)
				&& Objects.equals(user, student.user);
	}

	@Override
	public int hashCode() {
		return Objects.hash(studentId, fullname, gender, address, phone, image, bills, evaluates, points,
				registerCourses, quizResults, attendances, user);
	}

	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", fullname=" + fullname + ", gender=" + gender + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}

}
