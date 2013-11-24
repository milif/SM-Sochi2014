# Setup and building

This document describes how to set up your development environment to build app, and
explains the basic mechanics of using `git`, `node`, `npm`, `grunt`, and `bower`.

1. {@link #setup-and-building_installing-dependencies Installing Dependencies}
2. {@link #setup-and-building_forking-on-github Forking on Github}
3. {@link #setup-and-building_building-app Building app}
4. {@link #setup-and-building_команды-менеджера-задач Команды менеджера задач}

## Installing Dependencies

Before you can build, you must install and configure the following dependencies on your
machine:

* {@link http://git-scm.com/ Git}: The {@link http://help.github.com/mac-git-installation Github Guide to
Installing Git} is a good source of information.

* {@link http://nodejs.org Node.js}: We use Node to generate the documentation, run a
development web server, run tests, and generate distributable files. Depending on your system, you can install Node either from source or as a
pre-packaged bundle.

* {@link http://www.java.com Java}: We minify JavaScript using our
{@link https://developers.google.com/closure/ Closure Tools} jar. Make sure you have Java (version 6 or higher) installed
and included in your {@link http://docs.oracle.com/javase/tutorial/essential/environment/paths.html PATH} variable.

* {@link http://gruntjs.com Grunt}: We use Grunt as our build system. Install the grunt command-line tool globally with:

  ```shell
  npm install -g grunt-cli
  ```

* {@link http://bower.io/ Bower}: We use Bower to manage client-side packages for the docs. Install the `bower` command-line tool globally with:

  ```shell
  npm install -g bower
  ```


## Forking on Github

To create a Github account, follow the instructions {@link https://github.com/signup/free here}.
Afterwards, go ahead and {@link http://help.github.com/forking fork} the {@link
<main repository> main repository}.


## Building app

To build, you clone the source code repository and use Grunt to generate the non-minified and
minified files:

```shell
# Clone your Github repository:
git clone git@github.com:<github username>/<repository name>.git

# Go to the app directory:
cd <repository name>

# Add the main  repository as an upstream remote to your repository:
git remote add upstream <main repository>

# Install node.js dependencies:
npm install

# Build app:
grunt package
```

<div class="alert alert-warning">
**Note:** If you're using Windows, you must use an elevated command prompt (right click, run as
Administrator). This is because `grunt package` creates some symbolic links.
</div>

The build output can be located under the `build` directory.

## Команды менеджера задач

Полная установка приложения и сайта документации:

    `grunt package`

Повторная инициализация приложения (без установки bower-компонент):

    `grunt init`

Пересборка сайта документации:

    `grunt docs`

Пересборка приложения:

    `grunt app`
   
