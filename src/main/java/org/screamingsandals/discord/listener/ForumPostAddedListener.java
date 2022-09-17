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
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.channel.ChannelCreateEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import net.dv8tion.jda.api.interactions.components.buttons.Button;
import net.dv8tion.jda.api.utils.TimeUtil;
import net.dv8tion.jda.api.utils.messages.MessageCreateBuilder;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.screamingsandals.discord.InteractionConstants;
import org.screamingsandals.discord.config.Settings;
import org.screamingsandals.discord.forum.ForumManager;
import org.screamingsandals.discord.forum.ForumPost;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;

import java.awt.*;
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

        var forumConfigurationEntry = settings.getForumConfigurationOfChannel(parentSnowflake);

        if (forumConfigurationEntry == null) {
            return;
        }

        var forumConfiguration = forumConfigurationEntry.getValue();

        var oldChannelName = threadChannel.getName();
        var ticketId = forumManager.incrementTicketIdAndGet(forumConfigurationEntry.getKey());
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
                .reason("User created a thread in a channel managed by Screamer. Because of this, a thread got a ticket which is now part of its name.")
                .and(threadChannel.addThreadMember(threadChannel.getJDA().getSelfUser()))
                .and(threadChannel.sendMessage(
                        new MessageCreateBuilder()
                                .setContent("Your ticket `" + oldChannelName + "` got ID `[" + ticketId + "]`. Use this string for future reference!")
                                .setActionRow(Button.secondary(InteractionConstants.BUTTON_TOGGLE_ARCHIVED + ":" + forumPost.getPostSnowflake(), "Close"))
                                .build()
                ))
                .queue();

        log.info("New ticket has been created: {}", forumPost);

        var welcomeMessages = forumConfiguration.getWelcomeMessages();
        @Nullable String welcomeKey = null;
        for (var welcome : welcomeMessages.keySet()) {
            if (threadChannel.getAppliedTags().stream().anyMatch(forumTag -> forumTag.getName().equals(welcome))) {
                welcomeKey = welcome;
                break;
            }
        }
        if (welcomeKey == null && welcomeMessages.containsKey("default")) {
            welcomeKey = "default";
        }

        if (welcomeKey != null) {
            var embed = new EmbedBuilder()
                    .setColor(Color.GREEN)
                    .setTitle(welcomeMessages.get(welcomeKey).getTitle())
                    .setDescription(welcomeMessages.get(welcomeKey).getDescription());
            threadChannel.sendMessageEmbeds(embed.build()).setAllowedMentions(List.of()).queue();
        }

        var reportChannel = forumConfiguration.getReportChannel();
        if (reportChannel != null) {
            var embed = new EmbedBuilder()
                    .setColor(forumPost.isClosed() ? Color.RED : Color.GREEN)
                    .setTitle("Ticket opened: " + oldChannelName)
                    .setDescription("Click on the mention to open the ticket:\n<#" + forumPost.getPostSnowflake() + ">")
                    .addField("Created by", "<@" + forumPost.getCreatorSnowflake() + ">", true)
                    .addField("Created at", "<t:" + TimeUtil.getTimeCreated(Long.parseLong(forumPost.getPostSnowflake())).toEpochSecond() + ">", true)
                    .addField("Ticket ID", String.valueOf(forumPost.getTicketId()), true);
            var channel = event.getJDA().getTextChannelById(reportChannel);
            if (channel == null) {
                return;
            }
            var message = channel.sendMessageEmbeds(embed.build()).setAllowedMentions(List.of()).complete();
            forumPost.setReportMessageSnowflake(message.getId());
            forumPost.setReportMessageChannelSnowflake(reportChannel);
            forumManager.putForumPost(forumPost);
            try {
                forumManager.save();
            } catch (ConfigurateException e) {
                e.printStackTrace();
                DiscordLogUtils.sendError(e);
            }
        }
    }
}
