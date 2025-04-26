import { neofetch } from "./lib/info";
import { WaifuResponse } from "./lib/waifu";

export async function RaflesiaResponse(command: string | undefined): Promise<{ status: boolean, data: string, type: string }> {
  const perintah = command?.toLocaleLowerCase()

  /**
   * @description Waifu Random
   */

  if (perintah?.includes("waifu")) {
    const jawab = perintah?.replace("waifu", "").replace(/\s/g, "")
    const balas = await WaifuResponse(jawab)
    if (balas.status) {
      return { status: true, data: balas.data, type: "image" }
    } else {
      return { status: false, data: balas.data, type: "text" }
    }
  }

  /**
   * @description Menu
   */

  if (perintah?.includes("menu") || perintah?.includes("help")) {
    /*const helps: string = `
     *Menu*:
      - _AI *?*_
      - _waifu_
      - _menu_
      - _sysinfo_
    `*/
    const helps: string = `
     *Menu*:
      - _AI *?*_
      - _menu_
      - _sysinfo_
    `
    return { status: true, data: helps, type: "text" }
  }

  /**
   * @description System Info
   */

  if (perintah?.includes("sysinfo") || perintah?.includes("info")) {
    return { status: true, data: neofetch, type: "text" }
  }

  return { status: false, data: "Not found", type: "null" }
}

export const CMD = process.env.CMD ?? "!"