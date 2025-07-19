"use strict";

const Registry = require("winreg");
const path = require("path");
const { app: app_main } = require("electron");
const app = app_main || require("@electron/remote").app;
const Q = require("q");

const { $create, $set, $destroy } = require("electron-regedit-fixed/util");
const ShellOption = require("electron-regedit-fixed/shelloption");
const Regedit = require("electron-regedit-fixed/regedit");
const debug = require("electron-regedit-fixed/debug");

class ProgId {
    constructor({
        progExt = "",
        appName = app.name,
        description = undefined,
        friendlyAppName = undefined,
        hive = Registry.HKCU,
        squirrel = false,
        icon,
        shell = [],
        extensions = [],
        contentType = undefined,
        perceivedType = undefined,
        setDefault = false,
    }) {
        this.progId = progExt ? `${appName}.${progExt}` : `${appName}`;
        this.appName = appName;
        this.description = description;
        this.hive = hive;
        this.icon = icon;
        this.squirrel = squirrel;
        this.friendlyAppName = friendlyAppName;
        this.extensions = extensions;
        this.contentType = contentType;
        this.perceivedType = perceivedType;
        this.setDefault = setDefault;
        this.shell = bindShells(this, shell);
        this.BASE_KEY = `\\Software\\Classes\\${this.appName}`;
        Regedit.add(this);
    }
    uninstall() {
        if (process.platform !== "win32") {
            return false;
        }

        let self = this;

        let registry = new Registry({
            hive: this.hive,
            key: this.BASE_KEY,
        });

        return $destroy(registry);
    }
    install() {
        if (process.platform !== "win32") {
            return false;
        }

        let self = this;

        let registry = new Registry({
            hive: this.hive,
            key: this.BASE_KEY,
        });

        return $create(registry)
            .then(() => registerDescription())
            .then(() => registerIcon())
            .then(() => registerShellCommands())
            .then(() => registerFileAssociations())
            .then(() => debug(`Installed registry "${this.progId}" sucessfully`));

        function registerDescription() {
            if (!self.description) return;
            return $set(registry, Registry.DEFAULT_VALUE, Registry.REG_SZ, JSON.stringify(self.description));
        }

        function registerIcon() {
            if (!self.icon) return;

            let iconPath;
            if (path.isAbsolute(self.icon)) {
                iconPath = self.icon;
            } else {
                iconPath = path.join(process.execPath, "..", self.icon);
            }

            let defaultIcon = new Registry({
                hive: self.hive,
                key: `${self.BASE_KEY}\\DefaultIcon`,
            });

            return $create(defaultIcon).then(() => $set(defaultIcon, Registry.DEFAULT_VALUE, Registry.REG_SZ, '"' + iconPath + '"'));
        }

        function registerShellCommands() {
            let shells = self.shell.map((shell) => shell.install());
            return Q.all(shells);
        }

        function registerFileAssociations() {
            let extensions = self.extensions.map((ext) => registerFileExtension(ext).then(() => registerMIMEType(ext)));
            return Q.all(extensions);
        }

        function registerMIMEType(ext) {
            let registry = new Registry({
                hive: self.hive,
                key: `\\Software\\Classes\\.${ext}`,
            });

            return $create(registry).then(() =>
                Q.all([
                    ...(self.contentType !== undefined
                        ? [
                              $set(
                                  registry,
                                  // Should have a space.
                                  '"Content Type"',
                                  Registry.REG_SZ,
                                  // THIS STRING MUST HAVE QUOTES IN IT, OTHERWISE IT WILL CREATE A CPU LEAK!
                                  `"${self.contentType}"`
                              ),
                          ]
                        : []),
                    ...(self.perceivedType !== undefined
                        ? [
                              $set(
                                  registry,
                                  // Should not have a space.
                                  '"PerceivedType"',
                                  Registry.REG_SZ,
                                  // THIS STRING MUST HAVE QUOTES IN IT, OTHERWISE IT WILL CREATE A CPU LEAK!
                                  `"${self.perceivedType}"`
                              ),
                          ]
                        : []),
                ])
            );
        }

        function registerFileExtension(ext) {
            let registry = new Registry({
                hive: self.hive,
                key: `\\Software\\Classes\\.${ext}\\OpenWithProgids`,
            });
            let registryB = new Registry({
                hive: self.hive,
                key: `\\Software\\Classes\\.${ext}\\OpenWithProgids`,
            });

            return $create(registry).then(() =>
                Q.all([
                    $set(
                        registry,
                        self.progId,
                        Registry.REG_SZ,
                        // THIS STRING MUST HAVE QUOTES IN IT, OTHERWISE IT WILL CREATE A CPU LEAK!
                        '""'
                    ),
                    ...(self.setDefault
                        ? [$create(registryB).then(() => $set(registryB, Registry.DEFAULT_VALUE, Registry.REG_SZ, '"' + self.progId + '"'))]
                        : []),
                ])
            );
        }
    }
}

function bindShells(prog, shell) {
    if (Array.isArray(shell) && shell.length === 0) {
        shell.push(new ShellOption({}));
    }

    return shell.map((s) => s.bindProg(prog));
}

module.exports = ProgId;

