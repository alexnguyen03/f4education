package com.f4education.springjwt.models;

import java.util.List;

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
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Student")
public class Student {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "student_id")
	private Integer studentId;

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
	
	@OneToMany(mappedBy = "student")
	List<Attendance> attendances;
	
	@OneToMany(mappedBy = "student")
	List<Bill> bills;
	
	@OneToMany(mappedBy = "student")
	List<Evaluate> evaluates;
	
	@OneToMany(mappedBy = "student")
	List<Point> points;
	
	@OneToMany(mappedBy = "student")
	List<RegisterCourse> registerCourses;
	
	@OneToMany(mappedBy = "student")
	List<Schedule> schedules;
	
	@ManyToOne
	@JoinColumn(name = "account_id")
	User user;

	@Override
	public String toString() {
		return "Student [studentId=" + studentId + ", fullname=" + fullname + ", gender=" + gender + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}
}
