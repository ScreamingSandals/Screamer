package org.screamingsandals.discord.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.spongepowered.configurate.objectmapping.ConfigSerializable;

@ConfigSerializable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumPost {
    private @NotNull String upstreamChannelSnowflake;
    private @NotNull String postSnowflake;
    private @NotNull String creatorSnowflake;
    private int ticketId;
    private @NotNull String name;
    @Builder.Default
    private boolean closed = false;
    private long closedAt;
}
