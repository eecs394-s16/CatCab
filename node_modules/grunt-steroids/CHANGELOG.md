#1.2.0 (2015-08-03)

Features:
- `steroids-make-module-env` copies installed Composer Modules installed with `steroids` to `dist/` for use with `supersonic.modules`

#1.1.1 (2015-05-18)

Changes:
- Rename Steroids Enterprise configuration file `module.json` to `appgyver.json`

#1.1.0 (2015-05-12)

Features:
- `steroids-make-module-env` task for compiling Steroids Enterprise Module configuration

#1.0.7 (2015-01-26)

Bugfixes:
- SASS/SCSS native style files are compiled from all `app/` subfolders to `dist/native-styles`, so e.g. `app/common/native-styles/ios.scss` is compiled to `dist/native-styles/ios.css` as expected. See also [#23](https://github.com/AppGyver/grunt-steroids/issues/23) for a known issue. Shoutout to @jDeppen for the pull request!

#1.0.6 (2014-12-03)

Initial commit of the Steroids²/Supersonic version of `grunt-steroids`.

The library works as before for old Steroids projects. For new Supersonic projects, `grunt-steroids` handles the new module-based `app/` folder format, along with all the existing goodies.

Read more about Supersonic and Steroids² in the new documentation at [http://docs.appgyver.com](http://docs.appgyver.com).

#0.2.3 (2014-10-29)

Do not compile SASS and SCSS files from www/components (the Bower components directory).

#0.2.2 (2014-05-22)

Support for *.android.scss and *.android.sass. Thanks to @couhajjou for the pull request!

#0.2.1 (2014-04-28)

SCSS files prefixed with `_` won't be compiled and thus can be used with `@import`, minor error logging fixes, updated dependencies.

Features:
- SCSS files prefixed with `_` (e.g. `_importThis.scss`) won't be compiled and thus can be used with `@import`.

Changes:
- Grunt npm dependencies updated to latest versions.

Bugfixes:
- `steroids-configure` task now gives a proper error message if `www/config.xml` is missing.

#0.2.0 (2014-02-17)

Added `steroids-configure` Grunt task to `steroids-make` defaults, used to parse [Steroids Addons](http://www.appgyver.com/steroids/addons) feature configurations from `www/config.xml`.

#0.1.2 (2013-12-19)

Updated absolute version numbers for dependencies to latest.

#0.1.1 (2013-12-13)

Fixed `steroids-concat-models` task using `dist/models/` as source instead of `app/models/`. This fixes concatenation of `.coffee` model files into `models.js`.

#0.1.0 (2013-12-12)

Initial release. Defines the default Steroids make task `steroids-make` and the SASS compile task `steroids-compile-sass`.
