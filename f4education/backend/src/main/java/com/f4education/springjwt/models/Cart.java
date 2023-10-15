package com.f4education.springjwt.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Cart")
public class Cart {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cart_id")
	private Integer cartId;

	@Column(name = "create_date")
	private Date createDate;

	@Column(name = "status")
	private Boolean status;

	@ManyToOne
	@JoinColumn(name = "student_id")
	@JsonIgnore
	Student student;

	@ManyToOne
	@JoinColumn(name = "course_id")
	@JsonIgnore
	Course course;

	@Override
	public String toString() {
		return "Cart [cartId=" + cartId + ", createDate=" + createDate + ", status=" + status + "]";
	}

}