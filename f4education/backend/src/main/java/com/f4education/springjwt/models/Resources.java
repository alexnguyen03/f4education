package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
import jakarta.persistence.OneToMany;
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
@Table(name = "Resources")
public class Resources {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "resources_id")
	private Integer resourcesId;

	@Column(name = "resources_name")
	private String resourcesName;
	
	@Column(name = "folder_name")
	private String folderName;

	private String link;
	
	@JsonIgnore
	@OneToMany(mappedBy = "resources")
	List<ResourcesHistory> resourcesHistories;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "course_id")
	Course course; 
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@Override
	public String toString() {
		return "Resources [resourcesId=" + resourcesId + ", resourcesName=" + resourcesName + ", link=" + link + "]";
	} 
	
}
