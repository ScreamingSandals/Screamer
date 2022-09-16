package org.screamingsandals.discord.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.spongepowered.configurate.objectmapping.ConfigSerializable;

@ConfigSerializable
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ForumWelcomeMessage {
    private @NotNull String title;
    private @NotNull String description;
}
