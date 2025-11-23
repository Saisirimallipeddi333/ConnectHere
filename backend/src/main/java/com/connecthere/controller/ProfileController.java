package com.connecthere.controller;

import com.connecthere.service.ProfileService;
import com.connecthere.service.ProfileService.ProfileResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile(Authentication auth) {
        return profileService.getProfile(auth);
    }
}
