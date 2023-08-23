package com.f4education.springjwt.models;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "PaymentMethod")
public class PaymentMethod {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer paymentMethodId;

	private String paymentMethodName;
	
	@OneToMany(mappedBy = "paymentMethod")
	List<Bill> bills;
}
