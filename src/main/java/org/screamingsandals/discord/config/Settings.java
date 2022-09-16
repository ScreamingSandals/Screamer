/*
 * Copyright (C) 2022 ScreamingSandals
 *
 * This file is part of Screamer.
 *
 * Screamer is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Screamer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Screamer. If not, see <https://www.gnu.org/licenses/>.
 */

package org.screamingsandals.discord.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.jetbrains.annotations.UnknownNullability;
import org.screamingsandals.discord.forum.ForumConfiguration;
import org.screamingsandals.discord.forum.ForumWelcomeMessage;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;
import org.spongepowered.configurate.ConfigurationNode;
import org.spongepowered.configurate.gson.GsonConfigurationLoader;
import org.spongepowered.configurate.serialize.SerializationException;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
public class Settings {
    private final @NotNull File file;
    @Getter
    @UnknownNullability("Nullable until loadConfiguration() is called")
    private ConfigurationNode node;

    public void loadConfiguration() throws ConfigurateException {
        var loader = GsonConfigurationLoader.builder()
                .file(file)
                .build();

        var existedBefore = file.exists();

        node = loader.load();

        var generator = new ConfigGenerator(loader, node);
        // @formatter:off
        generator.start()
                .key("token").defValue("PUT YOUR TOKEN HERE")
                .section("logChannel")
                    .key("enabled").defValue(false)
                    .key("channel").defValue("PUT CHANNEL HERE")
                .back()
                .section("forum")
                    .key("enabled").defValue(true)
                    .key("configurations").defValue(
                        node -> node.node("default").set(
                                ForumConfiguration
                                        .builder()
                                        .channels(List.of("PUT_CHANNEL_HERE"))
                                        .reportChannel("PUT_YOUR_REPORT_CHANNEL_HERE_OR_REMOVE")
                                        .welcomeMessages(Map.of(
                                                "default", ForumWelcomeMessage.builder().title("default").description("fallback message when no tag is present").build(),
                                                "FORUM_TAG_NAME", ForumWelcomeMessage.builder().title("EXAMPLE TITLE").description("EXAMPLE MESSAGE").build()
                                        ))
                                        .build()
                        )
                )
                .back();
        // @formatter:on
        generator.saveIfModified();

        if (!existedBefore) {
            log.info("File settings.json has been created, please fill in the token. Exiting...");
            System.exit(0);
        }
    }

    public @Nullable Map.Entry<@NotNull String, @NotNull ForumConfiguration> getForumConfigurationOfChannel(@NotNull String channelId) {
        var configurations = node.node("forum", "configurations");
        for (var child : configurations.childrenMap().entrySet()) {
            if (child.getValue().node("channels").childrenList().stream().anyMatch(node1 -> channelId.equals(node1.getString()))) {
                try {
                    return Map.entry(child.getKey().toString(), Objects.requireNonNull(child.getValue().get(ForumConfiguration.class)));
                } catch (SerializationException e) {
                    e.printStackTrace();
                    DiscordLogUtils.sendError(e);
                }
            }
        }
        return null;
    }
}
