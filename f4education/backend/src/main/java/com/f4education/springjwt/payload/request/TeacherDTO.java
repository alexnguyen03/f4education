package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.f4education.springjwt.models.Teacher;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO {
	private String teacherId;

	private String fullname;

	private Boolean gender;

	private Date dateOfBirth;

	private String citizenIdentification;

	private String address;

	private String levels;

	private String phone;

	private String image;

	private Long acccountID;

	// private Long acccountAdmin;

	public TeacherDTO(Teacher teacher) {
		this.teacherId = teacher.getTeacherId();
		this.fullname = teacher.getFullname();
		this.gender = teacher.getGender();
		this.dateOfBirth = teacher.getDateOfBirth();
		this.citizenIdentification = teacher.getCitizenIdentification();
		this.address = teacher.getAddress();
		this.phone = teacher.getPhone();
		this.image = teacher.getImage();
		this.levels = teacher.getLevels();
		this.acccountID = teacher.getUser().getId();
	}
}
