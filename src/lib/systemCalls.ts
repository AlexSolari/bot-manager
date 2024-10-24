import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export async function getLogs(botName: string) {
    return import.meta.env.MODE == 'development'
        ? (
              await execAsync(
                  `Get-Content "D:\\!src\\bot-manager\\dummy-data\\` +
                      botName +
                      `.txt"`,
                  { shell: 'powershell.exe' }
              )
          ).stdout
        : (await execAsync(`sudo journalctl -u ` + botName + `.service -n 100`))
              .stdout;
}
export async function getStorageFiles() {
    return (
        import.meta.env.MODE == 'development'
            ? (
                  await execAsync(
                      '(ls -r D:\\!src\\funnyBot\\storage).fullname',
                      { shell: 'powershell.exe' }
                  )
              ).stdout
            : (
                  await execAsync(
                      'sudo find /mnt/dietpi_userdata/funnyBot/storage -name "*.json"'
                  )
              ).stdout
    )
        .split('\n')
        .filter((x) => x)
        .map((x) => x.replaceAll('\r', ''))
        .filter((x) => x.endsWith('json') && !x.includes('Metadata'));
}
export async function getMetadataFiles() {
    return (
        import.meta.env.MODE == 'development'
            ? (
                  await execAsync(
                      '(ls -r D:\\!src\\funnyBot\\storage).fullname',
                      { shell: 'powershell.exe' }
                  )
              ).stdout
            : (
                  await execAsync(
                      'sudo find /mnt/dietpi_userdata/funnyBot/storage -name "*.json"'
                  )
              ).stdout
    )
        .split('\n')
        .filter((x) => x)
        .map((x) => x.replaceAll('\r', ''))
        .filter((x) => x.endsWith('json') && x.includes('Metadata'));
}
export async function restartBot(name: string) {
    if (import.meta.env.MODE == 'development') {
        console.log('restart requested for bot ' + name);
    } else {
        (await execAsync(`sudo systemctl restart ` + name + `.service`)).stdout;
    }
}
