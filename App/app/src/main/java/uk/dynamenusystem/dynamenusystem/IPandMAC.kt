package uk.dynamenusystem.dynamenusystem

import android.content.Context
import android.net.wifi.WifiManager
import androidx.appcompat.app.AppCompatActivity
import java.net.InetAddress
import java.net.UnknownHostException

class IPandMAC {
	companion object{
		 fun getIpAddress(context: Context): String {
			val wifiManager = context
				.getSystemService(AppCompatActivity.WIFI_SERVICE) as WifiManager
			var ipAddress = intToInetAddress(wifiManager.dhcpInfo.ipAddress).toString()
			ipAddress = ipAddress.substring(1)
			return ipAddress
		}

		 fun getSignalStrength(context: Context): Int {
			val wifiManager = context.getSystemService(AppCompatActivity.WIFI_SERVICE) as WifiManager
			val numberOfLevels = 100
			val wifiInfo = wifiManager.connectionInfo
			return WifiManager.calculateSignalLevel(wifiInfo.rssi, numberOfLevels)
		}

		 fun intToInetAddress(hostAddress: Int): InetAddress {
			val addressBytes = byteArrayOf(
				(0xff and hostAddress).toByte(),
				(0xff and (hostAddress shr 8)).toByte(),
				(0xff and (hostAddress shr 16)).toByte(),
				(0xff and (hostAddress shr 24)).toByte()
			)
			return try {
				InetAddress.getByAddress(addressBytes)
			} catch (e: UnknownHostException) {
				throw AssertionError()
			}
		}
	}
}