package com.f4education.springjwt.payload.request;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class PaymentMethodDTO implements Serializable {
    private Integer paymentMethodId;
    private String paymentMethodName;
}
