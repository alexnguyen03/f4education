package com.f4education.springjwt.interfaces;

import java.util.Optional;

import com.f4education.springjwt.models.RefreshToken;

public interface RefreshTokenService {
    public Optional<RefreshToken> findByToken(String token);

    public Optional<RefreshToken> findByUserId(Long userId);

    public RefreshToken createRefreshToken(Long userId);

    public RefreshToken verifyExpiration(RefreshToken token);

    public int deleteByUserId(Long userId);
}
