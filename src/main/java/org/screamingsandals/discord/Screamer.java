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

package org.screamingsandals.discord;

import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.hooks.AnnotatedEventManager;
import net.dv8tion.jda.api.requests.GatewayIntent;
import org.screamingsandals.discord.config.Settings;
import org.screamingsandals.discord.forum.ForumManager;
import org.screamingsandals.discord.listener.ButtonInteractionListener;
import org.screamingsandals.discord.listener.ForumPostAddedListener;
import org.screamingsandals.discord.listener.ForumPostArchivedOrUnarchivedListener;
import org.screamingsandals.discord.listener.MessageListener;
import org.screamingsandals.discord.log.DiscordLogUtils;
import org.spongepowered.configurate.ConfigurateException;

import java.io.File;

@Slf4j
public class Screamer {
    public static void main(String[] args) throws InterruptedException, ConfigurateException {
        var file = new File("settings.json");

        var settings = new Settings(file.getAbsoluteFile());
        settings.loadConfiguration();
        var node = settings.getNode();

        var forumFile = new File("data/forum.json");

        var forumManager = new ForumManager(forumFile);
        forumManager.load();

        var jda = JDABuilder.createDefault(node.node("token").getString(""))
                .enableIntents(GatewayIntent.GUILD_MESSAGES)
                .enableIntents(GatewayIntent.MESSAGE_CONTENT)
                .setEventManager(new AnnotatedEventManager())
                .addEventListeners(
                        new MessageListener(settings, forumManager),
                        new ForumPostAddedListener(settings, forumManager),
                        new ForumPostArchivedOrUnarchivedListener(forumManager),
                        new ButtonInteractionListener(forumManager)
                )
                .build();

        if (node.node("logChannel", "enabled").getBoolean()) {
            DiscordLogUtils.logChannel = node.node("logChannel", "channel").getString();
            DiscordLogUtils.jda = jda;
        }

        jda.awaitReady();
    }
}
