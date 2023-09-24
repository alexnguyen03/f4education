package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.models.Cart;
import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;
import com.f4education.springjwt.payload.response.MessageResponse;
import com.f4education.springjwt.security.services.CartServiceImp;

import jakarta.websocket.server.PathParam;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/cart")
public class CartController {
	@Autowired
	CartServiceImp cartService;

	@GetMapping
	public List<CartResponseDTO> findAll() {
		return cartService.getAllCartByStatus();
	}

	@PostMapping
	public CartResponseDTO createCart(@RequestBody CartRequestDTO cartRequestDTO) {
		return cartService.createCart(cartRequestDTO);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteCart(@PathVariable("id") Integer id) {
		return cartService.deleteCartItem(id);
	}
//
//	@PutMapping("/{answerId}")
////	@PreAuthorize("hasRole('ADMIN')")
//	public AnswerDTO updateAnswer(@PathVariable("answerId") Integer answerId, @RequestBody AnswerDTO answerDTO) {
//		return cartService.updateAnswer(answerId, answerDTO);
//	}

}
