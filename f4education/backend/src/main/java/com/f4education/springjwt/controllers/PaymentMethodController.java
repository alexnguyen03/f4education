package com.f4education.springjwt.controllers;

import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.payload.request.BillDetailRequestDTO;
import com.f4education.springjwt.payload.request.PaymentMethodDTO;
import com.f4education.springjwt.security.services.PaymentMethodServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

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
