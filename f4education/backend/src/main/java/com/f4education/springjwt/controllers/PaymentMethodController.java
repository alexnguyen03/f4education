package com.f4education.springjwt.controllers;

import java.net.URI;
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

import com.f4education.springjwt.payload.request.PaymentMethodDTO;
import com.f4education.springjwt.security.services.PaymentMethodServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/payment-method")
public class PaymentMethodController {
	@Autowired
	PaymentMethodServiceImp paymentMethodServiceImp;

	@GetMapping
	public ResponseEntity<List<PaymentMethodDTO>> findAll() {
		List<PaymentMethodDTO> lst = paymentMethodServiceImp.getAllPaymentMethod();
		return ResponseEntity.ok(lst);
	}

	@PostMapping
	public ResponseEntity<?> createPaymentMethod(@RequestBody PaymentMethodDTO paymentMethodDTO) {
		if (paymentMethodDTO == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		PaymentMethodDTO paymentMethod = paymentMethodServiceImp.createPaymentMethod(paymentMethodDTO);

		if (paymentMethod == null) {
			return ResponseEntity.badRequest().build();
		}

		// create URI
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{paymentMethodId}")
				.buildAndExpand(paymentMethod.getPaymentMethodId()).toUri();

		return ResponseEntity.created(uri).body(paymentMethod);
	}

	@PutMapping("/{paymentMethodId}")
	public ResponseEntity<?> updatePaymentMethod(@PathVariable("paymentMethodId") Integer paymentMethodId,
			@RequestBody PaymentMethodDTO paymentMethodDTO) {
		if (paymentMethodId == null) {
			return ResponseEntity.badRequest().body("message: where my id? u kd m?");
		} else {
			PaymentMethodDTO paymentMethod = paymentMethodServiceImp.updatePaymentMethod(paymentMethodId,
					paymentMethodDTO);

			if (paymentMethod == null) {
				Map<String, String> response = new HashMap<>();
				response.put("status", "" + HttpStatus.NO_CONTENT);
				response.put("message", "it NULL paymentMethod, tf u giving me bro?");
				return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
			}

			return ResponseEntity.ok(paymentMethod);
		}
	}
}
