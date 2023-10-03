package com.f4education.springjwt.security.services;

import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Xử lý logic để tải thông tin người dùng từ OAuth2 Provider
        // Trả về một đối tượng OAuth2User chứa thông tin người dùng
        return new CustomOAuth2User();
    }
}
