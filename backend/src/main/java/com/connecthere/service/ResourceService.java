package com.connecthere.service;

import com.connecthere.model.Channel;
import com.connecthere.model.Resource;
import com.connecthere.model.User;
import com.connecthere.repository.ChannelRepository;
import com.connecthere.repository.ResourceRepository;
import com.connecthere.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;

    public ResourceService(ResourceRepository resourceRepository,
                           ChannelRepository channelRepository,
                           UserRepository userRepository) {
        this.resourceRepository = resourceRepository;
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
    }

    public List<Resource> getResources(Long channelId, String type, String title) {
        if (title != null && !title.isBlank()) {
            return resourceRepository.findByTitleContainingIgnoreCase(title);
        }
        if (channelId != null && type != null && !type.isBlank()) {
            Channel ch = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
            return resourceRepository.findByChannelAndTypeIgnoreCase(ch, type);
        }
        if (channelId != null) {
            Channel ch = channelRepository.findById(channelId)
                .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
            return resourceRepository.findByChannel(ch);
        }
        if (type != null && !type.isBlank()) {
            return resourceRepository.findByTypeIgnoreCase(type);
        }
        return resourceRepository.findAll();
    }

    public Resource create(ResourceRequest req, Authentication auth) {
        User uploader = getCurrentUser(auth);
        Channel ch = null;
        if (req.getChannelId() != null) {
            ch = channelRepository.findById(req.getChannelId())
                .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        }
        Resource r = Resource.builder()
            .title(req.getTitle())
            .description(req.getDescription())
            .type(req.getType())
            .url(req.getUrl())
            .channel(ch)
            .uploadedBy(uploader)
            .build();
        return resourceRepository.save(r);
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class ResourceRequest {
        @NotBlank private String title;
        private String description;
        private String type;
        private String url;
        private Long channelId;
    }
}
