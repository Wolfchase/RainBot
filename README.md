[![Build Status](https://travis-ci.org/Wolfchase/RainBot.svg?branch=master)](https://travis-ci.org/Wolfchase/RainBot)

# This Codebase is Going Stale!
That said, rainbot.js is looking for a new maintainer! If for some reason you'd like to take over this project, email me at rodolfo.valladares.c@gmail.com. The reason I am no longer maintaining this repo is because I am reenvisioning the bot in golang. However, I have a lot of time invested in this project and I'd hate to see it go. 

## Blog For Development Updates!
http://rainbot-irc.blogspot.com/

## This README
Is incomplete. I've now however added an installation section! Now I got to
start work on API documentation!

# RainBot
Multipurpose, extensible IRC bot written with node.js

## Overview
RainBot is just another IRC bot among the many already made; it started as something for fun rather than need. That being said, plenty of development has still been going into RainBot, well at least as much as a college student can do without drowning themself in work.

#### What RainBot is not
Let me start off by saying, RainBot isn't really meant to be used by others. Not because
I don't want you to, but mostly because I'm a lazy \*\*\*\* and haven't written for you
some proper module api documentation. However, I do believe that a quick glance through
the already developed modules should show you a thing or two!

So now for the million dollar question, should you use RainBot? No and yes. No because
there are probably better bots out there with a better ecosystem, documentation, etc. Hell,
**there are** better bots out there. RainBot isn't meant to compete with any IRC bots out there
already, the main goal from the start was to have fun doing something fun and maybe get some
development experience from doing it. So what's the reason behind yes? You'll make me feel good.
Okay humor aside (but really you will!), other people using the bot would mean better development.
RainBot being used by others means I can potentially receive feedback, which is something I feel
I really need.

#### What RainBot is
Alrighty, so what is RainBot then? It's **just another** IRC bot. As mentioned, its just a
fun little side project for me. But it's been ever more exciting since it actually sees some
use in its home channel, and I guess that for me is enough to mark a success for RainBot. But if
up to this point you're still interested, you can get a small idea of how RainBot works by
reading the "A Few Things RainBot Can Do" section a little more down below.

#### The Branches, What do They Mean Mason?

The master branch is for versions of the bot that are somewhat stable, but not entirely, stable enough that the bot can be used to a reasonable extent. The development branch is where I do all my work and reflects the most up-to-date changes, bugs, and features. If you want actual release
builds, check the releases!

### A Few Things RainBot Can Do

#### Modules
The Bot has been reworked quite a few times to provide easy extensibility via modules.
The result of such efforts? Hard to judge, but see for youself!

Here's a small example showing how you can make a module sporting an echo command,

    module.exports = function(Module, load) {

      // Make a new module!
      myModule = new Module('myModule', 'mm');

      // What good is a module without hooks!?
      myModule.addCommand('echo', {
        help: "Repeats its arguments!",
        action(data, respond, done) {
          if (data.args) respond.say(data.args.join(' '));
          return done();
        }
      });

      // Shut up and take my module!
      return load(myModule);
    }


#### Command Nesting
Command nesting lets you string together commands and pass values forward as
well! Here's some brief examples:

    ;cal f(x) = x * x & ;cal f(3)
    ;roll & ;cal f({roll})

    // Hint, hint: Run these in order!

#### Command Aliasing
Command aliasing let's you take a string of commands  and group them to a singular
name. Also, you can declare parameters to pass to the alias,

    ;alias quote -> ;say "I am broot"
    ;alias enlighten x -> ;say Hey {x}, i am broot!
    ;alias kick person -> ;do kicks {person}

Currently you can only set and remove aliases, but listing aliases will be implemented soon.


## Cool, I Want One!
**-- Begin BS**

Back in the day, when RainBot was just a teeny-tiny little bot, growing up
all adorably in a sweetful laid back environment, RainBot wasn't meant to
be used by others. It's main purpose was to serve it's home channel #Neverfree.
But now, just recently, I've steered development in a different direction. The
direction of "maybe someone can actually find their own use for this heap of, err..
bot."

So here it is! My first attempt ever at guiding you through an installation.

**-- End BS**

#### Get io.js Installed

First thing you will need to do is download io.js and get it working on your system.
You can find it [here](https://iojs.org/en/index.html). It is basically node.js with default harmony features set (which the bot uses, so don't think you can get away easily with just node.js). You could also use the nvm manager found [here](https://github.com/creationix/nvm) (if on windows, check [here](https://github.com/coreybutler/nvm-windows))

Once you have made certain that io.js is installed, you should also now have npm!
It's the package manager for node modules, and you'll be using it a bit to get RainBot
on its feet.

#### Windows People
Switch to a linux distro. Kthx.

Ok no, I want to show some love for Windows here, I've personally used it more than any
other OS. But I am currently using linux as my primary, so I have no idea how future
installations for the bot will go on Windows.

However, do install some kind of terminal with unix commands, like cygwin or git bash
or anything with 'cd' really. It's used by RainBot to preinstall some modules, so if you
get any Windows errors about the command 'cd' not found, not my fault. You have been warned.

#### Download RainBot

Let us now download RainBot, you're most likely on the repo page already if you're
reading this, if not here it [is](https://github.com/Wolfchase/rainbot). You can go ahead and download from the releases, download a zip or tar or just clone it and pull for updates! If you
do the latter cases, make sure its from the master branch, or if you're feeling pretty
couragous, you can try the develop branch, I can't promise you anything from there though.

#### Run npm on RainBot and Modules

Once you got the bot on your machine, your're almost ready to fly! Well actually
if you're on windows it might take a bit longer. You'll see why in a bit. Go to
where ever you put RainBot, and let's run this npm command (To clarify, go into the folder
that contains the source of the bot, you should see a package.json file),

    npm install

After running that command a few things should happen, and may vary if you're on...
yep windows!

If you're on Linux the installation probably had a build error but installed anyway. If the build error was about some optional dependency from the IRC library then there's no need to worry.

On Windows however, you may have some more fatal errors. If one such error happens to be
a node-gyp build error for a dependency actually needed for the IRC library, you might need to install [MS Visual C++](https://www.visualstudio.com/en-us/downloads/download-visual-studio-vs). Yeah, sorry
about that. If you got any other problems related to node-gyp go read it's installation
section on the readme [here](https://github.com/TooTallNate/node-gyp/). You don't have
to actually install anything, just make sure you meet the requirements (Ok, you might need
to install missing requirements if you're actually missing them, I partially lied).

#### Set up the Config

At this point you're practically done, just set up your settings in the config.js
file found in the config folder. The process.env things are for those who know about node, and if you don't, you should totally read up on it a little! Otherwise feel free to get rid of them and put your own settings in there. I've left comments to guide you!

#### Fly!

Once you're done mucking about in the config, you're ready for lift off! Simply find
the nearest convenient terminal or command prompt and run

    iojs rainbot.js

    // or if you used nvm

    node rainbot.js

Yeah this was pretty long to read, but it was aimed at those who didn't know much about
node. If you've had enough experience using node, then you maybe didn't even have to read this.

Anyhow hopefully it helped, and if not, then email me at rodolfo.valladares.c@gmail.com, leave a comment on my blog or find me on the IRC server: irc.canternet.org on the #RainBot channel.

#### Whitelist Some Commands if you Wish

If you want to whitelist some commands, its not entirely that hard, but I guess
I do need to find a simpler way.

Whitelist for commands are added via properties. So you'll need to find
where the command is declared. Don't worry though, I've set my directory structures
for modules to be fairly straightforward. As an example, let's add a whitelist to the
command 'die.' The die command is found inside the rcore module, here's a directory
listing and a pointer showing the file,

    modules...
      rbrella
      rcal
      rchat
      rcore...
        hooks...
          commands...
            alias.js
            chan.js
            die.js <--
            help.js
            mod.js
            ver.js
        index.js

If you open the file you'll find an object like this

    const die = {
      help: 'Best you don\'t use it, unless the bot really needs to go bye bye',
      ASAP: true,
      action: function(data, respond, done) {
        process.exit(0);
      }
    };

Now you probably don't want everyone having access to this command so add a whitelist
property with nicks,

    const die = {
      help: 'Best you don\'t use it, unless the bot really needs to go bye bye',
      ASAP: true,
      whitelist: ['broot', 'you', 'someotherpersonwhocanusethiscommand'],
      action: function(data, respond, done) {
        process.exit(0);
      }
    };

And there you have it, now only the nicks in the whitelist array can use this command.
I understand it isn't the safest way to whitelist commands however, and I am in the process of working a better solution.

## Modules
Todo
