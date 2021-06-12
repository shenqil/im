import { app, protocol } from 'electron';
import appProtocol from './appProtocol'

protocol.registerSchemesAsPrivileged([appProtocol.config])

app.whenReady().then(() => {
    appProtocol.register()
})