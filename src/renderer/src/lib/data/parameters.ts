export const parameters: Parameter[] = [
    {
        key: '-ai_view',
        matches: (value) => /-ai_view\b/.test(value)
    },
    {
        key: '-allowoldsave',
        description:
            'Allows save games with older save game versions to be loaded with only a tooltip warning, instead of blocking them altogether. Especially useful for testing shortly after increasing the save game version, since recent save games will still be loadable and relevant.',
        matches: (value) => /^-allowoldsave(s)?\b$/.test(value)
    },
    {
        key: '-audiodebug',
        matches: (value) => /^-audiodebug\b$/.test(value)
    },
    {
        key: '-auto_run',
        matches: (value) => /^-auto_run=[A-Za-z0-9]+\b$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^[A-Za-z0-9]+\b$/.test(value)
        }
    },
    {
        key: '-autosave',
        matches: (value) => /^-autosave=\b(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)\b$/.test(value),
        description: "Overrides the autosave interval in the user's settings.txt file.",
        argument: {
            allowAny: false,
            choices: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY', 'HALFYEAR', 'YEARLY'],
            matches: (value) => /^\b(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)\b$/.test(value)
        }
    },
    {
        key: '-autosave_count',
        matches: (value) => /^-autosave_count=\b[0-9]*\b$/.test(value),
        description:
            "Overrides the debug_saves count in the user's settings.txt file. Specifies how many autosave files are kept before the oldest one is deleted when creating a new one.",
        argument: {
            allowAny: true,
            matches: (value) => /^\b[0-9]*\b$/.test(value)
        }
    },
    {
        key: '-checksum',
        description:
            "Computes and writes out the overall checksum and the checksum of each individual game data file to logs/system.log. Useful when trying to identify if there is a modification to a single file, or some other file that exists but shouldn't, throwing off the checksum and blocking multiplayer.",
        matches: (value) => /^-checksum\b$/.test(value)
    },
    {
        key: '-crash_data_log',
        description:
            'Collects data on errors based on crashes that occur with critical bugs and malfunctions. Including if a buggy mod is activated from the launcher.',
        matches: (value) => /^-crash_data_log\b$/.test(value)
    },
    {
        key: '-debug',
        description:
            'Indicates that the game is running in debug mode, enabling a variety of extra behavior to help with development or testing. Can be turned on from the game console using the debug command.',
        matches: (value) => /^-debug\b$/.test(value)
    }
];

export interface Parameter {
    key: string;
    description?: string;
    matches: (value: string) => boolean;
    deprecated?: boolean;
    argument?: ParameterArgument;
}

export interface ParameterArgument {
    allowAny: boolean;
    choices?: string[];
    description?: string;
    matches?: (value: string) => boolean;
}
