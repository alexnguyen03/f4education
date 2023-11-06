package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.CartService;
import com.f4education.springjwt.models.Cart;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.CartResponseDTO;
import com.f4education.springjwt.repository.CartRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class CartServiceImp implements CartService {
	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private CourseRepository courseRepository; 

	@Autowired
	private StudentRepository studentRepository;

	@Override
	public List<CartResponseDTO> getAllCartByStatus() {
		return cartRepository.findAllByStatus(false).stream().map(this::convertToReponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public List<CartResponseDTO> findAllCartByStudentId(String studentId, boolean status) {
		status = false; 
		return cartRepository.findByStudentIdAndStatus(studentId, true).stream().map(this::convertToReponseDTO)
				.collect(Collectors.toList());
	}

	@Override
	public CartResponseDTO getCartById(Integer cartId) {
		Optional<Cart> cartOptional = cartRepository.findById(cartId);

		if (cartOptional.isPresent()) {
			Cart cart = cartOptional.get();
			return this.convertToReponseDTO(cart);
		}

		return null;
	}

	@Override
	public CartResponseDTO createCart(CartRequestDTO cartRequestDTO) {
		Cart cart = this.convertRequestToEntity(cartRequestDTO);

		cart.setCreateDate(new Date());
		cart.setStatus(true);

		Cart newCart = cartRepository.save(cart);

		return this.convertToReponseDTO(newCart);
	}

	@Override
	public CartResponseDTO updateCart(Integer cartId, CartRequestDTO cartRequestDTO) {
		Cart exitCart = cartRepository.findById(cartId).get();
		System.out.println(exitCart);
		exitCart.setStatus(false);

		convertRequestToEntity(cartRequestDTO, exitCart);

		Cart updateCart = cartRepository.save(exitCart);

		return this.convertToReponseDTO(updateCart);
	}

	@Override
	public CartResponseDTO deleteCartItem(Integer id) {
		Optional<Cart> cart = cartRepository.findById(id);

		if (cart.isPresent()) {
			cartRepository.delete(cart.get());
		}

		return null;
	}

	private CartResponseDTO convertToReponseDTO(Cart cart) {
		CartResponseDTO cartDTO = new CartResponseDTO();

		BeanUtils.copyProperties(cart, cartDTO);

		cartDTO.setCourse(cart.getCourse());
		cartDTO.setStatus(cart.getStatus());
		cartDTO.setStudentId(cart.getStudent().getStudentId());

		return cartDTO;
	}

	private Cart convertRequestToEntity(CartRequestDTO cartRequest) {
		Cart Cart = new Cart();

		Course course = courseRepository.findById(cartRequest.getCourseId()).get();
		Student student = studentRepository.findById(cartRequest.getStudentId()).get();

		BeanUtils.copyProperties(cartRequest, Cart);

		Cart.setCourse(course);
		Cart.setStudent(student);

		return Cart;
	}

	private void convertRequestToEntity(CartRequestDTO cartRequest, Cart cart) {
		Cart Cart = new Cart();

		Course course = courseRepository.findById(cartRequest.getCourseId()).get();
		Student student = studentRepository.findById(cartRequest.getStudentId()).get();

		BeanUtils.copyProperties(cartRequest, Cart);

		Cart.setCourse(course);
		Cart.setStudent(student);
	}

}