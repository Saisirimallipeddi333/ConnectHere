package com.connecthere.controller;

import com.connecthere.model.Channel;
import com.connecthere.model.UserChannel;
import com.connecthere.service.ChannelService;
import com.connecthere.service.ChannelService.ChannelRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/channels")
@CrossOrigin
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping
    public List<Channel> getAll() {
        return channelService.getAllChannels();
    }

    @GetMapping("/me")
    public List<UserChannel> getMine(Authentication auth) {
        return channelService.getMyChannels(auth);
    }

    @PostMapping
    //@PreAuthorize("hasAnyRole('FACULTY','ADMIN')")
    public Channel create(@Valid @RequestBody ChannelRequest req, Authentication auth) {
        return channelService.createChannel(req, auth);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> join(@PathVariable Long id, Authentication auth) {
        channelService.joinChannel(id, auth);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leave(@PathVariable Long id, Authentication auth) {
        channelService.leaveChannel(id, auth);
        return ResponseEntity.ok().build();
    }
}
