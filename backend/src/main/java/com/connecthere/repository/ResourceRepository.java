package com.connecthere.repository;

import com.connecthere.model.Channel;
import com.connecthere.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByChannel(Channel channel);
    List<Resource> findByTypeIgnoreCase(String type);
    List<Resource> findByChannelAndTypeIgnoreCase(Channel channel, String type);
    List<Resource> findByTitleContainingIgnoreCase(String title);
}
