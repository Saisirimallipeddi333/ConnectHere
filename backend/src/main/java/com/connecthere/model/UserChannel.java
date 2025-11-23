package com.connecthere.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "user_channels",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "channel_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class UserChannel {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "channel_id")
    private Channel channel;

    @Builder.Default
    private Instant joinedAt = Instant.now();
}
