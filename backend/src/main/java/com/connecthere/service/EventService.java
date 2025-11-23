package com.connecthere.service;

import com.connecthere.model.Channel;
import com.connecthere.model.Event;
import com.connecthere.model.User;
import com.connecthere.repository.ChannelRepository;
import com.connecthere.repository.EventRepository;
import com.connecthere.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository,
                        ChannelRepository channelRepository,
                        UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
    }

    public List<Event> getUpcoming(Long channelId) {
        LocalDateTime now = LocalDateTime.now();
        if (channelId == null) {
            return eventRepository.findByEventDateTimeAfterOrderByEventDateTimeAsc(now);
        }
        Channel ch = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        return eventRepository.findByChannelAndEventDateTimeAfterOrderByEventDateTimeAsc(ch, now);
    }

    public Event create(EventRequest req, Authentication auth) {
        User creator = getCurrentUser(auth);
        Channel ch = null;
        if (req.getChannelId() != null) {
            ch = channelRepository.findById(req.getChannelId())
                .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        }
        Event e = Event.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .eventDateTime(req.getEventDateTime())
            .location(req.getLocation())
            .channel(ch)
            .createdBy(creator)
            .build();
        return eventRepository.save(e);
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class EventRequest {
        @NotBlank private String title;
        private String description;
        private LocalDateTime eventDateTime;
        private String location;
        private Long channelId;
    }
}
