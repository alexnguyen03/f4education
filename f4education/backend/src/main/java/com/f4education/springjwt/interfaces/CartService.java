package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;

@Service
public interface CartService {
	List<CartResponseDTO> getAllCartByStatus();

	CartResponseDTO getCartById(Integer cartId);

	CartResponseDTO createCart(CartRequestDTO cartRequestDTO);

	CartResponseDTO updateCart(Integer cartId, CartRequestDTO cartRequestDTO);

	ResponseEntity<?> deleteCartItem(Integer cartId);
}
