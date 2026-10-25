package com.my_dungeon_app.streaming

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class StreamingKeepAlivePackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    if (name != NativeStreamingKeepAliveModule.NAME) {
      return null
    }

    return NativeStreamingKeepAliveModule(reactContext)
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    mapOf(
        NativeStreamingKeepAliveModule.NAME to
            ReactModuleInfo(
                name = NativeStreamingKeepAliveModule.NAME,
                className = NativeStreamingKeepAliveModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true,
            )
    )
  }
}
