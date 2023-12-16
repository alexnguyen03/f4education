package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Certificate")
public class Certificate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "certificate_id")
	private Integer certificateId;

	@Column(name = "certificate_name")
	private String certificateName;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;

	@Column(name = "create_date")
	private Date createDate;

	@ManyToOne
	@JoinColumn(name = "register_course_id")
	@JsonIgnore
	RegisterCourse registerCourse;

	public RegisterCourse getRegisterCourse() {
		return registerCourse;
	}

	public void setRegisterCourse(RegisterCourse registerCourse) {
		this.registerCourse = registerCourse;
	}

	@Override
	public String toString() {
		return "Certificate [certificateId=" + certificateId + ", certificateName=" + certificateName + ", startDate="
				+ startDate + ", endDate=" + endDate + "]";
	}

}
