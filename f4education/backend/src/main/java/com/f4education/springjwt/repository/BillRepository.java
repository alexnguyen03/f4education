package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.payload.request.BillInformation;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BillRepository extends JpaRepository<Bill, Integer> {
    @Query("SELECT MAX(b.billId) FROM Bill b")
    Integer getMaxBillId();
    
    @Query("SELECT new com.f4education.springjwt.payload.request.BillInformation(hd.billId, sp.courseName, hd.createDate, hd.status, sp.coursePrice, hd.totalPrice, pttt.paymentMethodName) "
			+ "FROM Bill hd "
			+ "JOIN Course sp ON hd.course.courseId = sp.courseId "
			+ "JOIN PaymentMethod pttt ON hd.paymentMethod.paymentMethodId = pttt.paymentMethodId "
			+ "WHERE hd.student.studentId = :studentId")
	public List<BillInformation> getAllByBillInformation(@Param("studentId") String studentId);
}