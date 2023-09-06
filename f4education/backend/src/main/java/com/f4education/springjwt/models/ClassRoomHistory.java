package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Classroomhistory")
public class ClassRoomHistory implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "classroom_history_id")
	private Integer classroomHistoryId;

	private String action;

	@Column(name = "modify_date")
	private Date modifyDate;
	
	@Column(name = "classroom_name")
	private String classroomName;
	
	private String status;
	
	@Column(name = "admin_id")
	private String adminId;
	
	@ManyToOne
	@JoinColumn(name = "classroom_id")
	ClassRoom classRoom;

	@Override
	public String toString() {
		return "ClassRoomHistory [classroomHistoryId=" + classroomHistoryId + ", action=" + action + ", modifyDate="
				+ modifyDate + ", classroomName=" + classroomName + ", status=" + status + ", adminId=" + adminId
				+ ", classRoom=" + classRoom + "]";
	}
}
