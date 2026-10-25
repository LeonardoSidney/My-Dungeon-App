package com.my_dungeon_app.streaming

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import com.my_dungeon_app.R

class StreamingKeepAliveService : Service() {

  private var wakeLock: PowerManager.WakeLock? = null

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    if (intent?.action == ACTION_STOP) {
      stopKeepAlive()
      return START_NOT_STICKY
    }

    startKeepAlive()
    return START_NOT_STICKY
  }

  override fun onTimeout(startId: Int, fgsType: Int) {
    stopKeepAlive()
  }

  override fun onDestroy() {
    releaseWakeLock()
    super.onDestroy()
  }

  private fun startKeepAlive() {
    createNotificationChannel()
    ServiceCompat.startForeground(
        this,
        NOTIFICATION_ID,
        buildNotification(),
        ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC,
    )
    acquireWakeLock()
  }

  private fun stopKeepAlive() {
    ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      return
    }

    val channel =
        NotificationChannel(
            CHANNEL_ID,
            getString(R.string.streaming_channel_name),
            NotificationManager.IMPORTANCE_LOW,
        )
    getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
  }

  private fun buildNotification(): Notification =
      NotificationCompat.Builder(this, CHANNEL_ID)
          .setSmallIcon(android.R.drawable.stat_sys_download)
          .setContentTitle(getString(R.string.streaming_notification_title))
          .setContentText(getString(R.string.streaming_notification_text))
          .setContentIntent(buildOpenAppIntent())
          .setOngoing(true)
          .setSilent(true)
          .setPriority(NotificationCompat.PRIORITY_LOW)
          .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
          .build()

  private fun buildOpenAppIntent(): PendingIntent? {
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName) ?: return null
    return PendingIntent.getActivity(this, 0, launchIntent, PendingIntent.FLAG_IMMUTABLE)
  }

  private fun acquireWakeLock() {
    if (wakeLock?.isHeld == true) {
      return
    }

    val powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager
    wakeLock =
        powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, WAKE_LOCK_TAG).apply {
          setReferenceCounted(false)
          acquire(WAKE_LOCK_TIMEOUT_MS)
        }
  }

  private fun releaseWakeLock() {
    wakeLock?.takeIf { it.isHeld }?.release()
    wakeLock = null
  }

  companion object {
    const val ACTION_STOP = "com.my_dungeon_app.streaming.STOP"
    private const val CHANNEL_ID = "streaming"
    private const val NOTIFICATION_ID = 1
    private const val WAKE_LOCK_TAG = "my_dungeon_app:streaming"
    private const val WAKE_LOCK_TIMEOUT_MS = 60 * 60 * 1000L
  }
}
