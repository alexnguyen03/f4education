package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.PaymentMethodDTO;

@Service
public interface PaymentMethodService {
	List<PaymentMethodDTO> getAllPaymentMethod();

    PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO);

    PaymentMethodDTO updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO);
}
