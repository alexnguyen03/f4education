package com.f4education.springjwt.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.payload.request.PaymentMethodDTO;
import com.f4education.springjwt.security.services.PaymentMethodServiceImp;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/payment-method")
public class PaymentMethodController {
    @Autowired
    PaymentMethodServiceImp paymentMethodServiceImp;

    @GetMapping
    public List<PaymentMethodDTO> findAll() {
        return paymentMethodServiceImp.getAllPaymentMethod();
    }

    @PostMapping
    public PaymentMethodDTO createBill(@RequestBody PaymentMethodDTO paymentMethodDTO) {
        return paymentMethodServiceImp.createPaymentMethod(paymentMethodDTO);
    }

    @PutMapping("/{paymentMethodId}")
    public PaymentMethodDTO updatePaymentMethod(@PathVariable("paymentMethodId") Integer paymentMethodId, @RequestBody PaymentMethodDTO paymentMethodDTO) {
        return paymentMethodServiceImp.updatePaymentMethod(paymentMethodId, paymentMethodDTO);
    }
}
