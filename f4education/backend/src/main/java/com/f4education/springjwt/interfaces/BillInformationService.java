package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.BillInformation;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;

@Service
public interface BillInformationService {
	List<BillInformation> getAllByBillInformation(String studentId, Integer courseId);
}