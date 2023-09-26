package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.CartService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.Cart;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;
import com.f4education.springjwt.payload.response.MessageResponse;
import com.f4education.springjwt.repository.CartRepository;
import com.f4education.springjwt.repository.CourseRepository;

@Service
public class CartServiceImp implements CartService {
	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Override
	public List<CartResponseDTO> getAllCartByStatus() {
		List<Cart> carts = cartRepository.findAllByStatus(false);
		return carts.stream().map(this::convertToReponseDTO).collect(Collectors.toList());
	}

	@Override
	public CartResponseDTO getCartById(Integer cartId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public CartResponseDTO createCart(CartRequestDTO cartRequestDTO) {
		Cart cart = this.convertRequestToEntity(cartRequestDTO);

		cart.setCreateDate(new Date());
		cart.setStatus(false);

		Cart newCart = cartRepository.save(cart);
		return convertToReponseDTO(newCart);
	}

	@Override
	public CartResponseDTO updateCart(Integer cartId, CartRequestDTO cartRequestDTO) {
		Optional<Cart> exitCart = cartRepository.findById(cartId);

		if (!exitCart.isPresent()) {
			return null;
		}

		Cart cart = this.convertRequestToEntity(cartRequestDTO);
		cart.setStatus(true);

		Cart updateCart = cartRepository.save(cart);
		return convertToReponseDTO(updateCart);
	}

	@Override
	public ResponseEntity<?> deleteCartItem(Integer id) {
		Optional<Cart> cart = cartRepository.findById(id);

		if (!cart.isPresent())
			return ResponseEntity.badRequest().body(new MessageResponse("Message: Cart can not be found"));

		cartRepository.deleteById(id);
		return ResponseEntity.ok(new MessageResponse("Message: Cart delete successfully"));
	}

	private CartResponseDTO convertToReponseDTO(Cart cart) {
		CartResponseDTO cartDTO = new CartResponseDTO();
		BeanUtils.copyProperties(cart, cartDTO);

		cartDTO.setCourse(cart.getCourse());
		cartDTO.setStatus(cart.getStatus());

		return cartDTO;
	}

	private Cart convertRequestToEntity(CartRequestDTO cartDTO) {
		Cart Cart = new Cart();

		Course course = courseRepository.findById(cartDTO.getCourseId()).get();

		Student student = new Student(1, "Nguyễn Văn An", true, "Cần Thơ, California", "0839475920", "img.png");

		BeanUtils.copyProperties(cartDTO, Cart);
		Cart.setCourse(course);
		Cart.setStudent(student);

		return Cart;
	}

}
