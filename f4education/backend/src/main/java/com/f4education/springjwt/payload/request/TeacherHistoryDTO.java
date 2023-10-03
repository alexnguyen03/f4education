package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.f4education.springjwt.models.TeacherHistory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherHistoryDTO {

	private Integer teacherHistoryId;

	private Date modifyDate;

	private String action;

	private String teacherId;

	private String fullname;

	private Boolean gender;

	private Date dateOfBirth;

	private String citizenIdentification;

	private String address;

	private String levels;

	private String phone;

	private String image;

	private String adminName;

	public TeacherHistoryDTO(TeacherHistory teacherHistory) {
		this.teacherHistoryId = teacherHistory.getTeacherHistoryId();
		this.action = teacherHistory.getAction();
		this.teacherId = teacherHistory.getTeacher().getTeacherId();
		this.fullname = teacherHistory.getFullname();
		this.gender = teacherHistory.getGender();
		this.dateOfBirth = teacherHistory.getDateOfBirth();
		this.modifyDate = teacherHistory.getModifyDate();
		this.citizenIdentification = teacherHistory.getCitizenIdentification();
		this.address = teacherHistory.getAddress();
		this.phone = teacherHistory.getPhone();
		this.image = teacherHistory.getImage();
		this.levels = teacherHistory.getLevels();
		this.adminName = teacherHistory.getUser().getAdmins().get(0).getFullname();
	}
}
