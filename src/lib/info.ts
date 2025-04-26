const date = new Date()

const neofetch: string = `
*User*: riky@Kynonim
*OS*: macOS Sequoia 15.3.2 x86_64
*Host*: MacBook Pro (13-inch, 2018/2019, Four Thunderbolt 3 port
*Kernel*: Darwin 24.3.0
*Timenow*: Tokyo/Japan ${date.getHours()}:${date.getMinutes()}
*Uptime*: ${getUptime().days} days, ${getUptime().hours} hours, ${getUptime().minutes} mins, ${getUptime().seconds} secs
*Packages*: 192 (brew), 13 (brew-cask)
*Shell*: zsh 5.9
*Display (Color LCD)*: 3360x2100 @ 60 Hz (as 1680x1050) in 13
*DE*: Aqua
*WM*: Quartz Compositor 278.2.7
*WM Theme*: Multicolor (Dark)
*Font*: AppleSystemUIFont [System], Helvetica [User]
*Cursor*: Fill - Black, Outline - White (32px)
*Terminal*: Apple Terminal 455
*Terminal Font*: ComicShannsMonoNF-Regular (14pt)
*CPU*: Intel(R) Core(TM) i5-8259U (8) @ 2.30 GHz
*GPU*: Intel Iris Plus Graphics 655 [Integrated]
*Memory*: ${getMemory().randomMemory} GiB / 16.00 GiB (${getMemory().persen}%)
*Swap*: ${getMemory(4).randomMemory} GiB / 4.00 GiB (${getMemory(4).persen}%)
*Disk (/)*: ${getMemory(465).randomMemory} GiB / 465.63 GiB (${getMemory(465).persen}%) - apfs [Read-only]
*Local IP (en0)*: 192.168.11.10/24
*Battery (bq20z451)*: 100% [AC connected]
*Power Adapter*: 61W USB-C Power Adapter
*Locale*: C
`

function getMemory(mem: number = 16) {
  const max = mem * 1024
  const memory = Math.floor(Math.random() * max)
  const persen = Math.round((memory / max) * 100)
  const randomMemory = Math.round(memory / 1024)
  return { persen, randomMemory }
}

function getUptime() {
  const uptimeInMilliseconds = Math.floor(Math.random() * 2592000000)
  
  const uptimeInSeconds = Math.floor(uptimeInMilliseconds / 1000);
  const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));
  const hours = Math.floor((uptimeInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
  const seconds = uptimeInSeconds % 60;

  return { days, hours, minutes, seconds };
}

export { neofetch }