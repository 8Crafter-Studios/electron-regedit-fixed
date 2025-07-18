declare module "electron-regedit-fixed" {
    /**
     * The Regedit class.
     *
     * @hideconstructor
     */
    class Regedit {
        private constructor();
        /**
         * The ProgIds.
         */
        public static progIds: ProgId[];
        /**
         * Adds a ProgId.
         *
         * @param progId The ProgId to add.
         */
        public static add(progId: ProgId): void;
        /**
         * Installs all ProgIds.
         *
         * @returns A promise resolving to an array of `void` and `false`.
         */
        public static installAll(): Q.Promise<Awaited<ReturnType<ProgId["install"]>>[]>;
        /**
         * Hooks into the squirrel startup event.
         *
         * @returns `true` if a squirrel startup event is found in the program parameters.
         */
        public static squirrelStartupEvent(): boolean | undefined;
    }
    /**
     * The ProgId class.
     */
    class ProgId {
        /**
         * The program id.
         */
        public progId: `${string}.${string}` | `${string}`;
        /**
         * The app name.
         */
        public appName: string;
        /**
         * The description of the ProgId.
         *
         * @default undefined
         */
        public description: string | undefined;
        /**
         * The hive of the ShellOption.
         *
         * @default require("winreg").Registry.HKCU
         */
        public hive: string;
        /**
         * The icon of the ShellOption.
         *
         * @default undefined
         */
        public icon: string | undefined;
        /**
         * Whether the ProgId is in squirrel mode.
         *
         * @default undefined
         */
        public squirrel: boolean;
        /**
         * The friendly app name of the ShellOption.
         *
         * @default undefined
         */
        public friendlyAppName: string | undefined;
        /**
         * The extensions of the ProgId.
         *
         * @default []
         */
        public extensions: string[];
        /**
         * The ShellOptions of the ProgId.
         *
         * @default []
         */
        public shell: ShellOption[];
        /**
         * The base registry key.
         *
         * @default `\\Software\\Classes\\${this.appName}`
         */
        public BASE_KEY: `\\Software\\Classes\\${string}`;
        /**
         * Creates a new ProgId.
         *
         * @param param0 The options.
         * @param param0.progExt The program extension.
         * @param param0.appName The app name.
         * @param param0.description The description of the ProgId.
         * @param param0.friendlyAppName The friendly app name of the ShellOption.
         * @param param0.hive The hive of the ShellOption.
         * @param param0.squirrel Whether the ProgId is in squirrel mode.
         * @param param0.icon The icon of the ShellOption.
         * @param param0.shell The ShellOptions of the ProgId.
         * @param param0.extensions The extensions of the ProgId.
         */
        public constructor({
            progExt,
            appName,
            description,
            friendlyAppName,
            hive,
            squirrel,
            icon,
            shell,
            extensions,
        }: {
            progExt?: string | undefined;
            appName?: string | undefined;
            description?: string | undefined;
            friendlyAppName?: string | undefined;
            hive?: string | undefined;
            squirrel?: boolean | undefined;
            icon: string | undefined;
            shell?: ShellOption[] | undefined;
            extensions?: string[] | undefined;
        });
        public uninstall(): false | Promise<void>;
        public install(): false | Promise<void>;
    }
    /**
     * The ShellOption class.
     */
    class ShellOption {
        /**
         * The linked {@link ProgId}.
         */
        public progid: ProgId;
        /**
         * The verb of the ShellOption.
         *
         * @default "open"
         */
        public verb: "open" | "opennew" | "print" | "explore" | "find" | "openas" | "properties" | "edit" | "preview";
        /**
         * The action of the ShellOption.
         *
         * @default undefined
         */
        public action: string | undefined;
        /**
         * Whether the ShellOption is selected.
         *
         * @default false
         */
        public selected: boolean;
        /**
         * The friendly app name of the ShellOption.
         *
         * @default undefined
         */
        public friendlyAppName: string | undefined;
        /**
         * The icon of the ShellOption.
         *
         * @default undefined
         */
        public icon: string | undefined;
        /**
         * The arguments of the ShellOption.
         *
         * @default ["%1"]
         */
        public args: string[] | undefined;
        /**
         * Whether the ShellOption is in squirrel mode.
         *
         * @default undefined
         */
        public squirrel: boolean;
        /**
         * The command of the ShellOption.
         *
         * @default undefined
         */
        public command: string | undefined;
        /**
         * Creates a new ShellOption.
         *
         * @param param0 The options.
         * @param param0.verb The verb of the ShellOption.
         * @param param0.action The action of the ShellOption.
         * @param param0.icon The icon of the ShellOption.
         * @param param0.args The arguments of the ShellOption.
         * @param param0.friendlyAppName The friendly app name of the ShellOption.
         * @param param0.selected Whether the ShellOption is selected.
         * @param param0.squirrel Whether the ShellOption is in squirrel mode.
         * @param param0.command The command of the ShellOption.
         */
        public constructor({
            verb,
            action,
            icon,
            args,
            friendlyAppName,
            selected,
            squirrel,
            command,
        }: {
            verb?: ShellOption["verb"] | undefined;
            action?: string | undefined;
            icon?: string | undefined;
            args?: string[] | undefined;
            friendlyAppName?: undefined;
            selected?: boolean | undefined;
            squirrel?: undefined;
            command?: undefined;
        });
        /**
         * Binds the ShellOption to a ProgId.
         *
         * @param progid The ProgId to bind the ShellOption to.
         * @returns {this} The ShellOption.
         */
        public bindProg(progid: ProgId): this;
        /**
         * Installs the ShellOption.
         *
         * @returns {Promise<void>} A promise resolving to `void` when the ShellOption is installed.
         *
         * @throws {Error} If ShellOption is not part of a ProgId.
         */
        public install(): Promise<void>;
        public static OPEN: "open";
        public static OPEN_NEW: "opennew";
        public static PRINT: "print";
        public static EXPLORE: "explore";
        public static FIND: "find";
        public static OPEN_AS: "openas";
        public static PROPERTIES: "properties";
        public static EDIT: "edit";
        public static PREVIEW: "preview";
    }
}
