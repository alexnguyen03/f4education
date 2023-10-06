package com.f4education.springjwt.models;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "roles")
public class Role {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Enumerated(EnumType.STRING)
	@Column(length = 20)
	private ERole name;

	@OneToMany(mappedBy = "role")
	List<Account_role> accountRoles;

	@Override
	public String toString() {
		return "Role [id=" + id + ", name=" + name + "]";
	}
}