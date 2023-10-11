package com.f4education.springjwt.security.services;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.RefreshTokenService;
import com.f4education.springjwt.models.RefreshToken;
import com.f4education.springjwt.repository.RefreshTokenRepository;
import com.f4education.springjwt.repository.UserRepository;
import com.f4education.springjwt.security.jwt.exception.TokenRefreshException;

import jakarta.transaction.Transactional;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {
    @Value("${f4education.app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(new Date((new Date()).getTime() + refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {

        if (token.getExpiryDate().compareTo(new Date()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(),
                    "Refresh token was expired. Please make a new signin request");
        }

        return token;
    }

    @Override
    @Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }

    @Override
    public Optional<RefreshToken> findByUserId(Long userId) {
        return refreshTokenRepository.findByUserId(userId);
    }
}
