import translate, { DeeplLanguages } from 'deepl'

const auth_key:string = (process.env.NEXT_PUBLIC_DEEPL_AUTH_KEY === undefined)? "":process.env.NEXT_PUBLIC_DEEPL_AUTH_KEY;

export async function Translator(text:string, target: DeeplLanguages) {
    const res = await translate({free_api:true, text: text, target_lang:target, auth_key:auth_key})
    const result = res.data.translations
    return result[0]
}