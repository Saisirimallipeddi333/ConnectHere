package com.connecthere.service;

import com.connecthere.dto.AuthResponse;
import com.connecthere.dto.LoginRequest;
import com.connecthere.dto.OtpVerifyRequest;
import com.connecthere.dto.RegisterRequest;
import com.connecthere.model.EmailOtp;
import com.connecthere.model.Role;
import com.connecthere.model.User;
import com.connecthere.repository.EmailOtpRepository;
import com.connecthere.repository.RoleRepository;
import com.connecthere.repository.UserRepository;
import com.connecthere.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final EmailOtpRepository otpRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepo,
                       RoleRepository roleRepo,
                       EmailOtpRepository otpRepo,
                       PasswordEncoder passwordEncoder,
                       EmailService emailService,
                       AuthenticationManager authManager,
                       JwtTokenProvider jwtTokenProvider) {

        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.otpRepo = otpRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.authManager = authManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // ---------------------------------------------------------------------
    // REGISTER: create user + send OTP
    // ---------------------------------------------------------------------
    public void register(RegisterRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Role mapping from UI (STUDENT / FACULTY). ADMIN is not allowed here.
        String incomingRole = req.getRole() != null ? req.getRole().toUpperCase() : "STUDENT";

        final String roleName;
        if ("FACULTY".equals(incomingRole)) {
            roleName = "ROLE_FACULTY";
        } else {
            // default
            roleName = "ROLE_STUDENT";
        }

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("Role not found: " + roleName));

        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .active(true)
                .emailVerified(false)
                .roles(Set.of(role))
                .build();

        userRepo.save(user);

        // Generate OTP
        String code = generateCode();

        EmailOtp otp = new EmailOtp();
        otp.setEmail(req.getEmail());
        otp.setCode(code);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otp.setUsed(false);
        otpRepo.save(otp);

        // Send OTP via email
        emailService.sendOtpEmail(req.getEmail(), code);
    }

    // ---------------------------------------------------------------------
    // VERIFY OTP
    // ---------------------------------------------------------------------
    public void verifyOtp(OtpVerifyRequest req) {
        EmailOtp otp = otpRepo.findTopByEmailAndUsedFalseOrderByExpiresAtDesc(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No OTP found for email"));

        if (otp.isUsed() || otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP expired");
        }

        if (!otp.getCode().equals(req.getCode())) {
            throw new IllegalArgumentException("Invalid OTP");
        }

        // Mark OTP used
        otp.setUsed(true);
        otpRepo.save(otp);

        // Mark user emailVerified = true
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setEmailVerified(true);
        userRepo.save(user);
    }

    // ---------------------------------------------------------------------
    // LOGIN (only if email verified)
    // ---------------------------------------------------------------------
    public AuthResponse login(LoginRequest req) {
        // First load the user to check verification
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalStateException("Email not verified");
        }

        // Authenticate with Spring Security
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        // Build JWT
        String token = jwtTokenProvider.generateToken(authentication);

        // Resolve role name from user entity
        String roleName = user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("ROLE_STUDENT");

        AuthResponse res = new AuthResponse();
        res.setToken(token);
        res.setUserId(user.getId());
        res.setFirstName(user.getFirstName());
        res.setLastName(user.getLastName());
        res.setEmail(user.getEmail());
        // Map "ROLE_STUDENT" -> "STUDENT"
        res.setRole(roleName.replace("ROLE_", ""));
        return res;
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------
    private String generateCode() {
        Random r = new Random();
        int val = 100000 + r.nextInt(900000);
        return String.valueOf(val);
    }
}
