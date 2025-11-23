package com.connecthere.repository;

import com.connecthere.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {

    // latest unused OTP for that email
    Optional<EmailOtp> findTopByEmailAndUsedFalseOrderByExpiresAtDesc(String email);
}
