package com.connecthere.controller;

import com.connecthere.model.Resource;
import com.connecthere.service.ResourceService;
import com.connecthere.service.ResourceService.ResourceRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @GetMapping
    public List<Resource> getAll(@RequestParam(required = false) Long channelId,
                                 @RequestParam(required = false) String type,
                                 @RequestParam(required = false) String title) {
        return resourceService.getResources(channelId, type, title);
    }

    @PostMapping
    //@PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public Resource create(@Valid @RequestBody ResourceRequest req, Authentication auth) {
        return resourceService.create(req, auth);
    }
}
