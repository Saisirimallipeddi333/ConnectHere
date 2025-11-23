// OtpVerifyRequest.java
package com.connecthere.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OtpVerifyRequest {
    private String email;
    private String code;
}
