package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.payload.request.PaymentMethodDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PaymentMethodService {
    List<PaymentMethodDTO> getAllPaymentMethod();

    PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO);

    PaymentMethodDTO updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO);
}
