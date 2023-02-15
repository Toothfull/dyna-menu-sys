// Import express app and mongo class
import { app } from '../main'

// Imports log4js and configures it
import { getLogger } from 'log4js'
const log = getLogger( 'logout' )

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        log.info('User logged out')
        res.send('/login.html')
    })
})
