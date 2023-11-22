package com.f4education.springjwt.security.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.BillInformationService;
import com.f4education.springjwt.interfaces.BillService;
import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.BillInformation;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.repository.BillRepository;
import com.f4education.springjwt.repository.PaymentMethodRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class BillInformationServiceImp implements BillInformationService {
	@Autowired
	private BillRepository billRepository;

	@Override
	public List<BillInformation> getAllByBillInformation(String studentId) {
		List<BillInformation> billInformation = billRepository.getAllByBillInformation(studentId);
		return billInformation;
	}
}
