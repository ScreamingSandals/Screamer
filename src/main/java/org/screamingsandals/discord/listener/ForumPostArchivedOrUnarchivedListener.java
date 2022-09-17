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
import net.dv8tion.jda.api.events.channel.update.ChannelUpdateArchivedEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.dv8tion.jda.api.utils.TimeUtil;
import org.jetbrains.annotations.NotNull;
import org.screamingsandals.discord.forum.ForumManager;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;

import java.awt.*;
import java.time.Instant;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class ForumPostArchivedOrUnarchivedListener {
    private final @NotNull ForumManager forumManager;

    @SubscribeEvent
    public void onEvent(@NotNull ChannelUpdateArchivedEvent event) {
        var forumPost = forumManager.getForumPost(event.getChannel().getId());
        if (forumPost == null) {
            return;
        }

        forumPost.setClosed(Boolean.TRUE.equals(event.getNewValue()));
        forumPost.setClosedAt(Instant.now().getEpochSecond());
        forumManager.putForumPost(forumPost);
        try {
            forumManager.save();
        } catch (ConfigurateException e) {
            e.printStackTrace();
            DiscordLogUtils.sendError(e);
        }

        var reportMessageChannel = forumPost.getReportMessageChannelSnowflake();
        var reportMessage = forumPost.getReportMessageSnowflake();
        if (reportMessageChannel != null && reportMessage != null) {
            var channel = event.getJDA().getTextChannelById(reportMessageChannel);
            if (channel != null) {
                var embed = new EmbedBuilder()
                        .setColor(forumPost.isClosed() ? Color.RED : Color.GREEN)
                        .setTitle("Ticket " + (forumPost.isClosed() ? "closed" : "reopened") + ": " + forumPost.getName())
                        .setDescription("Click on the mention to open the ticket:\n<#" + forumPost.getPostSnowflake() + ">")
                        .addField("Created by", "<@" + forumPost.getCreatorSnowflake() + ">", true)
                        .addField("Created at", "<t:" + TimeUtil.getTimeCreated(Long.parseLong(forumPost.getPostSnowflake())).toEpochSecond() + ">", true)
                        .addField("Ticket ID", String.valueOf(forumPost.getTicketId()), true)
                        .addField(forumPost.isClosed() ? "Closed at" : "Reopened at", "<t:" + forumPost.getClosedAt() + ">", true);
                channel.editMessageEmbedsById(reportMessage, embed.build()).setAllowedMentions(List.of()).queue();
            }
        }
    }
}
