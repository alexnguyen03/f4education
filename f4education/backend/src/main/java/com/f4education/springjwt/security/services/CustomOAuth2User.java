package com.f4education.springjwt.security.services;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

public class CustomOAuth2User implements OAuth2User {

    @Override
    public Map<String, Object> getAttributes() {
        // Xử lý logic để trả về các thuộc tính người dùng từ OAuth2 Provider
        return Collections.emptyMap();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Xử lý logic để trả về danh sách các quyền của người dùng
        return Collections.emptyList();
    }

    @Override
    public String getName() {
        // Xử lý logic để trả về tên người dùng
        return "Custom User";
    }
}
