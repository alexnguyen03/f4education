package com.f4education.springjwt.payload.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class TokenRefreshResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public TokenRefreshResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
