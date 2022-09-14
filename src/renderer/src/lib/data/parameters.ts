export const parameters: Parameter[] = [
    {
        key: '-ai_view',
        matches: (value) => /^-ai_view$/.test(value)
    },
    {
        key: '-allowoldsave',
        description: 'allowoldsave',
        matches: (value) => /^-allowoldsaves?$/.test(value)
    },
    {
        key: '-audiodebug',
        matches: (value) => /^-audiodebug$/.test(value)
    },
    {
        key: '-auto_run',
        matches: (value) => /^-auto_run=\w+$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^\w+$/.test(value)
        }
    },
    {
        key: '-autosave',
        matches: (value) => /^-autosave=(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)$/.test(value),
        description: 'autosave',
        argument: {
            allowAny: false,
            choices: ['NEVER', 'DAILY', 'WEEKLY', 'MONTHLY', 'HALFYEAR', 'YEARLY'],
            matches: (value) => /^(NEVER|DAILY|WEEKLY|MONTHLY|HALFYEAR|YEARLY)$/.test(value)
        }
    },
    {
        key: '-autosave_count',
        matches: (value) => /^-autosave_count=\d+$/.test(value),
        description: 'autosave_count',
        argument: {
            allowAny: true,
            description: 'autosave_count',
            matches: (value) => /^\d+$/.test(value)
        }
    },
    {
        key: '-checksum',
        description: 'checksum',
        matches: (value) => /^-checksum$/.test(value)
    },
    {
        key: '-crash_data_log',
        description: 'crash_data_log',
        matches: (value) => /^-crash_data_log$/.test(value)
    },
    {
        key: '-debug',
        description: 'debug',
        matches: (value) => /^-debug$/.test(value)
    },
    {
        key: '-dump_script_doc',
        description: 'dump_script_doc',
        matches: (value) => /^-dump_script_doc$/.test(value)
    },
    {
        key: '-gamelog',
        matches: (value) => /^-gamelog$/.test(value)
    },
    {
        key: '-hands_off',
        description: 'hands_off',
        matches: (value) => /^-hands_off$/.test(value)
    },
    {
        key: '-historical',
        description: 'historical',
        matches: (value) => /^-historical(=(yes|no))?$/.test(value),
        argument: {
            allowAny: false,
            choices: ['yes', 'no'],
            optional: true,
            matches: (value) => /^yes|no$/.test(value)
        }
    },
    {
        key: '-human_ai',
        description: 'human_ai',
        matches: (value) => /^-human_ai$/.test(value)
    },
    {
        key: '-logpostfix',
        description: 'logpostfix',
        matches: (value) => /^-logpostfix=\w+$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^\w+$/.test(value)
        }
    },
    {
        key: '-logprefix',
        description: 'logprefix',
        matches: (value) => /^-logprefix=\w+$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^\w+$/.test(value)
        }
    },
    {
        key: '-noai',
        matches: (value) => /^-noai$/.test(value)
    },
    {
        key: '-nofilewatcher',
        description: 'nofilewatcher',
        matches: (value) => /^-nofilewatcher$/.test(value)
    },
    {
        key: '-nolauncher',
        description: 'nolauncher',
        matches: (value) => /^-nolauncher$/.test(value)
    },
    {
        key: '-start_minimized',
        description: 'start_minimized',
        matches: (value) => /^-start_minimized$/.test(value)
    },
    {
        key: '-start_save',
        description: 'start_save',
        matches: (value) => /^-start_save=\w+$/.test(value),
        argument: {
            allowAny: true,
            matches: (value) => /^\w+$/.test(value)
        }
    },
    {
        key: '-start_speed',
        description: 'start_speed',
        matches: (value) => /^-start_speed=[0-4]$/.test(value),
        argument: {
            allowAny: true,
            description: 'start_speed',
            matches: (value) => /^[0-4]$/.test(value)
        }
    },
    {
        key: '-start_tag',
        description: 'start_tag',
        matches: (value) => /^-start_tag=[A-Z]{3}$/.test(value),
        argument: {
            allowAny: true,
            description: 'start_tag',
            matches: (value) => /^[A-Z]{3}$/.test(value)
        }
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
    optional?: boolean;
    description?: string;
    matches?: (value: string) => boolean;
}
