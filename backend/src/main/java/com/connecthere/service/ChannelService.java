package com.connecthere.service;

import com.connecthere.model.Channel;
import com.connecthere.model.User;
import com.connecthere.model.UserChannel;
import com.connecthere.repository.ChannelRepository;
import com.connecthere.repository.UserChannelRepository;
import com.connecthere.repository.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelService {

    private final ChannelRepository channelRepository;
    private final UserRepository userRepository;
    private final UserChannelRepository userChannelRepository;

    public ChannelService(ChannelRepository channelRepository,
                          UserRepository userRepository,
                          UserChannelRepository userChannelRepository) {
        this.channelRepository = channelRepository;
        this.userRepository = userRepository;
        this.userChannelRepository = userChannelRepository;
    }

    public Channel createChannel(ChannelRequest req, Authentication auth) {
        User creator = getCurrentUser(auth);
        Channel ch = Channel.builder()
            .name(req.getName())
            .type(req.getType())
            .description(req.getDescription())
            .createdBy(creator)
            .build();
        return channelRepository.save(ch);
    }

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }

    public List<UserChannel> getMyChannels(Authentication auth) {
        User user = getCurrentUser(auth);
        return userChannelRepository.findByUser(user);
    }

    public void joinChannel(Long channelId, Authentication auth) {
        User user = getCurrentUser(auth);
        Channel channel = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        userChannelRepository.findByUserAndChannel(user, channel)
            .orElseGet(() -> userChannelRepository.save(
                UserChannel.builder().user(user).channel(channel).build()
            ));
    }

    public void leaveChannel(Long channelId, Authentication auth) {
        User user = getCurrentUser(auth);
        Channel channel = channelRepository.findById(channelId)
            .orElseThrow(() -> new IllegalArgumentException("Channel not found"));
        userChannelRepository.findByUserAndChannel(user, channel)
            .ifPresent(userChannelRepository::delete);
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class ChannelRequest {
        @NotBlank private String name;
        @NotBlank private String type;
        private String description;
    }
}
