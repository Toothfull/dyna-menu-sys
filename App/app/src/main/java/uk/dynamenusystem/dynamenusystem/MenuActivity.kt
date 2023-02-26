package uk.dynamenusystem.dynamenusystem

import android.content.Context
import android.net.wifi.WifiManager
import android.os.Bundle
import android.view.KeyEvent
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import java.net.InetAddress
import java.net.UnknownHostException


class MenuActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_menu)


        //Hides the system UI such as the status bar and home buttons bar
        fun hideSystemUI() {
            WindowCompat.setDecorFitsSystemWindows(window, false)
            WindowInsetsControllerCompat(window, findViewById(R.id.menuConstraintLayout)).let { controller ->
                controller.hide(WindowInsetsCompat.Type.systemBars())
                controller.systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }


        }
        //Runs the function
        hideSystemUI()

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
                        "address is " + getIpAddress(applicationContext).toString()
                    )
                    builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
                    }
                    builder.show()

                    true
                }

                R.id.downloadLatestTab -> {

                    val builder = AlertDialog.Builder(this)
                    builder.setTitle("Alert title")
                    builder.setMessage("Download latest pressed")
                    builder.setPositiveButton(R.string.okayPrompt) { _, _ ->
                    }
                    builder.show()

                    true
                }


                else -> false
            }
            true
        }

    }

    private fun getIpAddress(context: Context): String? {
        val wifiManager = context.applicationContext
            .getSystemService(WIFI_SERVICE) as WifiManager
        var ipAddress = intToInetAddress(wifiManager.dhcpInfo.ipAddress).toString()
        ipAddress = ipAddress.substring(1)
        return ipAddress
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




