package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.BillService;
import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.repository.BillRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.PaymentMethodRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class BillServiceImp implements BillService {
	@Autowired
	private BillRepository billRepository;

	@Autowired
	private PaymentMethodRepository paymentMethodRepository;

	@Autowired
	private StudentRepository studentRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Override
	public List<BillResponseDTO> getAllBill() {
		List<BillResponseDTO> bills = billRepository.findAll().stream().map(this::convertToReponseDTO)
				.collect(Collectors.toList());
		return bills;
	}

	@Override
	public BillResponseDTO getBillById(Integer billId) {
		Optional<Bill> billOptional = billRepository.findById(billId);
		if (billOptional.isPresent()) {
			Bill bill = billOptional.get();
			return this.convertToReponseDTO(bill);
		}
		return null;
	}

	@Override
	public BillResponseDTO createBill(BillRequestDTO billRequestDTO) {
		Bill bill = this.convertRequestToEntity(billRequestDTO);

		bill.setCreateDate(new Date());
		bill.setStatus("Đã thanh toán");
		bill.setNote("");

		Bill newBill = billRepository.save(bill);

		return this.convertToReponseDTO(newBill);
	}

	@Override
	public BillResponseDTO updateBill(Integer billId, BillRequestDTO billRequestDTO) {
		Optional<Bill> exitBill = billRepository.findById(billId);

		if (exitBill.isPresent()) {
			Bill bill = exitBill.get();
			
			convertRequestToEntity(billRequestDTO, bill);

			Bill updateBill = billRepository.save(bill);
			return this.convertToReponseDTO(updateBill);
		}
		return null;
	}

	private BillResponseDTO convertToReponseDTO(Bill bill) {
		BillResponseDTO billRespDTO = new BillResponseDTO();

		PaymentMethod paymentMethod = paymentMethodRepository.findById(bill.getPaymentMethod().getPaymentMethodId())
				.get();

		BeanUtils.copyProperties(bill, billRespDTO);

		billRespDTO.setPaymentMethod(paymentMethod.getPaymentMethodName());
		billRespDTO.setCourseId(bill.getCourse().getCourseId());
		billRespDTO.setStatus(bill.getStatus());
		billRespDTO.setTotalPrice(bill.getTotalPrice());

		return billRespDTO;
	}

	private Bill convertRequestToEntity(BillRequestDTO billRequestDTO) {
		Bill bill = new Bill();
		
		PaymentMethod paymentMethod = paymentMethodRepository
				.findById(billRequestDTO.getCheckoutMethodId()).get();
		Student student = studentRepository.findById(billRequestDTO.getStudentId()).get();
		Course course = courseRepository.findById(billRequestDTO.getCourseId()).get();

		BeanUtils.copyProperties(billRequestDTO, bill);
		
		bill.setTotalPrice(billRequestDTO.getTotalPrice());
		bill.setPaymentMethod(paymentMethod);
		bill.setStudent(student);
		bill.setCourse(course);

		return bill;
	}

	private void convertRequestToEntity(BillRequestDTO billRequestDTO, Bill bill) {
		
		PaymentMethod paymentMethod = paymentMethodRepository
				.findById(billRequestDTO.getCheckoutMethodId()).get();
		Student student = studentRepository.findById(billRequestDTO.getStudentId()).get();
		Course course = courseRepository.findById(billRequestDTO.getCourseId()).get();

		BeanUtils.copyProperties(billRequestDTO, bill);

		bill.setTotalPrice(billRequestDTO.getTotalPrice());
		bill.setPaymentMethod(paymentMethod);
		bill.setStudent(student);
		bill.setCourse(course);
	}
}
