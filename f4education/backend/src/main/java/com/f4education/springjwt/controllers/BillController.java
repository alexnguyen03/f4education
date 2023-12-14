package com.f4education.springjwt.controllers;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.BillInformation;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.security.services.BillInformationServiceImp;
import com.f4education.springjwt.security.services.BillServiceImp;
import com.f4education.springjwt.security.services.RegisterCourseServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bills")
public class BillController {
	@Autowired
	BillServiceImp billService;
	@Autowired
	BillInformationServiceImp billInformationServiceImp;

	@Autowired
	RegisterCourseServiceImp registerCourseService;

	@GetMapping
	public ResponseEntity<?> findAll() {
		List<BillResponseDTO> lst = billService.getAllBill();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{billId}")
	public ResponseEntity<?> findById(@PathVariable("billId") Integer billId) {
		if (billId == null) {
			return ResponseEntity.badRequest().build();
		} else {
			BillResponseDTO bill = billService.getBillById(billId);

			if (bill == null) {
				return ResponseEntity.noContent().build();
			}

			return ResponseEntity.ok(bill);
		}
	}

	@PostMapping
	public ResponseEntity<?> createBill(@RequestBody BillRequestDTO billRequest) {
		if (billRequest == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		BillResponseDTO bill = billService.createBill(billRequest);

		if (bill == null) {
			return ResponseEntity.badRequest().build();
		}

		// create URI
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{billId}").buildAndExpand(bill.getBillId())
				.toUri();

		return ResponseEntity.created(uri).body(bill);
	}

	@PutMapping("/{billId}")
	public ResponseEntity<?> updateBill(@PathVariable("billId") Integer billId,
			@RequestBody BillRequestDTO billRequest) {
		if (billId == null) {
			return ResponseEntity.badRequest().body("message: where my id? u kd m?");
		} else {
			BillResponseDTO bill = billService.updateBill(billId, billRequest);

			if (bill == null) {
				Map<String, String> response = new HashMap<>();
				response.put("status", "" + HttpStatus.NO_CONTENT);
				response.put("message", "it NULL BILL, tf u giving me bro?");
				return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
			}

			return ResponseEntity.ok(bill);
		}
	}

	@GetMapping("/bill-history/{studentId}")
	public ResponseEntity<?> getAllByBillInformation(@PathVariable("studentId") String studentId) {
		List<BillInformation> billInformation = billInformationServiceImp.getAllByBillInformation(studentId);
		return ResponseEntity.ok(billInformation);
	}

	@PostMapping("/create-register-course")
	public HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
			@RequestBody RegisterCourseRequestDTO registerCourseRequestDTO) {
		return registerCourseService.createRegisterCourse(registerCourseRequestDTO);
	}
}
