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

package org.screamingsandals.discord.log;

import net.dv8tion.jda.api.EmbedBuilder;
import net.dv8tion.jda.api.JDA;
import org.jetbrains.annotations.Nullable;

import java.awt.*;
import java.io.PrintWriter;
import java.io.StringWriter;

public class DiscordLogUtils {
    public static @Nullable String logChannel;
    public static @Nullable JDA jda;

    public static void sendError(Throwable throwable) {
        if (logChannel == null) {
            return;
        }

        try {
            var sw = new StringWriter();
            throwable.printStackTrace(new PrintWriter(sw));
            var embed = new EmbedBuilder()
                    .setColor(Color.RED)
                    .setTitle("An error occurred: " + throwable.getMessage())
                    .setDescription("```\n" + sw + "\n```")
                    .build();

            jda.getTextChannelById(logChannel).sendMessageEmbeds(embed).queue();
        } catch (Throwable ignored) {
        }
    }
}
