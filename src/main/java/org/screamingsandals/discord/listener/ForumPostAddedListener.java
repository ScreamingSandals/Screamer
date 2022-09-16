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

import lombok.extern.slf4j.Slf4j;
import net.dv8tion.jda.api.entities.channel.ChannelType;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.events.channel.ChannelCreateEvent;
import net.dv8tion.jda.api.hooks.EventListener;
import org.jetbrains.annotations.NotNull;

@Slf4j
public class ForumPostAddedListener implements EventListener {
    @Override
    public void onEvent(@NotNull GenericEvent event) {
        if (!(event instanceof ChannelCreateEvent postAddedEvent)) {
            return;
        }

        if (postAddedEvent.getChannel().getType() != ChannelType.GUILD_PUBLIC_THREAD) {
            return;
        }

        var threadChannel = postAddedEvent.getChannel().asThreadChannel();
        if (threadChannel.getParentChannel().getType() != ChannelType.FORUM) {
            return;
        }

        log.info(threadChannel.toString());
    }
}
