package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillRequestDTO {
    private Double totalPrice;

    private String checkoutMethod;

    private Integer studentId;
}
