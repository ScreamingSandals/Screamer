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

package org.screamingsandals.discord.forum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.spongepowered.configurate.objectmapping.ConfigSerializable;

@ConfigSerializable
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumPost {
    private @NotNull String upstreamChannelSnowflake;
    private @NotNull String postSnowflake;
    private @NotNull String creatorSnowflake;
    private int ticketId;
    private @NotNull String name;
    @Builder.Default
    private boolean closed = false;
    private long closedAt;
    @Builder.Default
    private @Nullable String reportMessageChannelSnowflake = null;
    @Builder.Default
    private @Nullable String reportMessageSnowflake = null;
}
