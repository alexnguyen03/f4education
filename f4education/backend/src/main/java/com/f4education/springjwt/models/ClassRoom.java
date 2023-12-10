package com.f4education.springjwt.models;

import java.io.Serializable;
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

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Classroom")
public class ClassRoom implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "classroom_id")
	private Integer classroomId;

	@Column(name = "classroom_name")
	private String classroomName;

	private String status;

	@OneToMany(mappedBy = "classRoom")
	List<Schedule> schedules;

	@OneToMany(mappedBy = "classRoom")
	List<ClassRoomHistory> classRoomHistories;

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@Override
	public String toString() {
		return "ClassRoom [classroomId=" + classroomId + ", classroomName=" + classroomName + ", status=" + status
				+ "]";
	}
}
