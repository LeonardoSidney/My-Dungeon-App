package com.my_dungeon_app.streaming

import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.my_dungeon_app.specs.NativeStreamingKeepAliveSpec

class NativeStreamingKeepAliveModule(reactContext: ReactApplicationContext) :
    NativeStreamingKeepAliveSpec(reactContext) {

  override fun getName(): String = NAME

  override fun start(promise: Promise) {
    try {
      ContextCompat.startForegroundService(reactApplicationContext, serviceIntent())
      promise.resolve(null)
    } catch (error: IllegalStateException) {
      promise.reject(START_FAILED, error)
    }
  }

  override fun stop(promise: Promise) {
    try {
      reactApplicationContext.startService(serviceIntent().setAction(StreamingKeepAliveService.ACTION_STOP))
      promise.resolve(null)
    } catch (error: IllegalStateException) {
      promise.reject(STOP_FAILED, error)
    }
  }

  private fun serviceIntent(): Intent =
      Intent(reactApplicationContext, StreamingKeepAliveService::class.java)

  companion object {
    const val NAME = "NativeStreamingKeepAlive"
    private const val START_FAILED = "START_FAILED"
    private const val STOP_FAILED = "STOP_FAILED"
  }
}
