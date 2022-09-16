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

package org.screamingsandals.discord.config;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.UnknownNullability;
import org.spongepowered.configurate.ConfigurateException;
import org.spongepowered.configurate.ConfigurationNode;
import org.spongepowered.configurate.gson.GsonConfigurationLoader;

import java.io.File;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class Settings {
    private final @NotNull File file;
    @Getter
    @UnknownNullability("Nullable until loadConfiguration() is called")
    private ConfigurationNode node;

    public void loadConfiguration() throws ConfigurateException {
        var loader = GsonConfigurationLoader.builder()
                .file(file)
                .build();

        var existedBefore = file.exists();

        node = loader.load();

        var generator = new ConfigGenerator(loader, node);
        // @formatter:off
        generator.start()
                .key("token").defValue("PUT YOUR TOKEN HERE")
                .section("logChannel")
                    .key("enabled").defValue(false)
                    .key("channel").defValue("PUT CHANNEL HERE")
                .back()
                .section("forum")
                    .key("enabled").defValue(true)
                    .key("channels").defValue(List::of)
                .back();
        // @formatter:on
        generator.saveIfModified();

        if (!existedBefore) {
            log.info("File settings.json has been created, please fill in the token. Exiting...");
            System.exit(0);
        }
    }
}
