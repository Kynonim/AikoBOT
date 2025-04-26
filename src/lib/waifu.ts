const WaifuURL = process.env.WAIFU_URL ?? ""

const TagsArray = [
  "waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun",
  "oppai", "selfies", "uniform", "kamisato-ayaka",
  "ero", "ass", "hentai", "milf", "oral", "paizuri", "ecchi"
]

export async function WaifuResponse(teks: string): Promise<{ status: boolean; data: string }> {
  const tagsname: boolean = TagsArray.some((tag => teks.toLowerCase().includes(tag)))
  if (tagsname) {
    const zzz = teks == "" ? getRandomTags() : teks
    const response = await fetch(WaifuURL + zzz, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (response.ok) {
      const data = await response.json()
      return { status: true, data: data?.images[0]?.url }
    } else {
      return { status: false, data: "Failed to fetch data" }
    }
  } else {
    /*const help: string = `
    *Penggunaan*:
    -- Tags --
     - waifu
     - maid
     - marin-kitagawa
     - mori-calliope
     - raiden-shogun
     - ~oppai~
     - selfies
     - uniform
     - kamisato-ayaka
     - ~ero~
     - ~ass~
     - ~hentai~
     - ~milf~
     - ~oral~
     - paizuri
     - ~ecchi~

    *Contoh*:
     _waifu [tags]_
    `*/

    const help: string = `
    *Penggunaan*:
    -- Tags --
     - waifu
     - marin-kitagawa
     - mori-calliope
     - raiden-shogun
     - selfies
     - uniform
     - kamisato-ayaka
     - paizuri

    *Contoh*:
     _waifu [tags]_
    `
    return { status: false, data: help }
  }
}

function getRandomTags(): string {
  const index = Math.floor(Math.random() * TagsArray.length)
  return TagsArray[index]
}