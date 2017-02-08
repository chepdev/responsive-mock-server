/* eslint-disable no-console */
const chalk = require('chalk');
const ip = require('ip');

const divider = chalk.gray('\n-----------------------------------');

/**
 * custom utilities to prettify Webpack output.
 */
const friendlySyntaxErrorLabel = 'Syntax error:';
function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}
function formatMessage(message) {
  return message
    .replace(
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // eslint-disable-line no-useless-escape
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

/**
 * Logger middleware
 */
const logger = {
  // Called whenever there's an error on the server we want to print
  error(err) {
    console.error(chalk.red(err));
  },

  info(msg) {
    console.info(chalk.blue(msg));
  },

  // Called when express.js app starts on given port w/o errors
  appStarted(port, env, tunnelURL) {
    process.stdout.write('\x1bc');
    console.log(chalk.green(`Server started - [${env}] ✓`));

    // If the tunnel started, log that and the URL it's available at
    if (tunnelURL) {
      console.log(`${chalk.blue('Tunnel initialised')} ${chalk.green('✓')}`);
    }

    console.log(`${chalk.blue.bold('Access URLs:')}${divider}
      Localhost: ${chalk.magenta(`http://localhost:${port}`)}
            LAN: ${chalk.magenta(`http://${ip.address()}:${port}`) +
      (tunnelURL ? `\n    Proxy: ${chalk.magenta(tunnelURL)}` : '')}${divider}
      ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },

  compiled(stats, port, env) {
    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();
    process.stdout.write('\x1bc');
    if (!hasErrors && !hasWarnings) {
      console.log(chalk.green(`Compiled successfully - [${env}] ✓`));
      console.log(`${chalk.blue.bold('Access URLs:')}${divider}
        Localhost: ${chalk.magenta(`http://localhost:${port}`)}
              LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}${divider}
        ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
      `);
    }
    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const json = stats.toJson({}, true);
    let formattedErrors = json.errors.map((message) =>
      `Error in ${formatMessage(message)}`
    );
    const formattedWarnings = json.warnings.map((message) =>
      `Warning in ${formatMessage(message)}`
    );
    if (hasErrors) {
      if (formattedErrors.some(isLikelyASyntaxError)) {
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }
      formattedErrors.forEach((message) => {
        console.log(message);
        console.log();
      });
      console.log(chalk.red('Failed to compile.'));
      console.log();
      return;
    }
    if (hasWarnings) {
      formattedWarnings.forEach((message) => {
        console.log(message);
        console.log();
      });
      console.log(chalk.yellow('Finished compiling with warnings ⚠'));
      console.log(`${chalk.blue.bold('Access URLs:')}${divider}
        Localhost: ${chalk.magenta(`http://localhost:${port}`)}
              LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}${divider}
        ${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
      `);
    }
  }
};

module.exports = logger;
