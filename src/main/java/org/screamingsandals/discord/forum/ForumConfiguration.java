package org.screamingsandals.discord.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.spongepowered.configurate.objectmapping.ConfigSerializable;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ConfigSerializable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ForumConfiguration {
    private @NotNull List<@NotNull String> channels;
    @Builder.Default
    private @Nullable String reportChannel = null;
    @Builder.Default
    private @NotNull Map<@NotNull String, @NotNull ForumWelcomeMessage> welcomeMessages = new HashMap<>();
}
