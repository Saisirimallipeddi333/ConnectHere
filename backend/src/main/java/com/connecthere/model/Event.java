package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Channel this event belongs to
    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_id")
    private Channel channel;

    // Who created the event
    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @Column(length = 255)
    private String location;
}
