package com.connecthere.controller;

import com.connecthere.model.Event;
import com.connecthere.service.EventService;
import com.connecthere.service.EventService.EventRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Event> getUpcoming(@RequestParam(required = false) Long channelId) {
        return eventService.getUpcoming(channelId);
    }

    @PostMapping
    //@PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public Event create(@Valid @RequestBody EventRequest req, Authentication auth) {
        return eventService.create(req, auth);
    }
}
