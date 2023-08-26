package com.f4education.springjwt.models;

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
@Table(name = "ResourcesHistory")
public class ResourcesHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "resources_history_id")
	private Integer resourcesHistoryId;

	private String action;

	@Column(name = "modify_date")
	private Date modifyDate;
	
	@Column(name = "resources_name")
	private String resourcesName;

	private String link;
	
	@Column(name = "course_id")
	private Integer courseId;
	
	@Column(name = "admin_id")
	private String adminId;
	
	@ManyToOne
	@JoinColumn(name = "resources_id")
	Resources resources;

	@Override
	public String toString() {
		return "ResourcesHistory [resourcesHistoryId=" + resourcesHistoryId + ", action=" + action + ", modifyDate="
				+ modifyDate + ", resourcesName=" + resourcesName + ", link=" + link + ", courseId=" + courseId
				+ ", adminId=" + adminId + "]";
	} 	
}
