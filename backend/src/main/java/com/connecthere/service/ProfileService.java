package com.connecthere.service;

import com.connecthere.model.Announcement;
import com.connecthere.model.Event;
import com.connecthere.model.Resource;
import com.connecthere.model.User;
import com.connecthere.repository.AnnouncementRepository;
import com.connecthere.repository.EventRepository;
import com.connecthere.repository.ResourceRepository;
import com.connecthere.repository.UserRepository;
import lombok.Data;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final AnnouncementRepository announcementRepository;
    private final EventRepository eventRepository;
    private final ResourceRepository resourceRepository;

    public ProfileService(UserRepository userRepository,
                          AnnouncementRepository announcementRepository,
                          EventRepository eventRepository,
                          ResourceRepository resourceRepository) {
        this.userRepository = userRepository;
        this.announcementRepository = announcementRepository;
        this.eventRepository = eventRepository;
        this.resourceRepository = resourceRepository;
    }

    public ProfileResponse getProfile(Authentication auth) {
        User user = getCurrentUser(auth);
        ProfileResponse res = new ProfileResponse();
        res.setId(user.getId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setRoles(user.getRoles().stream().map(Role -> Role.getName()).toList());
        res.setActive(user.getActive());

        List<Announcement> anns = announcementRepository.findAll().stream()
            .filter(a -> a.getCreatedBy() != null && a.getCreatedBy().getId().equals(user.getId()))
            .toList();
        List<Event> evs = eventRepository.findAll().stream()
            .filter(e -> e.getCreatedBy() != null && e.getCreatedBy().getId().equals(user.getId()))
            .toList();
        List<Resource> resList = resourceRepository.findAll().stream()
            .filter(r -> r.getUploadedBy() != null && r.getUploadedBy().getId().equals(user.getId()))
            .toList();

        res.setMyAnnouncementsCount(anns.size());
        res.setMyEventsCount(evs.size());
        res.setMyResourcesCount(resList.size());
        return res;
    }

    private User getCurrentUser(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Data
    public static class ProfileResponse {
        private Long id;
        private String fullName;
        private String email;
        private Boolean active;
        private java.util.List<String> roles;
        private int myAnnouncementsCount;
        private int myEventsCount;
        private int myResourcesCount;
    }
}
