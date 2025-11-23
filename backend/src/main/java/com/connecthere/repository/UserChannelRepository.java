package com.connecthere.repository;

import com.connecthere.model.Channel;
import com.connecthere.model.User;
import com.connecthere.model.UserChannel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserChannelRepository extends JpaRepository<UserChannel, Long> {
    List<UserChannel> findByUser(User user);
    Optional<UserChannel> findByUserAndChannel(User user, Channel channel);
}
