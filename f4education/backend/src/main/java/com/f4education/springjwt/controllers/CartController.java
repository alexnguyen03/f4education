package com.f4education.springjwt.controllers;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;
import com.f4education.springjwt.security.services.CartServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cart")
public class CartController {
	@Autowired
	CartServiceImp cartService;

	@GetMapping
	public ResponseEntity<?> findAll() {
		List<CartResponseDTO> lst = cartService.getAllCartByStatus();
		return ResponseEntity.ok(lst);
	}

	@GetMapping("/{studentId}")
	public ResponseEntity<?> findCartByStudentID(@PathVariable("studentId") String studentId) {
		List<CartResponseDTO> lst = cartService.findAllCartByStudentId(studentId, true);
		return ResponseEntity.ok(lst);
	}

	@PostMapping
	public ResponseEntity<?> createCart(@RequestBody CartRequestDTO cartRequestDTO) {
		if (cartRequestDTO == null) {
			return ResponseEntity.badRequest().body("Invalid request data");
		}

		CartResponseDTO cart = cartService.createCart(cartRequestDTO);

		if (cart == null) {
			return ResponseEntity.badRequest().build();
		}

		// create URI
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{cartId}").buildAndExpand(cart.getCartId())
				.toUri();

		return ResponseEntity.created(uri).body(cart);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCart(@PathVariable("id") Integer id) {

		if (id == null) {
			return ResponseEntity.badRequest().build();
		} else {

			CartResponseDTO cart = cartService.getCartById(id);

			if (cart == null) {
				Map<String, String> response = new HashMap<>();
				response.put("status", "" + HttpStatus.NO_CONTENT);
				response.put("message", "it NULL BILL, tf u giving me bro?");
				return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
			}

			cartService.deleteCartItem(id);
			
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body("course have been delete");
		}
	}

	@PutMapping("/{cartId}")
	public ResponseEntity<?> updateCart(@PathVariable("cartId") Integer cartId,
			@RequestBody CartRequestDTO cartRequest) {
		if (cartId == null) {
			return ResponseEntity.badRequest().body("message: where my id? u kd m?");
		} else {
			CartResponseDTO cart = cartService.updateCart(cartId, cartRequest);

			if (cart == null) {
				Map<String, String> response = new HashMap<>();
				response.put("status", "" + HttpStatus.NO_CONTENT);
				response.put("message", "it NULL BILL, tf u giving me bro?");
				return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
			}

			return ResponseEntity.ok(cart);
		}
	}

}
