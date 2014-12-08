# RAD STUDIO XE6 C++

In order to gather together some tips that I'm learning on the way coding with RAD STUDIO XE6 C++ version, I create this documentation. It includes the problems which I run into, and their respective solution I find out.

## App crashes on Android devices
Somehow, with RAD Studio XE6 C++, in my case (the same for others friends) when deploying the app to an Android device it crashes. 

To solve that, first you must update the sdk and the build tools. To do that, open the Android Tools of RAD Studio, and install/update them:

Next, update in RAD Studio the path to **zipalign.exe**. To do so, in RAD Studio, go to *Tools > Options > SDK Manager* and you'll see and exclamation. The path should be in a similar path like the next:
```
C:\Users\Public\Documents\Embarcadero\Studio\14.0\PlatformSDKs\adt-bundle-windows-x86-20131030\sdk\build-tools\19.1.0\zipalign.exe
```
Then you'll be able to deploy it well-working.

## How to debug on Android devices

You can do it inserting breakpoints, but this is a little hard to understand and not useful when you want to know some kick property like TText1->Text. 

The first "multidevice solution" is to use an alert dialog box, with the function:

```
ShowMessage("some text");
```

The best solution for me, is to have a console debug message system. You can do it with this steps:
    * Include `#include <android/log.h>`
    * Use the function `__android_log_print(ANDROID_LOG_VERBOSE, "AppName", "Custom %s", text);`
    * You need a program to catch the message. I use
    https://bitbucket.org/mlopatkin/android-log-viewer/downloads








