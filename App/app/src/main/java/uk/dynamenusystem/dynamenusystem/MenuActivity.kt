package uk.dynamenusystem.dynamenusystem

import android.content.Context
import android.content.Intent
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators.DEVICE_CREDENTIAL
import androidx.biometric.BiometricPrompt
import android.net.wifi.WifiManager
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import android.view.KeyEvent
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import java.net.InetAddress
import java.net.UnknownHostException
import java.util.concurrent.Executor


class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)


        val biometricManager = BiometricManager.from(this)
        when (biometricManager.canAuthenticate(DEVICE_CREDENTIAL)) {
            BiometricManager.BIOMETRIC_SUCCESS ->
                Log.d("MY_APP_TAG", "App can authenticate using biometrics.")
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE ->
                Log.e("MY_APP_TAG", "No biometric features available on this device.")
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE ->
                Log.e("MY_APP_TAG", "Biometric features are currently unavailable.")
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                val enrollIntent = Intent(Settings.ACTION_BIOMETRIC_ENROLL).apply {
                    putExtra(Settings.EXTRA_BIOMETRIC_AUTHENTICATORS_ALLOWED,
                        DEVICE_CREDENTIAL)
                }
                startActivityForResult(enrollIntent, 1)
            }
            BiometricManager.BIOMETRIC_ERROR_SECURITY_UPDATE_REQUIRED -> {
                Log.e("MY_APP_TAG", "Security Update required.")
            }
            BiometricManager.BIOMETRIC_ERROR_UNSUPPORTED -> {
                Log.e("MY_APP_TAG", "Passcode feature is unsupported")
            }
            BiometricManager.BIOMETRIC_STATUS_UNKNOWN -> {
                Log.e("MY_APP_TAG", "Unknown biometrics")
            }
        }

        lateinit var biometricPrompt: BiometricPrompt
        val executor: Executor = ContextCompat.getMainExecutor(this)
            biometricPrompt = BiometricPrompt(this, executor,
                object : BiometricPrompt.AuthenticationCallback() {
                    override fun onAuthenticationError(errorCode: Int,
                                                       errString: CharSequence) {
                        super.onAuthenticationError(errorCode, errString)
                        Toast.makeText(applicationContext,
                            "Authentication error: $errString", Toast.LENGTH_SHORT)
                            .show()
                    }

                    override fun onAuthenticationSucceeded(
                        result: BiometricPrompt.AuthenticationResult) {
                        super.onAuthenticationSucceeded(result)
                        Toast.makeText(applicationContext,
                            "Authentication succeeded!", Toast.LENGTH_SHORT)
                            .show()
                    }

                    override fun onAuthenticationFailed() {
                        super.onAuthenticationFailed()
                        Toast.makeText(applicationContext, "Authentication failed",
                            Toast.LENGTH_SHORT)
                            .show()
                    }
                })

        val promptInfo: BiometricPrompt.PromptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric login for my app")
            .setSubtitle("Log in using your biometric credential")
            .setAllowedAuthenticators(DEVICE_CREDENTIAL)
            .build()

            // Prompt appears when user clicks "Log in".
            // Consider integrating with the keystore to unlock cryptographic operations,
            // if needed by your app.
        biometricPrompt.authenticate(promptInfo).
        val response = 

        val builder = AlertDialog.Builder(this)
            builder.setTitle("Alert title")
            builder.setMessage(response.toString())
            builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
            }

            builder.setNegativeButton(R.string.notOkayPrompt) { _, _ ->
            }
            builder.show()






































































        //Hides the system UI such as the status bar and home buttons bar
        fun hideSystemUI() {
            WindowCompat.setDecorFitsSystemWindows(window, false)
            WindowInsetsControllerCompat(window, findViewById(R.id.menuConstraintLayout)).let { controller ->
                controller.hide(WindowInsetsCompat.Type.systemBars())
                controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

            }


        }
        //Runs the function
        //hideSystemUI()

        //Finds the layout and locks the swipe to open feature
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawerLayout)
        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)

        val navigationView1 = findViewById<NavigationView>(R.id.navigationView)
        navigationView1.setNavigationItemSelectedListener {

            when (it.itemId) {
                R.id.networkDetailsTab -> {

                    val builder = AlertDialog.Builder(this)
                    builder.setTitle("Network Stats")
                    builder.setMessage(
                        getIpAddress(applicationContext) + "\n" + getSignalStrength(applicationContext).toString()

                    )

                    builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
                    }
                    builder.show()


                }

                R.id.downloadLatestTab -> {

                    val builder = AlertDialog.Builder(this)
                    builder.setTitle("Alert title")
                    builder.setMessage("Download latest pressed")
                    builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
                    }
                    builder.show()


                }

                R.id.unlockDeviceTab -> {
                    stopLockTask()
                    hideSystemUI()

                }



            }
            true
        }

    }

    private fun getIpAddress(context: Context): String {
        val wifiManager = context.applicationContext
            .getSystemService(WIFI_SERVICE) as WifiManager
        var ipAddress = intToInetAddress(wifiManager.dhcpInfo.ipAddress).toString()
        ipAddress = ipAddress.substring(1)
        return ipAddress
    }

    private fun getSignalStrength(context: Context): Int {
        val wifiManager = context.getSystemService(WIFI_SERVICE) as WifiManager
        val numberOfLevels = 100
        val wifiInfo = wifiManager.connectionInfo
        return WifiManager.calculateSignalLevel(wifiInfo.rssi, numberOfLevels)
    }

    private fun intToInetAddress(hostAddress: Int): InetAddress {
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

    private fun openDrawer() {
        //Opens the drawer when run

        val drawerLayout = findViewById<DrawerLayout>(R.id.drawerLayout)
        drawerLayout.openDrawer(GravityCompat.START)
    }
    private fun closeDrawer() {
        //Opens the drawer when run
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawerLayout)
        drawerLayout.closeDrawer(GravityCompat.START)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        //Waits for the onKeyDown event to take place
        when(keyCode) {
            //Runs function if key down is either volume buttons
            KeyEvent.KEYCODE_VOLUME_UP -> openDrawer()
            KeyEvent.KEYCODE_VOLUME_DOWN -> closeDrawer()
        }
        return true
    }

}


//val builder = AlertDialog.Builder(this)
//builder.setTitle("Alert title")
//builder.setMessage("Alert Message")
//builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
//}
//
//builder.setNegativeButton(R.string.notOkayPrompt) { _, _ ->
//}
//builder.show()




