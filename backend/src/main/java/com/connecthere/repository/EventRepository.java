package com.connecthere.repository;

import com.connecthere.model.Channel;
import com.connecthere.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventDateTimeAfterOrderByEventDateTimeAsc(LocalDateTime dt);
    List<Event> findByChannelAndEventDateTimeAfterOrderByEventDateTimeAsc(Channel ch, LocalDateTime dt);
}
