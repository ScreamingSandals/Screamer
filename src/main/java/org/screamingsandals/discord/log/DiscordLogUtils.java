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
