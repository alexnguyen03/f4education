package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.Objects;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Bill")
public class Bill {
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

	@ManyToOne
	@JoinColumn(name = "course_id")
	@JsonIgnore
	Course course;

	@ManyToOne
	@JoinColumn(name = "student_id")
	@JsonIgnore
	Student student;

	@ManyToOne
	@JoinColumn(name = "payment_method_id")
	@JsonIgnore
	PaymentMethod paymentMethod;

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Bill bill = (Bill) o;
		return Objects.equals(billId, bill.billId) && Objects.equals(createDate, bill.createDate) && Objects.equals(totalPrice, bill.totalPrice) && Objects.equals(status, bill.status) && Objects.equals(note, bill.note) && Objects.equals(course, bill.course) && Objects.equals(student, bill.student) && Objects.equals(paymentMethod, bill.paymentMethod);
	}

	@Override
	public int hashCode() {
		return Objects.hash(billId, createDate, totalPrice, status, note, course, student, paymentMethod);
	}

	@Override
	public String toString() {
		return "Bill [billId=" + billId + ", createDate=" + createDate + ", totalPrice=" + totalPrice + ", status="
				+ status + ", note=" + note + "]";
	}

}
