package com.f4education.springjwt.payload.request;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCourseRequestDTO {
	private Integer registerCourseId;

	@JsonProperty("courseId")
	private Integer courseId;

	private String studentId;

	@JsonProperty("teacherId")
	private String teacherId;

	private Integer classId;

	@JsonProperty("listRegisterCourseIdToAdd")
	private List<Integer> listRegisterCourseIdToAdd;

	@JsonProperty("listRegisterCourseIdToDelete")
	private List<Integer> listRegisterCourseIdToDelete;
}
