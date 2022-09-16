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
import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.events.message.MessageReceivedEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.dv8tion.jda.api.utils.TimeUtil;
import org.jetbrains.annotations.NotNull;
import org.screamingsandals.discord.config.Settings;
import org.screamingsandals.discord.forum.ForumManager;

import java.awt.*;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Slf4j
@RequiredArgsConstructor
public class MessageListener {
    public static final @NotNull Pattern MENTION_REGEX = Pattern.compile("\\[(\\d+)]");

    private final @NotNull Settings settings;
    private final @NotNull ForumManager forumManager;

    @SubscribeEvent
    public void onEvent(@NotNull MessageReceivedEvent event) {
        if (event.isWebhookMessage() || event.getJDA().getSelfUser().getId().equals(event.getAuthor().getId())) {
            return; // ignore self and webhooks
        }

        if (!settings.getNode().node("forum", "enabled").getBoolean()) {
            return;
        }

        /*if (event.isFromThread()) {
            if (forumManager.isChannelRegistered(event.getChannel().getId())) {
                // TODO ticket commands
            }
        }*/

        var matcher = MENTION_REGEX.matcher(event.getMessage().getContentRaw());
        while (matcher.find()) {
            var ticketId = matcher.group(1);
            var ticketChannels = forumManager.getChannelsForTicketId(Integer.parseInt(ticketId))
                    .stream()
                    .map(forumManager::getForumPost)
                    .filter(Objects::nonNull)
                    .toList();
            if (ticketChannels.isEmpty()) {
                continue;
            }

            if (ticketChannels.size() == 1) {
                var forumPost = ticketChannels.get(0);

                var embed = new EmbedBuilder()
                        .setColor(forumPost.isClosed() ? Color.RED : Color.GREEN)
                        .setTitle(forumPost.getName())
                        .setDescription("Click on the mention to open the ticket:\n<#" + forumPost.getPostSnowflake() + ">")
                        .addField("Created by", "<@" + forumPost.getCreatorSnowflake() + ">", true)
                        .addField("Created at", "<t:" + TimeUtil.getTimeCreated(Long.parseLong(forumPost.getPostSnowflake())).toEpochSecond() + ">", true)
                        .addField("Ticket ID", String.valueOf(forumPost.getTicketId()), true);
                if (forumPost.getClosedAt() > 0) {
                    if (forumPost.isClosed()) {
                        embed.addField("Closed at", "<t:" + forumPost.getClosedAt() + ">", true);
                    } else {
                        embed.addField("Reopened at", "<t:" + forumPost.getClosedAt() + ">", true);
                    }
                }
                event.getMessage()
                        .replyEmbeds(embed.build())
                        .mentionRepliedUser(false)
                        .failOnInvalidReply(false)
                        .setAllowedMentions(List.of())
                        .queue();
            } else {
                StringBuilder description = new StringBuilder();
                for (var forumPost : ticketChannels) {
                    description.append("<#").append(forumPost.getPostSnowflake()).append(">\n");
                }

                var embed = new EmbedBuilder()
                        .setColor(Color.GRAY)
                        .setTitle("Multiple tickets refers to [" + ticketId + "]")
                        .setDescription(description.toString())
                        .build();
                event.getMessage()
                        .replyEmbeds(embed)
                        .failOnInvalidReply(false)
                        .setAllowedMentions(List.of())
                        .queue();
            }
        }
    }
}
