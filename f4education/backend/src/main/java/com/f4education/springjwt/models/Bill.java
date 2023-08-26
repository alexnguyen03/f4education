package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Bill")
public class Bill {
	@OneToMany(mappedBy = "bill")
	List<DetailInvoice> detailInvoice;
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student;
	@ManyToOne
	@JoinColumn(name = "payment_method_id")
	PaymentMethod paymentMethod;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bill_id")
	private Integer billId;
	@Column(name = "create_date")
	private Date createDate;
	@Column(name = "total_price")
	private Float totalPrice;
	@Column(name = "status")
	private String status;
	@Column(name = "note")
	private String note;

	@Override
	public String toString() {
		return "Bill{" +
				"billId=" + billId +
				", createDate=" + createDate +
				", totalPrice=" + totalPrice +
				", status='" + status + '\'' +
				", note='" + note + '\'' +
				'}';
	}
}
