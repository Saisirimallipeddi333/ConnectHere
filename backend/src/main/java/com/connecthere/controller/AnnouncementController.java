package com.connecthere.controller;

import com.connecthere.model.Announcement;
import com.connecthere.service.AnnouncementService;
import com.connecthere.service.AnnouncementService.AnnouncementRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin
public class AnnouncementController {

    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping
    public List<Announcement> getAll(@RequestParam(required = false) Long channelId) {
        return announcementService.getAll(channelId);
    }

    @PostMapping
    //@PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public Announcement create(@Valid @RequestBody AnnouncementRequest req, Authentication auth) {
        return announcementService.create(req, auth);
    }
}
