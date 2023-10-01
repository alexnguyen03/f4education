package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.PaymentMethodService;
import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.payload.request.PaymentMethodDTO;
import com.f4education.springjwt.repository.PaymentMethodRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMethodServiceImp implements PaymentMethodService {
    @Autowired
    PaymentMethodRepository paymentMethodRepository;

    @Override
    public List<PaymentMethodDTO> getAllPaymentMethod() {
        List<PaymentMethod> paymentMethod = paymentMethodRepository.findAll();
        return paymentMethod.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    @Override
    public PaymentMethodDTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO) {
        PaymentMethod paymentMethod = this.convertRequestToEntity(paymentMethodDTO);
        PaymentMethod createPaymentMethod = paymentMethodRepository.save(paymentMethod);
        return convertToResponse(createPaymentMethod);
    }

    @Override
    public PaymentMethodDTO updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO) {
        PaymentMethod existPaymentMethod = paymentMethodRepository.findById(paymentMethodId).get();

        existPaymentMethod.setPaymentMethodName(paymentMethodDTO.getPaymentMethodName());

        PaymentMethod updatePaymentMethod = paymentMethodRepository.save(existPaymentMethod);

        return convertToResponse(updatePaymentMethod);
    }

    private PaymentMethod convertRequestToEntity(PaymentMethodDTO paymentMethodDTO) {
        PaymentMethod paymentMethod = new PaymentMethod();

        BeanUtils.copyProperties(paymentMethodDTO, paymentMethod);

        return paymentMethod;
    }

    private PaymentMethodDTO convertToResponse(PaymentMethod paymentMethod) {
        PaymentMethodDTO paymentMethodDTO = new PaymentMethodDTO();

        BeanUtils.copyProperties(paymentMethod, paymentMethodDTO);
        paymentMethodDTO.setPaymentMethodId(paymentMethodDTO.getPaymentMethodId());

        return paymentMethodDTO;
    }
}
