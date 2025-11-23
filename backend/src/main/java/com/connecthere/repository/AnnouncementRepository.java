package com.connecthere.repository;

import com.connecthere.model.Announcement;
import com.connecthere.model.Channel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByOrderByCreatedAtDesc();
    List<Announcement> findByChannelOrderByCreatedAtDesc(Channel channel);
}
