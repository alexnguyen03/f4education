package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;

@Service
public interface CartService {
	List<CartResponseDTO> getAllCartByStatus();

	List<CartResponseDTO> findAllCartByStudentId(String studentId, boolean status);

	CartResponseDTO getCartById(Integer cartId);

	CartResponseDTO createCart(CartRequestDTO cartRequestDTO);

	CartResponseDTO updateCart(Integer cartId, CartRequestDTO cartRequestDTO);

	CartResponseDTO deleteCartItem(Integer cartId);
}
