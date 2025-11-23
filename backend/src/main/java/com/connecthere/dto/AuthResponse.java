// AuthResponse.java
package com.connecthere.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;   // STUDENT / FACULTY / ADMIN
    private String token;  // JWT
}
