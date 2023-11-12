package com.f4education.springjwt.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.interfaces.EvaluateService;
import com.f4education.springjwt.models.Evaluate;
import com.f4education.springjwt.payload.request.EvaluateRequestDTO;
import com.f4education.springjwt.payload.response.EvaluateResponse;
import com.f4education.springjwt.repository.EvaluateRepository;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/evaluate")
@RequiredArgsConstructor
public class EvaluateController {
	@Autowired
	EvaluateService evaluateService;

	@Autowired
	EvaluateRepository evalueEvaluateRepository;

	@GetMapping
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllEvaluate() {
		List<EvaluateResponse> list = evaluateService.getAllEvaluate();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{evaluateId}")
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getEvaluateById(@PathVariable Integer evaluateId) {
		EvaluateResponse list = evaluateService.getEvaluateById(evaluateId);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/course/{courseId}")
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllEvaluateByCourseId(@PathVariable Integer courseId) {
		List<EvaluateResponse> list = evaluateService.getAllEvaluateByCourseId(courseId);
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<?> createEvaluate(@RequestBody EvaluateRequestDTO evaluateRequest) {
		EvaluateResponse evaluate = evaluateService.createEvaluate(evaluateRequest);

		if (evaluate == null) {
			return ResponseEntity.ok("");
		}

		return ResponseEntity.ok(evaluate);
	}

	@PutMapping("/{evaluateId}")
	public ResponseEntity<?> updateEvaluate(@PathVariable Integer evaluateId,
			@RequestBody EvaluateRequestDTO evaluateRequest) {
		EvaluateResponse evaluate = evaluateService.updateEvaluateDTO(evaluateId, evaluateRequest);

		if (evaluate == null) {
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.ok(evaluate);
	}

	@DeleteMapping("/{evaluateId}")
	public ResponseEntity<?> deleteEvaluate(@PathVariable Integer evaluateId) {
		Optional<Evaluate> existingEvaluate = evalueEvaluateRepository.findById(evaluateId);

		if (existingEvaluate.isPresent()) {
			evaluateService.deleteEvaluateDTO(evaluateId);
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.badRequest().body("Evaluate not found");
	}

}
