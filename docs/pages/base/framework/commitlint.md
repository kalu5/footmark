# Commitlint Config

## install

``` bash
pnpm add -D @commitlint/cli @commitlint/config-conventional @commitlint/types simple-git-hooks
```

## touch config file(commitlint.config.ts)

``` ts
import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'ci', 'build'],
    ],
    'scope-max-length': [RuleConfigSeverity.Error, 'always', 20],
    'subject-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'subject-max-length': [RuleConfigSeverity.Error, 'always', 72],
  },
}

export default Configuration
```

## config git simple hooks(packages.json)

``` json
{
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged",
    "commit-msg": "npx --no -- commitlint --edit"
  },
}
``
