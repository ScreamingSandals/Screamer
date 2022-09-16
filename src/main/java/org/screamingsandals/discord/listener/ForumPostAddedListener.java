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

package org.screamingsandals.discord.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.channel.ChannelCreateEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import org.jetbrains.annotations.NotNull;
import org.screamingsandals.discord.config.Settings;
import org.screamingsandals.discord.forum.ForumManager;
import org.screamingsandals.discord.forum.ForumPost;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;
import org.spongepowered.configurate.serialize.SerializationException;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class ForumPostAddedListener {
    private final @NotNull Settings settings;
    private final @NotNull ForumManager forumManager;

    @SubscribeEvent
    public void onEvent(@NotNull ChannelCreateEvent event) {
        if (!settings.getNode().node("forum", "enabled").getBoolean()) {
            return;
        }

        if (event.getChannel().getType() != ChannelType.GUILD_PUBLIC_THREAD) {
            return;
        }

        var threadChannel = event.getChannel().asThreadChannel();
        var parentSnowflake = threadChannel.getParentChannel().getId();

        if (forumManager.isChannelRegistered(threadChannel.getId())) {
            return;
        }

        try {
            if (!settings.getNode().node("forum", "channels").getList(String.class, List.of()).contains(parentSnowflake)) {
                return;
            }
        } catch (SerializationException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
            return;
        }

        var oldChannelName = threadChannel.getName();
        var ticketId = forumManager.incrementTicketIdAndGet(parentSnowflake);
        var forumPost = ForumPost.builder()
                .postSnowflake(threadChannel.getId())
                .upstreamChannelSnowflake(parentSnowflake)
                .creatorSnowflake(threadChannel.getOwnerId())
                .ticketId(ticketId)
                .name(oldChannelName)
                .build();
        forumManager.putForumPost(forumPost);
        try {
            forumManager.save();
        } catch (ConfigurateException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
        }

        var newChannelName = "[" + ticketId + "] " + oldChannelName;
        if (newChannelName.length() > 100) {
            newChannelName = newChannelName.substring(0, 100);
        }
        threadChannel.getManager().setName(newChannelName)
                .and(threadChannel.addThreadMember(threadChannel.getJDA().getSelfUser()))
                .and(threadChannel.sendMessage("Your ticket `" + oldChannelName + "` got ID `[" + ticketId + "]`. Use this string for future reference!"))
                .queue();

        log.info("New ticket has been created: {}", forumPost);
    }
}
