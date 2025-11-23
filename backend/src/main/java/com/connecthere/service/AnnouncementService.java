package com.connecthere.service;

import com.connecthere.model.Announcement;
import com.connecthere.model.Channel;
import com.connecthere.model.User;
import com.connecthere.repository.AnnouncementRepository;
import com.connecthere.repository.ChannelRepository;
import com.connecthere.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;

    public AnnouncementService(AnnouncementRepository announcementRepository,
                               ChannelRepository channelRepository,
                               UserRepository userRepository) {
        this.announcementRepository = announcementRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
    }

    public List<Announcement> getAll(Long channelId) {
        if (channelId == null) {
            return announcementRepository.findAllByOrderByCreatedAtDesc();
        }
        Channel ch = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        return announcementRepository.findByChannelOrderByCreatedAtDesc(ch);
    }

    public Announcement create(AnnouncementRequest req, Authentication auth) {
        User creator = getCurrentUser(auth);
        Channel ch = null;
        if (req.getChannelId() != null) {
            ch = channelRepository.findById(req.getChannelId())
                .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        }
        Announcement a = Announcement.builder()
            .title(req.getTitle())
            .content(req.getContent())
            .channel(ch)
            .important(req.isImportant())
            .createdBy(creator)
            .build();
        return announcementRepository.save(a);
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class AnnouncementRequest {
        @NotBlank private String title;
        @NotBlank private String content;
        private Long channelId;
        private boolean important;
    }
}
