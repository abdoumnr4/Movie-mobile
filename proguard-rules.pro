# Protection contre la rétro-ingénierie
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Obfuscation du code
-obfuscate
-optimizationpasses 5
-dontusemixedcaseclassnames
-dontskipnonpubliclibraryclasses

# Protection des classes React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Protection contre le débogage
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# Protection des classes natives
-keepclasseswithmembernames class * {
    native <methods>;
} 