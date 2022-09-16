package org.screamingsandals.discord.listener;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.events.channel.update.ChannelUpdateArchivedEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import org.jetbrains.annotations.NotNull;
import org.screamingsandals.discord.forum.ForumManager;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;

import java.time.Instant;

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
    }
}
