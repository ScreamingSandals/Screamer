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
import net.dv8tion.jda.api.events.interaction.component.ButtonInteractionEvent;
import net.dv8tion.jda.api.hooks.SubscribeEvent;
import org.jetbrains.annotations.NotNull;
import org.screamingsandals.discord.InteractionConstants;
import org.screamingsandals.discord.forum.ForumManager;

@RequiredArgsConstructor
public class ButtonInteractionListener {
    private final @NotNull ForumManager forumManager;

    @SubscribeEvent
    public void onEvent(@NotNull ButtonInteractionEvent event) {
        if (event.getChannelType().isThread()) {
            // Thread buttons
            if (event.getComponentId().startsWith(InteractionConstants.BUTTON_TOGGLE_ARCHIVED + ":")) {
                var threadSnowflake = event.getComponentId().split(":")[1];
                if (forumManager.isChannelRegistered(threadSnowflake)) {
                    var threadChannel = event.getJDA().getThreadChannelById(threadSnowflake);
                    if (threadChannel != null) {
                        var newValue = !threadChannel.isArchived();
                        event.deferEdit()
                                .queue(c -> threadChannel.getManager().setArchived(newValue).reason("User clicked a button to change an archived state of a thread.").queue());
                    }
                }
            }
        }
    }
}
