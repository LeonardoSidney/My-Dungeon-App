# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.soloader.** { *; }

# Keep OkHttp if used
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Keep fetch/networking related classes
-keep class org.apache.harmony.net.** { *; }
-keep class libcore.net.** { *; }

# Keep JavaScript interfaces
-keepclassmembers class * {
    @com.facebook.react.uimanager.UIProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactContext <methods>;
}
-keepclassmembers enum class com.facebook.react.turbomodule.core.interfacesTurboModule $* {
    public static ** valueOf(java.lang.String);
    public static **[] values();
}

# Hermes
-keep class com.facebook.hermes.reactexecutor.** { *; }
-keep class com.facebook.hermes.internal.** { *; }
