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

package org.screamingsandals.discord.forum;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.BasicConfigurationNode;
import org.spongepowered.configurate.ConfigurateException;
import org.spongepowered.configurate.ConfigurationNode;
import org.spongepowered.configurate.gson.GsonConfigurationLoader;
import org.spongepowered.configurate.serialize.SerializationException;

import java.io.File;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
public class ForumManager {
    private final @NotNull File file;
    private @NotNull ConfigurationNode node = BasicConfigurationNode.root();

    public void load() throws ConfigurateException {
        var loader = GsonConfigurationLoader.builder()
                .file(file)
                .build();

        node = loader.load();
    }

    public void save() throws ConfigurateException {
        var loader = GsonConfigurationLoader.builder()
                .file(file)
                .build();

        loader.save(node);
    }

    public int incrementTicketIdAndGet(@NotNull String forumConfigurationName) {
        var localNode = node.node("ticketId", forumConfigurationName);
        var ticketId = localNode.getInt() + 1;
        try {
            localNode.set(ticketId);
        } catch (SerializationException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
        }
        return ticketId;
    }

    public void putForumPost(@NotNull ForumPost forumPost) {
        try {
            node.node("ticketIdToSnowflake", String.valueOf(forumPost.getTicketId()), forumPost.getUpstreamChannelSnowflake()).set(forumPost.getPostSnowflake());
            node.node("post", forumPost.getPostSnowflake()).set(forumPost);
        } catch (SerializationException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
        }
    }

    public @NotNull List<@NotNull String> getChannelsForTicketId(int ticketId) {
        var localNode = node.node("ticketIdToSnowflake", String.valueOf(ticketId));
        if (localNode.empty()) {
            return List.of();
        }
        return localNode.childrenMap().values().stream().map(ConfigurationNode::getString).filter(Objects::nonNull).toList();
    }

    public boolean isChannelRegistered(@NotNull String forumPostSnowflake) {
        return !node.node("post", forumPostSnowflake).empty();
    }

    public @Nullable ForumPost getForumPost(@NotNull String forumPostSnowflake) {
        try {
            return node.node("post", forumPostSnowflake).get(ForumPost.class);
        } catch (SerializationException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
            return null;
        }
    }
}
