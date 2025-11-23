package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 120)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 60)
    private String firstName;

    @Column(nullable = false, length = 60)
    private String lastName;

    // ---- Roles ----
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    // ---- Status flags ----
    @Builder.Default
    private Boolean active = true;

    @Builder.Default
    private Boolean emailVerified = false;

    // ---- Email verification (OTP) ----
    @Column(length = 10)
    private String emailVerificationCode;

    private Instant verificationCodeSentAt;

    // ---- Audit ----
    @Builder.Default
    private Instant createdAt = Instant.now();

    // -------------------------------------------------------------------------
    // Convenience methods for backward compatibility and nicer usage
    // -------------------------------------------------------------------------

    /**
     * Derived full name from firstName + lastName.
     * Existing code that calls user.getFullName() will still work.
     */
    public String getFullName() {
        String fn = firstName != null ? firstName.trim() : "";
        String ln = lastName != null ? lastName.trim() : "";
        String combined = (fn + " " + ln).trim();
        return combined.isEmpty() ? null : combined;
    }

    /**
     * Allows setting a single "full name" and splits it into first/last.
     * If there is no space, everything goes into firstName.
     */
    public void setFullName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            this.firstName = null;
            this.lastName = null;
            return;
        }
        String trimmed = fullName.trim();
        int idx = trimmed.lastIndexOf(' ');
        if (idx <= 0) {
            // Only one word -> treat as firstName
            this.firstName = trimmed;
            this.lastName = "";
        } else {
            this.firstName = trimmed.substring(0, idx).trim();
            this.lastName = trimmed.substring(idx + 1).trim();
        }
    }
}
