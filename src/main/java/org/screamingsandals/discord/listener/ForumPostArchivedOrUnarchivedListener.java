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
    public void onEvent(ChannelUpdateArchivedEvent event) {
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
